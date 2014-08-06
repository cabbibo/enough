
//uniform vec3 color;

uniform sampler2D t_iri;
uniform sampler2D t_normal;
uniform sampler2D t_audio;
uniform sampler2D t_active;
uniform vec3 lightPos;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;


varying vec2 vActiveLookup;
varying vec3 vNormal;
varying vec2 vUv;
varying float vSlice;
varying float vAmount;
varying vec3 vTest;
varying float vHead;
varying vec3 vPos;
varying vec3 vMVPos;

varying vec3 vView;
varying float vDisplacement;

varying vec3 vLightDir;
varying mat3 vNormalMat;


uniform float texScale;
uniform float normalScale;

vec3 cubicCurve( float t , vec3  c0 , vec3 c1 , vec3 c2 , vec3 c3 ){

  float s  = 1. - t; 

  vec3 v1 = c0 * ( s * s * s );
  vec3 v2 = 3. * c1 * ( s * s ) * t;
  vec3 v3 = 3. * c2 * s * ( t * t );
  vec3 v4 = c3 * ( t * t * t );

  vec3 value = v1 + v2 + v3 + v4;

  return value;

}


void main(){

  vec3 vNorm = vNormal;

  // FROM @thespite
  vec3 n = normalize( vNorm.xyz );
  vec3 blend_weights = abs( n );
  blend_weights = ( blend_weights - 0.2 ) * 7.;  
  blend_weights = max( blend_weights, 0. );
  blend_weights /= ( blend_weights.x + blend_weights.y + blend_weights.z );

  vec2 coord1 = vPos.yz * texScale;
  vec2 coord2 = vPos.zx * texScale;
  vec2 coord3 = vPos.xy * texScale;

  vec3 bump1 = texture2D( t_normal , coord1 ).rgb;  
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

 /* vec3 vU = normalize( vMVPos );
  vec3 r = reflect( normalize( vU ), normalize( finalNormal ) );
  float m = 2.0 * sqrt( r.x * r.x + r.y * r.y + ( r.z + 1.0 ) * ( r.z + 1.0 ) );
  vec2 calculatedNormal = vec2( r.x / m + 0.5,  r.y / m + 0.5 );

  vec3 base = texture2D( tNormal, calculatedNormal ).rgb;

  vec3 tNorm = texture2D( tNormal , vUv ).xyz;
  tNorm = normalize( tNorm  ) * 1.;
  
  vec3 newNormal = normalize( vNorm + tNorm );*/

  /*vec3 newNormal = finalNormal;

  vec3 nNormal = normalize( vNormalMat * newNormal  );
  vec3 nView = normalize(vView);
  vec3 nReflection = normalize( reflect( vView , nNormal )); 

  vec3 refl = reflect( vLightDir , nNormal );
  float facingRatio = abs( dot(  nNormal, refl) );

  float newDot = dot( normalize( nNormal ), nView );
  float inverse_dot_view = 1.0 - max( newDot  , 0.0);

  vec3 p1 = color1;
  vec3 p2 = color2;
  vec3 p3 = color3;
  vec3 p4 = color4;
  
  vec3 v1 = vec3(0.);
  vec3 v2 = .2  * p1-p3;
  vec3 v3 = .5  * p2-p4;
  vec3 v4 = vec3(0.);

  vec3 c1 = p1;
  vec3 c2 = p2 + v1/3.;
  vec3 c3 = p3 - v2/3.;
  vec3 c4 = p4;


  vec3 lookup_table_color = cubicCurve( inverse_dot_view * facingRatio, c1 , c2 , c3 , c4 );


  vec3 aColor = texture2D( t_audio , vec2( inverse_dot_view * (1.-facingRatio) ,0. )).xyz;*/


  //gl_FragColor = vec4( vAmount , 0. , vSlice / 16. , 1. );

  //vec3 test =  ( vTest * vAmount);

 // vec3 finalNormal = vNormal;
  // + 1. *  texture2D( tNormal , abs(vec2(sin(vNormal.y * 100.) , cos( vNormal.z * 10. )))).xyz;

 // vec3 c = finalNormal;
  
 // normalize( finalNormal  );
  vec3 refl = reflect( vLightDir , finalNormal );
  float facingRatio = abs( dot( finalNormal , refl) );
  float newDot = dot( finalNormal  , normalize(vView) );
  float inverse_dot_view = 1.0 - max( newDot  , 0.0);

  float lookup = inverse_dot_view * (1.-facingRatio);
  vec3 aColor = texture2D( t_audio , vec2( inverse_dot_view * (1.- facingRatio) , 0.0 ) ).xyz;
  vec4 active = texture2D( t_active , vActiveLookup );

 /* vec3 p1 = color1;
  vec3 p2 = color2;
  vec3 p3 = color3;
  vec3 p4 = color4;
  
  vec3 v1 = vec3(0.);
  vec3 v2 = .2  * p1-p3;
  vec3 v3 = .5  * p2-p4;
  vec3 v4 = vec3(0.);

  vec3 c1 = p1;
  vec3 c2 = p2 + v1/3.;
  vec3 c3 = p3 - v2/3.;
  vec3 c4 = p4;


  vec3 lookup_table_color = cubicCurve( inverse_dot_view * facingRatio, c1 , c2 , c3 , c4 );*/


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

  if( selected == 0. ){

    //discard;

  }


  float fLookup =(  inverse_dot_view * facingRatio  * (1./6.) ) +lookupOffset;

  vec3 lookup_table_color = texture2D( t_iri , vec2( fLookup , 0. ) ).xyz;

  vec3 c =  lookup_table_color * aColor;//aColor;//active.xyz * (vNormal*.7+.3) * .75 + (vHead * .25);

 /* float hovered = active.z;
  float selected = active.y;
  float playing = active.x;
  float current = active.a;

  c += hovered * color1;
  c += selected * color2;
  c += playing * color3;
  c += current * color4;

  vec3 cColor = ((current + 1. ) * .5) * lookup_table_color;
  vec3 sColor = ((selected + 1. ) * .5) *  aColor;
  vec3 hColor = ((hovered + 1. ) * .5) * c;
  //gl_FragColor = vec4( lookup_table_color * aColor  * .75 + (vHead * .25) , 1. );
 // gl_FragColor = vec4(  aColor , 1. );
  gl_FragColor = vec4( (cColor+sColor+hColor) * .5 + (vHead * .1)  , 1. );*/

  //gl_FragColor = vec4( active.xyz , 1. );

  gl_FragColor = vec4( c, .1 );
}
