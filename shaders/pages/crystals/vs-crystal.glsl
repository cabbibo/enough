
attribute float id;

varying vec3 vPos;
varying vec3 vNorm;
varying float vID;


void main(){

  vPos  = (modelViewMatrix * vec4( position , 1. )).xyz;
  vNorm = (modelViewMatrix * vec4( normal , 0. )).xyz;
  vID   = id;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1. );

}
