varying float vDepth;

const int depth = @DEPTH;

uniform sampler2D t_posArray[ depth ];

varying vec3 vVel;
varying float vExploded;

void main(){

  vec3 p = vec3( 0. );
  vec3 p1 = vec3( 0. );
  for( int i = 0; i < depth; i++ ){ 
    if( i == int( position.z )){
      vec4 tmp = texture2D( t_posArray[i] , position.xy );
      p = tmp.xyz;

      vExploded = tmp.w - 1.5;
      if( int( position.z ) <= depth-1 ){
        p1 =  texture2D( t_posArray[i+1] , position.xy ).xyz;
      }else{
        p1 =  texture2D( t_posArray[i-1] , position.xy ).xyz;
      }

    }

    
     /* if( 5 == int( position.z )){
      p = texture2D( t_posArray[5] , position.xy ).xyz;
    }*/
  }

  vVel = p - p1;
  vDepth = float( position.z ) / float( depth );

  gl_PointSize = 10.;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( p , 1. );


}
