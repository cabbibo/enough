#extension GL_OES_standard_derivatives : enable

uniform vec3 lightPos;
uniform float timer;
uniform sampler2D t_normal;
uniform sampler2D t_audio;
uniform sampler2D tLookup;
uniform sampler2D t_iri;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

varying vec3 vNorm;
varying vec3 vPos;

varying vec2 vUv;

varying float vDisplacement;
varying float vMatch;


varying mat3 vNormalMat;
varying vec3 vLightDir;
varying vec3 vLightPos;
varying vec3 vView;
varying vec3 vMVPos;

uniform float texScale;
uniform float normalScale;
uniform float alive;


void main(){ 

   vec3 q0 = dFdx( vPos.xyz );
  vec3 q1 = dFdy( vPos.xyz );
  vec2 st0 = dFdx( vUv.st );
  vec2 st1 = dFdy( vUv.st );

  vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
  vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  vec3 N = normalize( vNorm );

  vec2 offset =vec2( sin( timer * .0642)  , cos( timer * .05345 ) );

  vec3 mapN = texture2D( t_normal, (vUv * 1. )+offset ).xyz * 2.0 - 1.0;
  mapN     += texture2D( t_normal,(vUv * 1. )-offset ).xyz * 2.0 - 1.0;

  //mapN.xy = normalScale * mapN.xy;
  mapN.xy = 2. * mapN.xy;
 
  mat3 tsn = mat3( S, T, N );
  vec3 fNormal =  normalize( tsn * mapN ); 

  float m = dot(-( vNormalMat * fNormal ) , normalize( vView ));
  vec4 a1 = texture2D( t_audio , vec2( m , 0. ) );
  vec4 a2 = texture2D( t_audio , vec2( (1. - m ) , 0. ) );

  vec4 c1 = texture2D( t_iri ,vec2( abs(vDisplacement) , 0. ) );

  gl_FragColor = alive * (1. - m ) * vec4( 1. , .8 , .3,1. ) + (1.-alive)*m*m*m * a1 * vec4( 1. , .8 , .3,1.)  ; //+ vec4( a1.xyz * vec3( 1. , .8 , .3 ) + (1.-m ) * a2.xyz, 1.0 );
  


}

