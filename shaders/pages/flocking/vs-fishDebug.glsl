attribute vec3 position2;

const int depth = @DEPTH;

uniform float seperationDistance; // 20
uniform float alignmentDistance; // 40
uniform float cohesionDistance; //

uniform sampler2D t_posArray[ depth ];

varying vec4 vColor;
void main(){

  vec3 p  = texture2D( t_posArray[0] , position.xy ).xyz;
  vec3 p2 = texture2D( t_posArray[0] , position2.xy ).xyz;

  float zoneRadius = seperationDistance + alignmentDistance + cohesionDistance;
  float separationThresh = seperationDistance / zoneRadius;
  float alignmentThresh = ( seperationDistance + alignmentDistance ) / zoneRadius;
  float zoneRadiusSquared = zoneRadius * zoneRadius;
  float seperationSquared = seperationDistance * seperationDistance;
  float cohesionSquared = cohesionDistance * cohesionDistance;
  vec3 pos = p;

  vec3 dir = p - p2;
  float dist = length(dir);
  float distSquared = dist * dist;
  
  float percent = distSquared / zoneRadiusSquared;

  
  vColor = vec4( 1. , 1. , 1. , 0.01  );

  if( distSquared < zoneRadiusSquared ) {
      vColor = vec4( 1. , 1.  , 1. , .1 );

    if( percent < separationThresh ){

      vColor = vec4( 1. , 1.  , 1. , .2 );

    }else if( percent < alignmentThresh ){

      vColor = vec4(1. , 1.  , 1. , .5 );

    }else{

      vColor = vec4( 1. , 1. , 1. , 1. );


    }
  }

  vColor *= vec4( normalize( dir ) * .5 + .5 , 1. ); 

 
 /* if( position.z > .5 ){
    pos = o;
  }

  vec3 dif = p - o;

  vColor = vec4( 0., 1. , 0. , .1 );

  if( length( dif ) < predatorRepelRadius ){

    vColor = vec4( 1. , 0. , 0. , 1. );
    //gl_LineWidth = 1000.;//min( 10., 1000. / length(( p - cameraPosition)));

  }*/

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );


}
