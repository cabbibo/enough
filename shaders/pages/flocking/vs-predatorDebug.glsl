const int depth = @DEPTH;

uniform vec3 predator;
uniform float predatorRepelRadius;
uniform float predatorRepelPower;

uniform sampler2D t_posArray[ depth ];

varying vec4 vColor;
void main(){

  vec3 p = predator;
  vec3 o = texture2D( t_posArray[0] , position.xy ).xyz;
  vec3 o1 = texture2D( t_posArray[1] , position.xy ).xyz;


  vec3 vel = o - o1;
  vec3 pos = p;
  if( position.z > .5 ){
    pos = o;
  }

  vec3 dif = p - o;

  vColor = vec4( 1., 1. , 1. , .1 );

  if( length( dif ) < predatorRepelRadius ){

    vColor = vec4( 1. , 1. , 1. , 1. );
    //gl_LineWidth = 1000.;//min( 10., 1000. / length(( p - cameraPosition)));

  }

  vColor *= vec4( normalize( vel ) * .5  + .5 , 1. );



  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );


}
