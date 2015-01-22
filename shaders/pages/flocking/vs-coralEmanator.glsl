
varying float radius;
void main(){

  radius = position.x;
  gl_PointSize =min( 500. ,  position.x);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( 0. , 0. , 0. , 1. );


}
