#extension GL_OES_standard_derivatives : enable

uniform float timer;
uniform sampler2D t_normal;
uniform sampler2D t_iri;

uniform vec3 lightPositions[7];
uniform sampler2D lightTextures[7];
uniform vec3 lightColors[7];

uniform vec3 cameraPos;

uniform float normalScale;
uniform float texScale;

varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vMPos;
varying vec2 vUv;

varying vec3 vLightDir[7];
varying float vDistMultiplier[7];
varying vec3 vCamDir;


varying vec3 vView;

const float timeMatMultiplier = .1;

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

  vec3 bump1 = texture2D( t_normal , coord1 + vec2( timer * .1 , timer * .2 ) * timeMatMultiplier    ).rgb;  
  vec3 bump2 = texture2D( t_normal , coord2 + vec2( timer * .13 , timer * .083 ) * timeMatMultiplier   ).rgb;  
  vec3 bump3 = texture2D( t_normal , coord3 + vec2( timer * .05 , timer * .15 ) * timeMatMultiplier   ).rgb; 

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
 
 // vec3 bump = texture2D( tNormal , vUv ).xyz;
  vec3 fNorm = tsb * normalTex;
 
  vec3 camDir   = normalize( vMPos - cameraPos);


  vec3 totalIri = vec3( 0.);
  for( int i = 0; i < 7; i++ ){

        
    float fr = max( 0. ,  dot( -vLightDir[i] , fNorm ));

    vec3 refl = reflect( -vLightDir[i] , fNorm );
    float reflFR = dot( -refl , vCamDir );

    vec3 iri = texture2D( lightTextures[i] , vec2( reflFR*reflFR , 0. ) ).xyz;

    totalIri +=  lightColors[i] * iri * vDistMultiplier[i] * fr * fr *fr;


  }


    
  gl_FragColor = vec4( totalIri , 1. );


}
