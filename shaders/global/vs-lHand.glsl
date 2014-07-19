
void main(){
  vec3 mvPos = (modelViewMatrix * vec4( position , 1.0 )).xyz;
  gl_Position = projectionMatrix * vec4( mvPos , 1.0 );
}
