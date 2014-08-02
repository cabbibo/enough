#extension GL_OES_standard_derivatives : enable

uniform float timer;
uniform sampler2D t_normal;
uniform sampler2D t_iri;

uniform vec3 lightPositions[7];
uniform vec3 lightColors[7];
uniform sampler2D lightTextures[7];
uniform vec3 cameraPos;

uniform float normalScale;
uniform float texScale;
uniform float lightCutoff;
uniform float lightPower;


varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vMPos;
varying vec2 vUv;

varying vec3 vLightDir[7];
varying float vDistMultiplier[7];
varying vec3 vCamDir;



varying vec3 vView;

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




  vec2 centerUV = abs( vUv - vec2( .5 , .5 ) );
  float dCutoff = max( 0. , (1. - pow((length( centerUV )*3.), 2.)));


  vec3 camDir   = normalize( vMPos - cameraPos);


  vec3 totalIri = vec3( 0.);
  for( int i = 0; i < 7; i++ ){

        
    float fr = max( 0. ,  dot( -vLightDir[i] , fNorm ));

    vec3 refl = reflect( -vLightDir[i] , fNorm );
    float reflFR = dot( -refl , vCamDir );

    vec3 iri = texture2D( lightTextures[i] , vec2( reflFR*reflFR , 0. ) ).xyz;

    totalIri +=  lightColors[i] * iri * vDistMultiplier[i] * fr * fr *fr;


  }

  gl_FragColor = vec4( totalIri * dCutoff , 1. );


}
