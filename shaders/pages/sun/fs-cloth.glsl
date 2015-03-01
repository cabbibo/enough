#extension GL_OES_standard_derivatives : enable


uniform sampler2D t_audio;

varying mat3 vNormalMatrix;

uniform samplerCube t_refl;
uniform samplerCube t_refr;
uniform sampler2D t_flag;
uniform sampler2D t_normal;
uniform sampler2D t_iri;
uniform sampler2D t_matcap;

uniform float time;
uniform float custom1;
uniform float custom2;
uniform float custom3;

varying vec3 vNorm;
varying vec3 vMNorm;
varying vec3 vCamVec;
varying vec3 vMPos;
varying vec3 vMVPos;
varying vec3 vLightDir;
varying vec3 vPos;
varying vec2 vUv;
varying vec4 vAudio;

const float smoothing = 1. / 32.;
uniform float texScale ;
uniform float normalScale;


$hsv
$uvNormalMap
$semLookup


void main(){

 //  vec2 tLookup = vec2( vUv );
  /*tLookup *= 1. / textureScale;
  tLookup -= (1. / textureScale)/2.;// / 2.;
  tLookup += textureScale;// / 2.;*/
  
  //float distance = 1.-title.r;
  //float lum = smoothstep( 0.6 - smoothing , 0.6 + smoothing , distance );

 // vec2 newNorm = vec2( 3. , 3. ) * lum;




 vec2 offset = vec2( 0. );
  vec3 fNorm = uvNormalMap( t_normal , vPos , vUv , vNorm , texScale , normalScale , offset * 5.15123465);



  float lu = abs(dot( vCamVec , vMNorm ));
  float luf = abs(dot( vCamVec , fNorm ));

  vec3 refl = reflect( vLightDir , fNorm );

  float spec = abs( dot( vCamVec , refl  ) );
  float lambert = max( 0. , dot( vLightDir , fNorm ) );

  float reflFR = abs(dot( vCamVec , refl ));


  vec3 reflCol = hsv( reflFR / 1.3 + sin( time ) , .5 , 1. );
// float luf = abs(dot( vCamVec , fNorm ));
  vec4 aC = texture2D( t_audio , vec2( spec , 0. ));
  

 
  /*if( vUv.x < .02 ){

    discard;

  }*/

 vec2 semUV = semLookup( normalize( vMVPos ) , normalize(vNormalMatrix * fNorm) );
 vec4 semCol = texture2D( t_matcap , semUV );


gl_FragColor = vec4(aC.xyz * semCol.xyz * reflCol, 1. ); 
  
}
