varying vec3 vView;
varying mat3 vNormalMat;
varying vec3 vLightDir;
varying vec3 vPos;
varying vec3 vMPos;
varying vec2 vActiveLookup;
varying float vActiveDistance;

varying vec2 vUv;

void main(){

  gl_FragColor = vec4( vPos.z / 100. , 0. , 0. , 1. );

}
