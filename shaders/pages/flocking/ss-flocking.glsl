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


uniform vec3 scenePos;

uniform float centerForce;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;

uniform sampler2D t_vortex;


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

    float life = sample.w;

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

    float c_lineIndex = 0.;
    float c_lineDist = 100000.;

    for( int i = 0; i < 15; i++ ){

      vec2 lookup = vec2( 0. , float( i ) / 16. );
      vec2 lookupU = vec2( 0. , float( i + 1 ) / 16. );
      vec3 sp = texture2D( t_vortex , lookup ).xyz;
      vec3 ep = texture2D( t_vortex , lookupU ).xyz;

      sp = sp - scenePos;
      ep = ep - scenePos;
      
      //vec3 sp = startPoints[i];
      //vec3 ep = endPoints[i];

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
          c_lineIndex = float( i ) / 16.;

        }

      }
     
    }
 
    vec3 lineTangent = cross( normalize(c_lineToPoint) , c_lineDir );


    // Inside the frame
    if( c_lineDist < 100000. ){
      
      if( c_lineDist <  c_lineIndex * 200. ){
        force += ( .1 * c_lineDir +  .5 *  normalize( lineTangent  ) + .01  * normalize( c_lineToPoint ) );
      }else{
        force -= normalize( c_lineToPoint ) * .01 ;
      }
    
    // Bring inside the frame
    }else{
      
      vec3 central = texture2D( t_vortex , vec2( 0., 1.) ).xyz;
      central = central - scenePos;

      // Attract flocks to the center
      //vec3 central = predator;
      dir = pos - central;
      dist = length( dir );

       
      force -= dir * dist * .000001;

      //if( dist < 30. ){ life = 30.; }


    } 
    
   
    vec3 randForce =vec3( sin( time  * 1. * length(uv)+4. ) , sin( time  * 3. * length(uv)+4. ) ,sin( time  * 5. * length(uv)+4. )  );
   // randForce -= vec3( .5 );

    randForce = normalize( randForce ) * .01 * rand( uv ) ;

    force += randForce;



    // Gets our dist to the bottom of the vertex
    if( life < 0. ){

      vec3 central = texture2D( t_vortex , vec2( 0., 1.) ).xyz;
      central = central - scenePos;

      central += randForce * 100.;
      // Attract flocks to the center
      //vec3 central = predator;
      dir = pos - central;
      dist = length( dir );

       
      force -= dir * dist * .00001;

      if( dist < 30. ){ life = 30.; }


    }

//    if( life > 1. ){

      vec3 central = texture2D( t_vortex , vec2( 0., 0.) ).xyz;
      central = central - scenePos;

      // Attract flocks to the center
      //vec3 central = predator;
      dir = pos - central;
      dist = length( dir );
    
      if( dist < 10. ){
      
        life = 1.;

      }

//    }
    if( life > 0. && life <= 1. ){

      vec3 central = texture2D( t_vortex , vec2( 0., 0.) ).xyz;
      central = central - scenePos;

      // Attract flocks to the center
      //vec3 central = predator;
      dir = pos - central;
      dist = length( dir );

       
      force += dir * dist * .01;


    }
     

    // making sure that object travels perpendicular to 
    // intersection point, because we want it to continue to move
    // and not get trapped.
   /* if( dist < predatorRepelRadius ){

      vec3 tangent = cross( normalize( dir ) , normalize(vec3( 0 , 1 , 0)) );
      force += normalize( tangent * .1 ) * .001;
      force += .001 *  dir * pow(abs(( dist - predatorRepelRadius)),1.) * predatorRepelPower;
    
 // force += normalize( dir) * predatorRepelPower;



    }*/

    // this make tends to fly around than down or up
    // if (velocity.y > 0.) velocity.y *= (1. - 0.2 * delta);

    vel += force ;


    vel *= .99;
    // Speed Limits
    if ( length( vel ) > maxVel ) {
      vel = normalize( vel ) * maxVel;
    }

    life -= dT;
    gl_FragColor = vec4( pos + vel, life  );

}
