uniform sampler2D t_lookup;

uniform sampler2D t_audio;
uniform float timer;
uniform float radius;
uniform float rotationSpeed;
uniform float audioPower;

varying vec3 vPos;
varying vec3 vMPos;
varying float vEdge;
varying vec2 vUv;
varying vec3 vNorm;
varying vec4 vAudio;
varying float vAudioLength;


const float PI = 3.14159;
const float PI2 = PI * 2.;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(){

  vUv = position.xy;

  float whichNum = position.z;

  float rX = rand( vUv );
  rX += 1.;

  float rY = rand( rX * vUv );
  rY += 1.;

  float rZ = rand( rY * vUv );
  rZ += 1.;



  float timeM = timer * rotationSpeed;

  vNorm = normalize( vec3( cos( timeM * rX )  , sin( timeM * rY ) , cos( timeM * rZ ) ));

  // get the center
  vec3 pos = texture2D( t_lookup , vUv ).xyz;



  vAudio = texture2D( t_audio, vec2( vUv.x , 0. ) );
  vAudioLength = length( vAudio );

  float aPow = pow( vAudioLength  , audioPower );

  if( whichNum == 0. ){

    vEdge = 0.;

  }else{


    vEdge = 1.;

    vec3  upVector = vec3( 0. , 1. , 0. );
    float upVectorProj = dot( upVector , vNorm );
    vec3  upVectorPara = upVectorProj * vNorm;
    vec3  upVectorPerp = upVector - upVectorPara;

    vec3 basisX = normalize( upVectorPerp );
    vec3 basisY = cross( vNorm , basisX );


    float theta = ( whichNum / 6. ) * PI2;

    float x = cos( theta );
    float y = sin( theta );

    pos += radius * aPow * x * basisX + radius * aPow * y * basisY;


  }

  vPos = pos;

  vMPos = ( modelMatrix * vec4( vPos , 1.0 )).xyz;


  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );

}
