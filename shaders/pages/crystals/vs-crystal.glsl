
attribute float id;
attribute float edge;

varying vec3 vPos;
varying vec3 vNorm;
varying float vID;
varying float vLength; 

varying vec2 vUv;
varying float vEdge;

void main(){

  vLength = length( position );
  vPos  = (modelMatrix * vec4( position , 1. )).xyz;
  vNorm = (modelMatrix * vec4( normal , 0. )).xyz;
  
  vID   = id;
  vEdge = edge;
  vUv   = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1. );

}
