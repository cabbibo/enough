varying vec2 vUv;
varying vec3 vMVPos;

varying vec3 vMNorm;
void main(){

  vUv = uv;

  vMNorm = normalMatrix * normal;

  vec4 mv = modelViewMatrix * vec4( position , 1. );
  vMVPos = mv.xyz;

  gl_Position = projectionMatrix * mv;

}
