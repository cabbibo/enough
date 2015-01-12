

uniform sampler2D t_normal;
uniform sampler2D t_audio;
uniform sampler2D t_sem;

uniform vec3 color2;
uniform vec3 color1;
uniform vec3 color3;

uniform float custom1;
uniform float custom2;
uniform float custom3;

varying vec2 vUv;
varying vec3 vVel;
varying vec4 vAudio;
varying vec3 vMPos;
varying vec3 vPos;

varying vec3 vNorm;
varying vec3 vMNorm;
varying vec3 vCamPos;

varying vec3 vLightDir;
//varying float vLife;

varying vec3 vCamVec;

varying vec2 vSEM;
varying float vFR;
varying vec3 vReflection;



void main(){

 

   
  float l =  100. / vMPos.y;

  vec4 aC1 = texture2D( t_audio , vec2( abs(dot(vNorm , vec3( 1. , 0. , 0. ))), 0. ) );
 // aC *= texture2D( t_audio , vec2( vUv.x , 0. ) );
 // aC *= texture2D( t_audio , vec2( vUv.y , 0. ) );


  float lamb = max( 0. , dot( -vLightDir , vMNorm ));
  float refl = max( 0. , dot( reflect( vLightDir , vMNorm  )  , vCamVec ));
 // float refl = vMPos - lightPos
  float fr = max( 0. , dot( vCamVec , vMNorm ));
  float iFR = 1. - fr;

  vec3 a = texture2D( t_audio , vec2( abs(sin(dot( reflect( vLightDir , vMNorm  )  , vCamVec ))) , 0. ) ).xyz *iFR;
  vec4 aC = texture2D( t_audio , vec2( abs(sin(dot( -vLightDir , vMNorm ))) , 0. )  );

  vec3 rC = color2 * pow( refl , custom1 * 30. );
  vec3 lC = color1 * pow( lamb , custom2 * 5. );

  //gl_FragColor = vec4( vUv.x, vLife /10000., vUv.y, 1. ); //aC ; //* vec4(  1000. - vMPos.y , 100. / vMPos.y , .3, 1. );
 // gl_FragColor = vec4( vec3( .5 , .4 , .2 ) + vec3( 1. , 1. , .6 ) * aC.xyz * aC1.xyz , 1. ); //aC ; //* vec4(  1000. - vMPos.y , 100. / vMPos.y , .3, 1. );
  //gl_FragColor = vec4( (rC + lC ) + 1. * color3 * a * aC.xyz * custom3, 1. );

  //gl_FragColor = vec4( normalize(vMNorm.xyz) * normalize(vMNorm.xyz) + vec3( .5) , 1. );
 
  vec4 sem = texture2D( t_sem , vSEM );



  gl_FragColor = pow( vFR, 30. ) * 1. * vAudio + vec4( 0.5 * normalize(vReflection ) + 0.7 , 1. ) *   sem; //vec4( vSEM.x , 0. , vSEM.y , 1. );
  //gl_FragColor = vec4( 0.5 * normalize(vReflection ) + 0.7 , 1. ); //vec4( vSEM.x , 0. , vSEM.y , 1. );

 // gl_FragColor = vec4( 1. );
}
