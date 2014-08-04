uniform sampler2D t_audio;
uniform vec3 lightPos;
uniform vec3 cameraPos;

uniform float lightCutoff;
uniform float lightPower;
uniform float shininess;


varying vec3 vPos;
varying vec3 vMPos;
varying float vEdge;
varying vec2 vUv;
varying vec3 vNorm;
varying vec4 vAudio;
varying float vAudioLength;


void main(){


  vec3 lightRay = vMPos - lightPos;
  vec3 lightDir = normalize( lightRay );

  float FR = dot( -lightDir , vNorm );

  float lightDist = length( lightRay );

  float lightAmount =  pow( min( 1. , lightCutoff / lightDist ) , lightPower);

  vec4 aEdge = texture2D( t_audio , vec2( vEdge , 0. ) );

  vec3 refl = reflect( -lightDir , vNorm );

  vec3 camView = vMPos - cameraPos;
  vec3 camDir = normalize( camView );

  float reflFR = max( 0. , dot( -camDir , refl ));

  vec3 glint = vec3( 1. , .6 , .2 ) * pow( reflFR , shininess );
  
  


  float camFR = dot( camDir , vNorm );

  /*if( vEdge < (vAudioLength / 4. ) ){

    discard;

  }*/


  vec3 mani = vec3( .2 , .9 , .6 ) * lightAmount * FR;
  vec3 color = vec3( 0. );

  color += vAudio.xyz * lightAmount;

  color += normalize((vec3( .5 , .5 , .5 ) + vNorm * .5 ));

  color += glint * aEdge.xyz;




  vec4 aCamFR = texture2D( t_audio , vec2( camFR * camFR * camFR *camFR , 0. ) );




  gl_FragColor = vec4( (glint + mani) * aEdge.xyz , 1. ) ;//FR *FR;


}

