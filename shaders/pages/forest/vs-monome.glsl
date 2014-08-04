uniform sampler2D t_audio;

uniform vec3 lightPos;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vMPos;
varying vec3 vView;
varying mat3 vNormalMat;
varying vec3 vLightDir;
varying vec3 vRefl;
varying float vFacingRatio;
varying float vLookup;

void main(){

  vPos  = position;
  vNormal = normal;
  vUv   = uv;

  vView = modelViewMatrix[3].xyz;
  vNormalMat = normalMatrix;
  
 // vec3 audioPower = 

  vMPos = (modelMatrix * vec4( vPos , 1.0 )).xyz;

  vLightDir = normalize(lightPos - vMPos);

  vRefl =  reflect( vLightDir , vNormal );

  vFacingRatio = max( 0. , dot( vNormal , -vLightDir ));
  float facingRatio = abs( dot( vNormal , vRefl) );
    
  float newDot = dot( vNormal  , normalize(vView) );
  float inverse_dot_view = 1.0 - max( newDot  , 0.0);
  vLookup = inverse_dot_view * (1.- facingRatio);

 /* vec3 refl = reflect( vLightDir , finalNormal );
  float facingRatio = abs( dot( finalNormal , refl) );
  float newDot = dot( finalNormal  , normalize(vView) );
  float inverse_dot_view = 1.0 - max( newDot  , 0.0);*/


  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );

}
