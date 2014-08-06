
#extension GL_OES_standard_derivatives : enable


uniform sampler2D t_active;
uniform sampler2D t_audio;
uniform sampler2D t_normal;
uniform sampler2D t_iri;
uniform vec3 cameraPos;

uniform vec3 neutralColor;
uniform vec3 hoverColor;
uniform vec3 selectedColor;
uniform vec3 playingColor;


uniform float texScale;
uniform float normalScale;

varying vec3 vView;
varying mat3 vNormalMat;
varying vec3 vLightDir;
varying vec3 vPos;
varying vec3 vMPos;
varying vec2 vActiveLookup;
varying float vActiveDistance;
varying vec3 vNormal;

varying vec2 vUv;


void main(){

  vec3 q0 = dFdx( vPos.xyz );
  vec3 q1 = dFdy( vPos.xyz );
  vec2 st0 = dFdx( vUv.st );
  vec2 st1 = dFdy( vUv.st );

  vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
  vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  vec3 N = normalize( vNormal );


  vec3 mapN = texture2D( t_normal, vUv*texScale).xyz * 2.0 - 1.0;
  mapN.xy = normalScale * mapN.xy;
 
  mat3 tsn = mat3( S, T, N );
  vec3 fNormal =  normalize( tsn * mapN ); 


  //vec3 fNormal = vNormal;
  vec3 refl = reflect( -vLightDir , fNormal );

  float reflFR =  dot( -refl , normalize(cameraPos - vMPos) );

  float fr = dot(-vLightDir, fNormal );



  vec3 active = texture2D( t_active , vActiveLookup ).xyz;

   float hovered   = active.x;
  float selected  = active.y;
  float current   = active.z;

  float lookupOffset = 0.;


  if( hovered == 0. && selected == 0. && current == 0. ){
    lookupOffset = 0.;
  }

  if( hovered == 1. && selected == 0. && current == 0. ){
    lookupOffset = 1.;
  }

  if( hovered == 0. && selected == 1. && current == 0. ){
    lookupOffset = 2.;
  }

  if( hovered == 0. && selected == 0. && current == 1. ){
    lookupOffset = 3.;
  }

  if( hovered == 1. && selected == 1. && current == 0. ){
    lookupOffset = 4.;
  }


  if( hovered == 0. && selected == 1. && current == 1. ){
    lookupOffset = 5.;
  }

  if( hovered == 1. && selected == 1. && current == 1. ){
    lookupOffset = 5.;
  }

  if( hovered == 1. && selected == 0. && current == 1. ){
    lookupOffset = 5.;
  }

  lookupOffset /= 6.;

  /*if( selected == 0. ){

    discard;

  }*/

  //vec3 refl = reflect( -vLightDir , fNormal );
  float facingRatio = abs( dot( fNormal , refl) );
  float newDot = dot( fNormal  , normalize(vView) );
  float inverse_dot_view = 1.0 - max( newDot  , 0.0);

  float fLookup =(  inverse_dot_view * abs(reflFR)  * (1./6.) ) +lookupOffset;


  vec3 audio = texture2D( t_audio , vec2( 1. - abs(reflFR * reflFR * reflFR) ,  0. ) ).xyz;

  vec3 aColor = audio * vActiveDistance;

  vec3 lookup_table_color = texture2D( t_iri , vec2( fLookup , 0. ) ).xyz;

  vec3 c =  lookup_table_color * aColor * (1.-fr);



  gl_FragColor = vec4(  c , 1. );

}
