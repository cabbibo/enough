#extension GL_OES_standard_derivatives : enable

uniform float timer;
uniform sampler2D t_normal;
uniform sampler2D t_iri;
uniform sampler2D t_audio;
uniform sampler2D t_iriFace;
uniform sampler2D t_text;

uniform vec2 textureScale;

uniform float normalScale;
uniform float texScale;

uniform float opacity;

varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vMPos;
varying vec2 vUv;

varying vec3 vLightDir;
varying float vDistMultiplier;
varying vec3 vCamDir;



varying vec3 vView;

const float smoothing = .4;

void main(){


  vec2 tLookup = vec2( vUv );
  /*tLookup *= 1. / textureScale;
  tLookup -= (1. / textureScale)/2.;// / 2.;
  tLookup += textureScale;// / 2.;*/

  vec4 title = texture2D( t_text , tLookup );

  float distance = title.a;
  float lum = smoothstep( 0.6 - smoothing , 0.6 + smoothing , distance );

  vec2 newNorm = vec2( 3. , 3. ) * lum;

  vec3 q0 = dFdx( vPos.xyz );
  vec3 q1 = dFdy( vPos.xyz );
  vec2 st0 = dFdx( vUv.st );
  vec2 st1 = dFdy( vUv.st );

  vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
  vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  vec3 N = normalize( vNorm );

  vec2 offset = vec2(  timer * .000000442 , timer * .0000005345 );


 
  vec3 mapN = texture2D( t_normal,vUv*texScale+offset).xyz * 2.0 - 1.0;


  mapN.xy = normalScale * (mapN.xy + newNorm);

  mat3 tsn = mat3( S, T, N );
  vec3 fNorm =  normalize( tsn * mapN ); 


  vec2 centerUV = abs( vUv - vec2( .5 , .5 ) );
  float dCutoff = max( 0. , (1. - pow((length( centerUV )*3.), 2.)));


  vec3 totalIri = vec3( 0.);

  float fr = max( 0. ,  dot( -vLightDir , fNorm ));

  vec3 refl = reflect( -vLightDir , fNorm );
  float reflFR = dot( -refl , vCamDir );

  vec3 a = texture2D( t_audio , vec2( fr , 0. ) ).xyz;
  vec3 iri = texture2D( t_iri , vec2( reflFR*reflFR , 0. ) ).xyz;

  totalIri +=  iri * vDistMultiplier * reflFR*reflFR*reflFR*reflFR*reflFR*reflFR;

   iri = texture2D( t_iriFace , vec2( fr*fr , 0. ) ).xyz;

     
    totalIri +=  iri * vDistMultiplier * fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr* fr*fr*fr*fr;

   vec3 f =texture2D( t_iriFace , vec2( reflFR *  reflFR * reflFR , 0. ) ).xyz;

  totalIri += a;

  //totalIri -= title.xyz;


   float fOpacity = opacity;

  fOpacity += 1. * lum;



  gl_FragColor = vec4( totalIri  , fOpacity );
 // gl_FragColor = vec4( tLookup.x , 0. , tLookup.y , 1. );
 // gl_FragColor = title;//vec4( tLookup.x , 0. , tLookup.y , 1. );


 // gl_FragColor = vec4( vec3( 1. ) * title.a , 1. );
}
