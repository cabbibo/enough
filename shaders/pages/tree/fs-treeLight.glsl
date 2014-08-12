#extension GL_OES_standard_derivatives : enable



uniform float timer;
uniform sampler2D t_normal;
uniform sampler2D t_audio;
uniform vec3 cameraPos;
uniform vec3 color;

uniform float hovered;

uniform float normalScale;
uniform float texScale;


varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vMPos;
varying vec2 vUv;
varying vec3 vCamDir;


void main(){


  
  vec3 q0 = dFdx( vPos.xyz );
  vec3 q1 = dFdy( vPos.xyz );
  vec2 st0 = dFdx( vUv.st );
  vec2 st1 = dFdy( vUv.st );

  vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
  vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  vec3 N = normalize( vNorm );

  vec2 offset = vec2(  timer * .000000442 , timer * .0000005345 );

  vec3 mapN = texture2D( t_normal, vUv*texScale+offset ).xyz * 2.0 - 1.0;
  mapN.xy = normalScale * mapN.xy;
 
  mat3 tsn = mat3( S, T, N );
  vec3 fNorm =  normalize( tsn * mapN );

  vec3 camDir   = vCamDir;
  float facingRatio = max( 0. , dot( -fNorm , camDir ) );

  vec4 aFR = texture2D( t_audio , vec2( facingRatio , 0. ) );

  vec3 fColor = color * aFR.xyz + color * .4 * facingRatio + color * .9 * ( 1. - facingRatio ) * hovered;


 
  gl_FragColor = vec4( fColor , 1. );

}
