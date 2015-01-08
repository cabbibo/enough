const int depth = @DEPTH;
uniform sampler2D t_posArray[ depth ];
void main(){

  vec3 p = texture2D( t_posArray[0] , position.xy ).xyz;

  gl_PointSize = min( 10., 1000. / length(( p - cameraPosition)));

  gl_Position = projectionMatrix * modelViewMatrix * vec4( p , 1. );


}
