varying vec3 vView;
varying vec3 vNormal;
varying vec3 vLightDir;
varying vec3 vMPos;
varying vec3 vPos;
varying vec2 vActiveLookup;
varying float vActiveDistance;

varying vec2 vUv;


uniform vec2 size;
uniform vec3 lightPos;


const float pixelSize = 1. / 16.;
const float hPixelSize = .5 / 16.;

//const float size = 1. / 64.;
//const float hSize = size / 2.;


vec4 getPos( vec2 uvpos , vec2 offset ){
 
  vec2 UV = uvpos + offset;


  float xPosDown = floor( UV.x  * 16. );
  float xPosUp   = ceil(  UV.x * 16. );
  float xDif     = ( UV.x * 16. ) - xPosDown; // 0 - 1

  float xDist    = abs( .5 - xDif );
  
  float yPosDown = floor( UV.y * 16. );
  float yPosUp   = ceil(  UV.y * 16. );
  float yDif     = ( UV.y * 16. ) - yPosDown;
  float yDist    = abs( .5 - yDif );

  float dist     = max( 0. , 1. - ( pow( xDist * xDist + yDist * yDist , .5 ) )*2.);


  vec3 pos = vec3( (UV.x-.5) * size.x , (UV.y-.5) * size.y , 0. );

  pos.z = dist * 50.;



  return vec4( pos , dist );


}



void main(){

  vUv = uv;

  float xDown = floor( uv.x  * 16. )/16.;
  xDown += hPixelSize; 
  float yDown = floor( uv.y  * 16. )/16.;
  yDown += hPixelSize;

  vActiveLookup = vec2( xDown , 1.-yDown );

  vec4 main = getPos( uv , vec2( 0. , 0. ) );

  float dist = main.w;

  vec3 pos  = main.xyz;
  /*vec3 pXUp = getPos( uv , vec2( 0.004 , 0. ) ).xyz;
  vec3 pXDo = getPos( uv , vec2( -.004 , 0. ) ).xyz;
  vec3 pYUp = getPos( uv , vec2( 0. , 0.004 ) ).xyz;
  vec3 pYDo = getPos( uv , vec2( 0. , -.004 ) ).xyz;

  vec3 xDif =  normalize(pXUp - pXDo);
  vec3 yDif = normalize(pYUp - pYDo);

  vec3 norm = normalize( cross( xDif , yDif ) );*/

  vec3 norm = normal;
 
  //norm.z *= -1.;
    
  vPos = pos;

  vNormal = normalize((modelMatrix * vec4( norm , 0. ) ).xyz);
  vView = modelViewMatrix[3].xyz;
  vMPos = (modelMatrix * vec4( vPos , 1.0 )).xyz;
  
  vec3 lightDir = normalize( lightPos -  vMPos );
  vLightDir = lightDir;
  vActiveDistance = smoothstep( -.1 , 1. , dist );

  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );
  


}
