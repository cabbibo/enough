uniform sampler2D t_audio;

uniform vec3 lightPos;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vMVPos;
varying vec3 vView;
varying mat3 vNormalMat;
varying vec3 vLightDir;


void main(){

  vPos  = position;
  vNormal = normal;
  vUv   = uv;

  vView = modelViewMatrix[3].xyz;
  vNormalMat = normalMatrix;
  
 // vec3 audioPower = 

  vMVPos = (modelViewMatrix * vec4( vPos , 1.0 )).xyz;

  vLightDir = normalize(lightPos - vMVPos);


  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );

}
