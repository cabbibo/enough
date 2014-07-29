
uniform sampler2D t_audio;
uniform sampler2D t_normal;
uniform vec3 cameraPos;

uniform float hovered;
uniform float playing;
uniform float selected;

uniform float special;


uniform vec3 lightPos;
uniform float timer;
uniform float baseMultiplier;
uniform float ringMultiplier;
uniform float reflMultiplier;
uniform float distanceCutoff;
uniform float distancePow;
uniform float normalScale;
uniform float texScale;
uniform float extra;

varying vec3 vPos;
varying vec3 vNorm;
varying float vID;

const float shininess = 30.;



//const vec3 lightPos = vec3( 500 , -2000 , 1400 );

void main(){


  // FROM @thespite
  vec3 n = normalize( vNorm.xyz );
  vec3 blend_weights = abs( n );
  blend_weights = ( blend_weights - 0.2 ) * 7.;  
  blend_weights = max( blend_weights, 0. );
  blend_weights /= ( blend_weights.x + blend_weights.y + blend_weights.z );

  vec2 coord1 = vPos.yz * texScale;
  vec2 coord2 = vPos.zx * texScale;
  vec2 coord3 = vPos.xy * texScale;

  vec3 bump1 = texture2D( t_normal , coord1  ).rgb;  
  vec3 bump2 = texture2D( t_normal , coord2  ).rgb;  
  vec3 bump3 = texture2D( t_normal , coord3  ).rgb; 

  vec3 blended_bump = bump1 * blend_weights.xxx +  
                      bump2 * blend_weights.yyy +  
                      bump3 * blend_weights.zzz;

  vec3 tanX = vec3( vNorm.x, -vNorm.z, vNorm.y);
  vec3 tanY = vec3( vNorm.z, vNorm.y, -vNorm.x);
  vec3 tanZ = vec3(-vNorm.y, vNorm.x, vNorm.z);
  vec3 blended_tangent = tanX * blend_weights.xxx +  
                         tanY * blend_weights.yyy +  
                         tanZ * blend_weights.zzz; 

  vec3 normalTex = blended_bump * 2.0 - 1.0;
  normalTex.xy *= normalScale;
  normalTex.y *= -1.;
  normalTex = normalize( normalTex );
  mat3 tsb = mat3( normalize( blended_tangent ), normalize( cross( vNorm, blended_tangent ) ), normalize( vNorm ) );
  vec3 finalNormal = tsb * normalTex;

  float fr = dot( finalNormal , normalize(vPos - cameraPos) );

  vec3 fNorm = finalNormal;
  vec3 aX = texture2D( t_audio , vec2( abs(fNorm.x  ) , 0.) ).xyz;
  vec3 aY = texture2D( t_audio , vec2( abs(fNorm.y  ) , 0.) ).xyz;
  vec3 aZ = texture2D( t_audio , vec2( abs(fNorm.z  ) , 0.) ).xyz;


  vec3 w = vec3( 1.);

  vec3 cX = .5 * normalize( aX + fNorm*.4 ) * vNorm.x * ( .5 * hovered + .5) ; 
  vec3 cY = .5 *normalize( aY + fNorm*.4 )* vNorm.y * ( .5 * playing + .5); 
  vec3 cZ = .5 * normalize( aZ + fNorm*.4 ) * vNorm.z * ( .5 * selected + .5); 
  

  vec3 lightv = normalize( lightPos - vPos );
  vec3 viewv = normalize( cameraPos - vPos );
  vec3 halfv = normalize( normalize( lightPos ) + normalize( cameraPos )); 

  vec3 reflectionv = reflect( -lightv , fNorm );


  float FR     = dot( lightv , fNorm );
  float specFR = dot( fNorm , halfv );
  float reflFR = dot( reflectionv , viewv  );

  float d =  pow( (distanceCutoff / length( lightPos - vPos )) , distancePow );


  //vec4 aD = pow( d , .5 ) * texture2D( t_audio , vec2( abs( cos( d * 1.) ), 0. ) );
  //vec4 aFR = FR * texture2D( t_audio , vec2( FR , 0. ) );
  vec4 aRefl = texture2D( t_audio , vec2( abs(cos( reflFR * 1. )) , 0. ) );

  //vec4 aNorm = reflFR * texture2D( t_audio , vec2( fNorm.x , 0. ) );

  vec3 fColor = vec3( 0. );
 
  //vec4 aNormX = 
  fColor += /*aD.xyz * extra +*/ max( 0. , specFR ) * (aRefl.xyz) + FR * aRefl.xyz; // * (1. - pow( d , .5 )) ;

  fColor += vec3( 1. ) * FR;
 
  fColor.r *= .7;
  fColor.g *= .9;

  vec3 base = fColor * ( 1. - special );

  vec3 hColor = vec3( .3 , .3 , .3 ) * hovered;
  vec3 sColor = vec3( .1 , .5 , .3 ) * selected;
  vec3 pColor = vec3( .1 , .4 , .6 ) * playing;

  vec3 f = (hColor * (1.- playing * .3)) + (sColor ) * (1. - playing) + pColor *aRefl.xyz;

  fColor = vec3( 0. );

  fColor += f + vec3( .1 , .4 , .5 ) * FR  + aRefl.xyz; //aFR.xyz ;

  vec3 ring = fColor * special; 

  gl_FragColor = vec4( base + ring , .1 );



}

