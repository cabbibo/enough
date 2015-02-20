uniform vec2 resolution;
uniform float time;
uniform float dT; // about 0.016
uniform float freedomFactor;
uniform float maxVel;
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



    for( int i = 0; i < numOfLines; i++ ){

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
        vec3 lineTangent = cross( normalize(lineToPoint) , lineDir );

        // getting position along line:
        float line =  length( proj ) / length( sp - ep );

        if( lineDist < (10. * abs( sin( line * 2. + time) )) +2. ){

          force += normalize( lineTangent - .1 * abs(sin( time * abs(sin( float( i + 5)) )))* normalize(lineToPoint) );
              

        }else{
       
        force -= normalize( lineTangent - .1 * abs(sin( time * abs(sin( float( i + 5)) )))* normalize(lineToPoint) ); 
          //force += lineToPoint * .1;

        }

      }
  




    }
    
   
    vec3 randForce =vec3( sin( time  * 1. * length(uv)+4. ) , sin( time  * 3. * length(uv)+4. ) ,sin( time  * 5. * length(uv)+4. )  );
   // randForce -= vec3( .5 );

    randForce = normalize( randForce ) * .04;

    force += randForce;

    // Attract flocks to the center
   /* vec3 central = predator;
    dir = pos - central;
    dist = length( dir );
    //dir.y *= 2.5;
    force -= normalize( dir ) * centerPower * 1.;


    // making sure that object travels perpendicular to 
    // intersection point, because we want it to continue to move
    // and not get trapped.
    if( dist < predatorRepelRadius ){

      vec3 tangent = cross( normalize( dir ) , normalize(vec3( 0 , 1 , 0)) );
      force += normalize( tangent * .1 ) * .001;
      force += .000001 *  dir * pow(abs(( dist - predatorRepelRadius)),1.) * predatorRepelPower;


     // force += normalize( dir) * predatorRepelPower;



    }*/

    // this make tends to fly around than down or up
    // if (velocity.y > 0.) velocity.y *= (1. - 0.2 * delta);

    vel += force * forceMultiplier * dT;


    // Speed Limits
    if ( length( vel ) > maxVel ) {
      vel = normalize( vel ) * maxVel;
    }

    gl_FragColor = vec4( pos + vel * velMultiplier * dT, 1. );

}
