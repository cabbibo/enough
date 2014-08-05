varying vec3 vView;
varying vec3 vNormal;
varying vec3 vLightDir;
varying vec3 vMPos;
varying vec3 vPos;
varying vec2 vActiveLookup;
varying float vActiveDistance;

varying vec2 vUv;


uniform vec3 lightPos;


const float size = 1. / 64.;
const float hSize = size / 2.;




void main(){

  vUv = uv;


  float xPosDown = floor( uv.x * 64. );
  float xPosUp   = ceil(  uv.x * 64. );
  float xDif     = ( uv.x * 64. ) - xPosDown; // 0 - 1

  float xDist    = abs( .5 - xDif );
  
  float yPosDown = floor( uv.y * 64. );
  float yPosUp   = ceil(  uv.y * 64. );
  float yDif     = ( uv.y * 64. ) - yPosDown;
  float yDist    = abs( .5 - yDif );

  float dist     = pow( xDist * xDist + yDist * yDist , .5 );


  vNormal = normal;
  vView = modelViewMatrix[3].xyz;
  vMPos = (modelMatrix * vec4( vPos , 1.0 )).xyz;
  
  vec3 lightDir = normalize( lightPos -  vMPos );

  vLightDir = lightDir;

  vActiveDistance = dist;

  vPos = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );
  


}
