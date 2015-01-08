#extension GL_OES_standard_derivatives : enable

uniform vec3 lightPos;
uniform sampler2D t_scene;
uniform sampler2D t_normal;
uniform sampler2D t_audio;
uniform float  timer;
uniform vec2 SS;
uniform float dpr;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

varying vec3 vNorm;
varying vec3 vPos;

varying mat3 vNormalMat;
varying vec3 vLightDir;
varying vec3 vLightPos;
varying vec3 vView;
varying vec3 vMVPos;

varying vec2 vUv;

$simplex


//uniform float texScale;
uniform float normalScale;

void main(){ 

  vec3 q0 = dFdx( vPos.xyz );
  vec3 q1 = dFdy( vPos.xyz );
  vec2 st0 = dFdx( vUv.st );
  vec2 st1 = dFdy( vUv.st );

  vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
  vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  vec3 N = normalize( vNorm );

  vec2 offset = vec2( sin( timer * .0142)  , cos( timer * .02345 ) );
  vec3 mapN = texture2D( t_normal, (vUv * 100. )+offset ).xyz * 2.0 - 1.0;
  mapN     += texture2D( t_normal,(vUv * 100. )-offset ).xyz * 2.0 - 1.0;
  //mapN.xy = normalScale * mapN.xy;
  mapN.xy = .4 * mapN.xy;
 
  mat3 tsn = mat3( S, T, N );
  vec3 fNormal =  normalize( tsn * mapN ); 

  vec3 nNormal = normalize( vNormalMat * fNormal  );
  vec3 nView = normalize(vView);
  vec3 nReflection = normalize( reflect( vView , nNormal )); 

  vec3 refl = reflect( vLightDir , nNormal );
  float facingRatio = abs( dot(  nNormal, refl) );

  float newDot = dot( normalize( nNormal ), nView );
  float inverse_dot_view = 1.0 - max( newDot  , 0.0);


  vec2 nScreenCoord = gl_FragCoord.xy / ( SS* dpr);
  vec4 reflC = texture2D( t_scene , nScreenCoord  );
 
  float fr = facingRatio;
  float uF = 1. - fr;

  float FM = fr * fr * fr * fr;

  float uFM = uF * uF * uF * uF *uF*uF*uF;

  vec4 aC = texture2D( t_audio , vec2( inverse_dot_view , 0. ) );
  vec4 aC2 = texture2D( t_audio , vec2( 1.-inverse_dot_view , 0. ) );
  vec4 fC = reflC *fr*5.* aC2+ vec4( .5, .9, 2. , 1. ) * fr * aC;
  vec4 audC = texture2D( t_audio , vec2( fr , 0. )  );


  float d = length( vMVPos );
  //fC = reflC*fr*5.;
  //gl_FragColor = 20. * reflC * audC * normalize(  reflC * audC ) - vec4( 0. , 0. , 0. , length( fC ) );
  gl_FragColor = vec4( .3 , 0. , 0. , 0. ) + (4. * reflC * aC*aC2*(1.-fr) + aC2* (vec4( d )/10000.));// * audC * normalize(  reflC * audC ) - vec4( mapN, .3 ) + vec4( .3 , 0. , 0. , 1. );
  //gl_FragColor = (vec4( d )/10000.);// * audC * normalize(  reflC * audC ) - vec4( mapN, .3 ) + vec4( .3 , 0. , 0. , 1. );
  


}

