uniform vec2 resolution;
uniform float time;
uniform float testing;
uniform float dT; // about 0.016
uniform float seperationDistance; // 20
uniform float alignmentDistance; // 40
uniform float cohesionDistance; //
uniform float freedomFactor;
uniform float maxVel;
uniform float centerPower;
uniform float forceMultiplier;
uniform float velMultiplier;
uniform vec3 predator;
uniform float predatorRepelPower;
uniform float predatorRepelRadius;

const int numOfCoral = @NUM_OF_CORAL;
uniform vec3 coral[ numOfCoral ];
uniform float coralRepelRadius;
uniform float coralAttractRadius;
uniform float coralAttractPower;
uniform float coralRepelPower;

uniform float centerForce;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;

const float width = @SIZE;
const float height = width;

const float PI = 3.141592653589793;
const float PI_2 = PI * 2.0;
// const float VISION = PI * 0.55;

float zoneRadius = 40.0;
float zoneRadiusSquared = zoneRadius * zoneRadius;

float separationThresh = 0.45;
float alignmentThresh = 0.65;


const float UPPER_BOUNDS = 400.0;
const float LOWER_BOUNDS = -UPPER_BOUNDS;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()	{

    zoneRadius = seperationDistance + alignmentDistance + cohesionDistance;
    separationThresh = seperationDistance / zoneRadius;
    alignmentThresh = ( seperationDistance + alignmentDistance ) / zoneRadius;
    zoneRadiusSquared = zoneRadius * zoneRadius;


    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 fPos, fVel;

    vec4 sample = texture2D( t_pos, uv );
    vec3 pos = sample.xyz;
    float whichCoral = sample.w;
    vec3 oPos =  texture2D( t_oPos, uv ).xyz;

    vec3 vel = pos - oPos;

    vec3 force = vec3( 0. );

    float dist;
    vec3 dir; // direction
    float distSquared;

    float seperationSquared = seperationDistance * seperationDistance;
    float cohesionSquared = cohesionDistance * cohesionDistance;

    float f;
    float percent;

  //  vec3 velocity = selfVelocity;

    /*float limit = SPEED_LIMIT;

    dir = predator * UPPER_BOUNDS - selfPosition;
    dir.z = 0.;
    // dir.z *= 0.6;
    dist = length( dir );
    distSquared = dist * dist;

    float preyRadius = 150.0;
    float preyRadiusSq = preyRadius * preyRadius;


    // move birds away from predator
    if (dist < preyRadius) {

        f = ( distSquared / preyRadiusSq - 1.0 ) * dT * 100.;
        velocity += normalize( dir ) * f;
        limit += 5.0;
    }*/


    // if (testing == 0.0) {}
    // if ( rand( uv + time ) < freedomFactor ) {}


    // Getting the corals to attract properly
    for( int i =0; i < numOfCoral; i++ ){


      vec3 cP = coral[ i ];
      vec3 dif = pos - cP;
      float l = length( dif );


    //  if( abs(float(i) - whichCoral) < .1 ){
        if( l < coralAttractRadius && l > coralRepelRadius  ){
          force -= normalize( dif ) * coralAttractPower * pow( ( 1. / l ) , 10. );
        }
    //  }

      if( l < coralRepelRadius ){
/*
        if( abs(float(i) - whichCoral) < .1 ){
          whichCoral =  float(numOfCoral) * rand( vec2( time , dT ));
        }*/

        float d = abs( l - coralRepelRadius ); 
        force += normalize( dif ) * coralRepelPower * d * d * d;
      }

    }

    // Attract flocks to the center
    vec3 central = predator;
    dir = pos - central;
    dist = length( dir );
    //dir.y *= 2.5;
    force -= normalize( dir ) * centerPower * 1.;

    if( dist < predatorRepelRadius ){

      force += normalize( dir ) * predatorRepelPower;


    }


    //vec3

    for ( float y = 0.0; y < height; y++ ) {
      for ( float x = 0.0; x < width; x++ ) {
        if ( x == gl_FragCoord.x && y == gl_FragCoord.y ) continue;

        vec2 lookup = vec2( x / resolution.x,  y / resolution.y ) ;
        fPos = texture2D( t_pos, lookup ).xyz;

        dir = fPos - pos;
        dist = length(dir);
        distSquared = dist * dist;

        if ( dist > 0.0 && distSquared < zoneRadiusSquared ) {

          percent = distSquared / zoneRadiusSquared;

          if ( percent < separationThresh ) { // low

              // Separation - Move apart for comfort
              f = (separationThresh / percent - 1.0);
              force -= normalize(dir) * f;

          } else if ( percent < alignmentThresh ) { // high

              // Alignment - fly the same direction
              float threshDelta = alignmentThresh - separationThresh;
              float adjustedPercent = ( percent - separationThresh ) / threshDelta;


              vec3 oFPos =  texture2D( t_oPos, lookup ).xyz;

              fVel = fPos - oFPos;

              f = ( 0.5 - cos( adjustedPercent * PI_2 ) * 0.5 + 0.5 );
              force += normalize(fVel) * f;

          } else {

            // Attraction / Cohesion - move closer
            float threshDelta = 1.0 - alignmentThresh;
            float adjustedPercent = ( percent - alignmentThresh ) / threshDelta;

            f = ( 0.5 - ( cos( adjustedPercent * PI_2 ) * -0.5 + 0.5 ) );

            force += normalize(dir) * f;

          }

        }

      }

    }



    // this make tends to fly around than down or up
    // if (velocity.y > 0.) velocity.y *= (1. - 0.2 * delta);

    vel += force * forceMultiplier * dT;


    // Speed Limits
    if ( length( vel ) > maxVel ) {
      vel = normalize( vel ) * maxVel;
    }

    gl_FragColor = vec4( pos + vel * velMultiplier * dT, whichCoral);

}
