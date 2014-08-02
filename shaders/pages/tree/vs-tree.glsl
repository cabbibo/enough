
uniform vec3 cameraPos;
uniform vec3 lightPositions[7];

uniform float lightCutoff;
uniform float lightPower;


varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vMPos;

varying vec3 vLightDir[7];
varying float vDistMultiplier[7];
varying vec3 vCamDir;

void main(){

  vNorm = ( modelMatrix * vec4( normal , 0. )).xyz;
  vPos  = position;
  vMPos  = ( modelMatrix * vec4( position , 1.  )).xyz;


  for( int i = 0; i < 7; i++ ){

    vec3 lightRay = vMPos - lightPositions[i];
    vLightDir[i] = normalize( lightRay );
    float dist = length( lightRay );

    float distMultiplier = clamp( lightCutoff / dist , 0. , 1. );
    vDistMultiplier[i] = pow( distMultiplier , lightPower );

  }

   
  vCamDir   = normalize( vMPos - cameraPos);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1. );

}
