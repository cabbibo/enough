attribute vec3 tri1;
attribute vec3 tri2;

uniform vec3 lightPos;
uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_audio;
uniform sampler2D t_og;

uniform float audioDisplacement;

varying vec2 vUv;
varying vec3 vVel;

varying vec3 vPos;
varying vec3 vMPos;
varying vec3 vMVPos;
varying mat3 vNormalMatrix;



varying vec3 vLightDir;

varying float vLife;
varying vec4 vAudio;

varying vec3 vNorm;

varying vec3 vCamPos;
varying vec3 vCamVec;
varying vec3 vMNorm;

const float size  = @SIZE;
const float iSize = @ISIZE;
const float hSize = @HSIZE;

vec3 getNormal( vec3 p , vec2 uv ){

  vec3 upX  = p;
  vec3 doX  = p;
  vec3 upY  = p;
  vec3 doY  = p;

  if( uv.x > iSize ){
    doX = texture2D( t_pos , uv - vec2( iSize , 0. ) ).xyz;
  }
   
  if( uv.x < 1.- iSize ){
    upX = texture2D( t_pos , uv + vec2( iSize , 0. ) ).xyz;
  }

  if( uv.y > iSize ){
    doY = texture2D( t_pos , uv - vec2( 0. , iSize ) ).xyz;
  }


  if( uv.y < 1. - iSize ){
    upY = texture2D( t_pos , uv + vec2( 0. , iSize ) ).xyz;
  }


  vec3 dX = upX - doX;
  vec3 dY = upY - doY;

  return normalize( cross( dX , dY ) );


}

void main(){

  vUv = position.xy;
  //vec4 pos = texture2D( t_pos , vec2( vUv.x , (1. - (vUv.y + .125)) ) );
  vec4 pos = texture2D( t_pos , vUv );
  vec4 v1 = texture2D( t_pos , tri1.xy );
  vec4 v2 = texture2D( t_pos , tri2.xy );
  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 ogPos = texture2D( t_og , vUv );

  vec3 norm = getNormal( pos.xyz , vUv );

  vVel = pos.xyz - oPos.xyz;

  vec3 a1 = pos.xyz - v1.xyz;
  vec3 a2 = pos.xyz - v2.xyz;

  vNorm = norm;//normalize( cross( a1 , a2 ) );


  vLife = length( pos.xyz - ogPos.xyz );
    
    //vNorm = normalize( a1 );

  //vNorm = normalize( vec3( tri1.x , tri1.y , 0. ) );

  vMPos = ( modelMatrix * vec4( pos.xyz , 1. ) ).xyz;
  vMNorm = ( modelMatrix * vec4( vNorm.xyz , 0. ) ).xyz;
  vMVPos = ( modelViewMatrix * vec4( pos.xyz , 0. ) ).xyz;

  //vAudio = texture2D( t_audio , vec2( abs(vNorm.x) , 0. ) );

  pos.xyz += vNorm * length(vAudio )* audioDisplacement;//01;
  vLightDir = normalize( vMPos - lightPos );

  vCamVec = normalize( cameraPosition - vMPos);
  float lu = abs( dot( vCamVec , vNorm ));

  vAudio = texture2D( t_audio , vec2( lu , 0. ));

  pos.xyz += length( vAudio ) * vNorm * audioDisplacement;

  vPos = pos.xyz;
 
  vNormalMatrix = normalMatrix;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos.xyz , 1. );


}
