 

#extension GL_OES_standard_derivatives : enable

uniform vec3 mirrorColor;
uniform sampler2D mirrorSampler;
uniform sampler2D t_audio;
uniform sampler2D t_normal;
uniform float time;

varying vec4 mirrorCoord;
varying vec3 vNormal;
varying mat3 vNormalMat;
varying float vDisplacement;

varying vec3 vPos;
varying vec2 vUv;
varying vec3 vEye;

float blendOverlay(float base, float blend) {
    return( base < 0.5 ? ( 2.0 * base * blend ) : (1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
}

void main() {

  vec3 q0 = dFdx( vPos.xyz );
  vec3 q1 = dFdy( vPos.xyz );
  vec2 st0 = dFdx( vUv.st );
  vec2 st1 = dFdy( vUv.st );

  vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
  vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  vec3 N = normalize( vNormal );

  vec2 offset = vec2( sin( time * .0142)  , cos( time * .02345 ) );
  vec3 mapN = texture2D( t_normal, (vUv * 10. )+offset ).xyz * 2.0 - 1.0;
  mapN     += texture2D( t_normal,(vUv * 8. )-offset.yx * 2. ).xyz * 2.0 - 1.0;
  mapN     += texture2D( t_normal,(vUv * 13. )-offset*3. ).xyz * 2.0 - 1.0;
  //mapN.xy = normalScale * mapN.xy;
  mapN.xy = 1.5 * mapN.xy;

  mat3 tsn = mat3( S, T, N );
  vec3 fNormal =  normalize( tsn * mapN ); 

  vec3 nNormal = normalize( vNormalMat * fNormal );

  float fr = dot( normalize(vEye) , nNormal );



  vec4 color = texture2DProj(mirrorSampler, mirrorCoord +vec4( nNormal*50. ,0.));
  color = vec4(blendOverlay(mirrorColor.r, color.r), blendOverlay(mirrorColor.g, color.g), blendOverlay(mirrorColor.b, color.b), 1.0);

  vec4 a = texture2D( t_audio , vec2( abs(fr ), 0. ) );
 
  float fRR = pow( max( 0. , fr ) , 3. );
  float dist = pow(  1. -  (1000. / length( vEye )) , 100.);

  float d = (length( vEye ) / 3500. );
  vec4 c1 = a * vec4( 1. , .7 , .2 , 1. ) * (1. - fRR) * .8;
  vec4 c2 =  4. * max( 0. , fr  ) * a * color * a * color;
  vec4 c3 =  fRR * color  +fr * a *1.;
  gl_FragColor = (1. -  d*d*d*d*d) * (2. *c1 + c2);// + c3;

  //gl_FragColor = vec4( 1. ) * (length( vEye ) / 4000. ) * (  length( vEye ) / 4000. );

  

}


