
uniform sampler2D t_audio;
uniform sampler2D t_normal;
uniform vec3 lightPos;
uniform vec3 cameraPos;

uniform float hovered;
uniform float playing;
uniform float selected;

varying vec3 vPos;
varying vec3 vNorm;
varying float vID;

const float shininess = 80.;


const float normalScale = .1;
const float texScale = .001;

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
  
  vec3 lightRay = vPos - lightPos;
  vec3 lightDir = normalize( lightRay );

  //vec3 lightRefl = reflect( -lightDir , 

  float facing = dot( fNorm , -lightDir );

  float l = 100000. /  (length( lightRay ) * length( lightRay ) );
 
  vec3 diffuse = vec3( .6 , .4 , 1. ) * facing;



  gl_FragColor = vec4( diffuse , 1. );



}

