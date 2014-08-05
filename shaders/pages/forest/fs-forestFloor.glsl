
#extension GL_OES_standard_derivatives : enable


uniform sampler2D t_active;
uniform sampler2D t_audio;
uniform sampler2D t_normal;
uniform vec3 cameraPos;

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

  float reflFR = max( 0. , dot( -refl , normalize(cameraPos - vMPos) ));

  float fr = dot(-vLightDir, fNormal );



  vec3 active = texture2D( t_active , vActiveLookup ).xyz;
  vec3 audio = texture2D( t_audio , vec2( 1. - reflFR * reflFR * reflFR ,  0. ) ).xyz;

  vec3 aColor = audio * vActiveDistance * vActiveDistance*vActiveDistance;
  vec3 activeColor = active * fr * fr * fr* fr * fr * fr *fr * fr * fr *fr * fr * fr* fr * fr * fr * vActiveDistance * vActiveDistance*vActiveDistance;

  gl_FragColor = vec4( vActiveDistance * fNormal +  vActiveDistance *audio  , 1. );

}
