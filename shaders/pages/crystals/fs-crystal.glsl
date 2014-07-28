
uniform sampler2D t_audio;
uniform vec3 lightPos;
uniform vec3 cameraPos;

uniform float hovered;
uniform float playing;
uniform float selected;

varying vec3 vPos;
varying vec3 vNorm;
varying float vID;

const float shininess = 1.;

vec3 ADSLightModel( vec3 norm , vec3 pos ){


  // seting up light vectors
  vec3 normv = normalize( norm );
  vec3 lightv = normalize( lightPos - pos );
  vec3 viewv = normalize( cameraPos - pos );
  vec3 halfv = normalize( normalize( lightPos ) + normalize( cameraPos )); 

  vec3 reflectionv = reflect( -lightv , norm );


  // Setting up colors
  vec3 ambientColor = vec3( .1 , 0. , 0.);
  
  vec3 diffuseColor = vec3( 0. , 1. , 0. );

  vec3 specularColor = vec3( 0. , 0. , 1. );
  
  // Manipulation 

  diffuseColor *= max( 0.0 , dot( lightv , norm ));

  specularColor *= pow( max( 0.0 , dot( normv , halfv ) ),shininess) ;


  return clamp( diffuseColor + ambientColor + specularColor , 0.0 , 1.0 );

}

void main(){

  vec3 a = texture2D( t_audio , vec2( abs( cos(vID*30000.))  , 0. ) ).xyz;

  vec3 dark = a * abs( vNorm ) * abs( normalize( vPos ) );

  vec3 view = vPos - cameraPos;
  vec3 light = vPos - lightPos;
  light *= 1.;

  vec3 nLight = normalize( light );
  float  diffuseRatio = dot( vNorm , nLight );
  float dR = diffuseRatio;

  vec3 nView = normalize( view );

  float facingRatio = dot( vNorm , nView );
  float fr = facingRatio;

   a = texture2D( t_audio , vec2( abs( cos(vID*30000.))*fr  , 0. ) ).xyz;



  vec3 frA = texture2D( t_audio , vec2( abs(cos(fr * 2.)) , 0. ) ).xyz;

  vec3 c = ADSLightModel( vNorm , vPos );

  gl_FragColor = vec4( vNorm + vec3( 0. , 0. , .3 ) , 1. );


}

