
uniform vec3 lightPos;

varying vec3 vPos;
varying vec3 vNorm;
varying vec3 vView;

varying mat3 vNormalMat;
varying vec3 vLightDir;
varying float vDisplacement;

varying vec3 vMVPos;

varying vec2 vUv;


void main(){

  vPos  = position;
  vNorm = normal;

  vView = modelViewMatrix[3].xyz;
  vNormalMat = normalMatrix;

  vNorm = normal;
  vUv = uv;
  
  vec3 lightDir = normalize( lightPos -  (modelViewMatrix * vec4( vPos , 1.0 )).xyz );
  vLightDir = lightDir;

  vMVPos = (modelViewMatrix * vec4( vPos , 1.0 )).xyz;


  gl_Position  = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );

}
