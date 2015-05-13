uniform vec2 resolution;
uniform float time;
uniform float dT; // about 0.016
uniform float freedomFactor;
uniform float maxVel;
uniform vec3 centerPosition;
uniform float centerPower;
uniform float forceMultiplier;
uniform float velMultiplier;
uniform vec3 predator;
uniform float predatorRepelPower;
uniform float predatorRepelRadius;

uniform float centerForce;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;


const int numOfLines = @NUM_OF_LINES;
uniform vec3 startPoints[ numOfLines ];
uniform vec3 endPoints[ numOfLines ];


const float PI = 3.141592653589793;
const float PI_2 = PI * 2.0;
// const float VISION = PI * 0.55;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()	{


    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 fPos, fVel;

    vec4 sample = texture2D( t_pos, uv );
    vec3 pos = sample.xyz;
    vec3 oPos =  texture2D( t_oPos, uv ).xyz;

    vec3 vel = pos - oPos;

    vec3 force = vec3( 0. );

    float dist;
    vec3 dir; // direction
    float distSquared;

    float f;
    float percent;

    //force += .01 *  normalize(centerPosition - pos);


    vec3 c_sp = vec3( 0. );
    vec3 c_ep = vec3( 0. );
    vec3 c_lineDir = vec3( 0. );
    vec3 c_lineToPoint = vec3( 0. );

    float c_lineDist = 100000.;

    for( int i = 0; i < 4; i++ ){

      vec3 sp = startPoints[i];
      vec3 ep = endPoints[i];

      vec3  lineDir = normalize( sp - ep );

      vec3 linePos = sp;
      float dot1 = dot( pos-linePos , lineDir );
      float dot2 = dot( lineDir , lineDir );

      // Vector projector
      vec3 proj =  lineDir * ( dot1 / dot2 );

      float dotProj = dot( proj , ( ep - sp ) );
      if( dotProj > 0. && length( proj ) < length( sp - ep ) ){

        vec3 lineToPoint = pos-linePos - proj;

        float lineDist = length( lineToPoint );

        if( lineDist < c_lineDist ){

          c_lineDist = lineDist;
          c_lineToPoint = lineToPoint;
          c_lineDir = lineDir;

        }

      }
     
    }
 
    vec3 lineTangent = cross( normalize(c_lineToPoint) , c_lineDir );


    // Inside the frame
    if( c_lineDist < 100000. ){
      if( c_lineDist < 20. ){
        force += ( .1 * sin( uv.x * 20. ) * c_lineDir +  .04 *  normalize( lineTangent  ) + .01  * normalize( c_lineToPoint ) );
      }else{
        force -= normalize( c_lineToPoint ) * .1 ;
      }
    
    // Bring inside the frame
    }else{
      force += .01 *  normalize(centerPosition - pos);
    } 
    
   
    vec3 randForce =vec3( sin( time  * 1. * length(uv)+4. ) , sin( time  * 3. * length(uv)+4. ) ,sin( time  * 5. * length(uv)+4. )  );
   // randForce -= vec3( .5 );

    randForce = normalize( randForce ) * .0004;

    force += randForce;

    // Attract flocks to the center
    vec3 central = predator;
    dir = pos - central;
    dist = length( dir );
   


    // making sure that object travels perpendicular to 
    // intersection point, because we want it to continue to move
    // and not get trapped.
    if( dist < predatorRepelRadius ){

      vec3 tangent = cross( normalize( dir ) , normalize(vec3( 0 , 1 , 0)) );
      force += normalize( tangent * .1 ) * .001;
      force += .001 *  dir * pow(abs(( dist - predatorRepelRadius)),1.) * predatorRepelPower;
    
 // force += normalize( dir) * predatorRepelPower;



    }

    // this make tends to fly around than down or up
    // if (velocity.y > 0.) velocity.y *= (1. - 0.2 * delta);

    vel += force ;


    vel *= .99;
    // Speed Limits
    if ( length( vel ) > maxVel ) {
      vel = normalize( vel ) * maxVel;
    }

    gl_FragColor = vec4( pos + vel, 1. );

}
