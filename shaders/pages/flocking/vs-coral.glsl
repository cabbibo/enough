

varying vec3 vNormal;
varying vec3 vMPos;

void main(){


  vec3 pos = position;
  vNormal = normalize(normalMatrix * normal);
  vMPos = ( modelMatrix * vec4( pos , 1. ) ).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );


}
