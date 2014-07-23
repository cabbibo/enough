
uniform vec3 lightPos;
uniform float time;
uniform sampler2D tNormal;
uniform sampler2D t_audio;
uniform sampler2D t_iri;


uniform float hovered;
uniform float active;
uniform float selected;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying mat3 vNormalMat;
varying vec3 vView;
varying vec3 vMVPos;
varying vec3 vLightDir;

void main(){ 

  vec3 finalNormal = vNormal;

  float playing = active * selected;

  vec3 color = vec3( hovered , active , selected);

  vec3 refl = reflect( vLightDir , finalNormal );
  float facingRatio = abs( dot( finalNormal , refl) );
  float newDot = dot( finalNormal  , normalize(vView) );
  float inverse_dot_view = 1.0 - max( newDot  , 0.0);

  float lookup = inverse_dot_view * (1.-facingRatio);
  vec3 aColor = texture2D( t_audio , vec2( inverse_dot_view * (1.- facingRatio) , 0.0 ) ).xyz;


  float lookupOffset = 0.;
  
  if( hovered == 0. && selected == 0. && active == 0. ){
    lookupOffset = 0.;
  }

  if( hovered == 1. && selected == 0. && active == 0. ){
    lookupOffset = 1.;
  }

  if( hovered == 0. && selected == 1. && active == 0. ){
    lookupOffset = 2.;
  }

  if( hovered == 0. && selected == 0. && active == 1. ){
    lookupOffset = 3.;
  }

  if( hovered == 1. && selected == 1. && active == 0. ){
    lookupOffset = 4.;
  }


  if( hovered == 0. && selected == 1. && active == 1. ){
    lookupOffset = 5.;
  }

  if( hovered == 1. && selected == 1. && active == 1. ){
    lookupOffset = 5.;
  }

  if( hovered == 1. && selected == 0. && active == 1. ){
    lookupOffset = 5.;
  }

  lookupOffset /= 6.;





  float fLookup = (inverse_dot_view * facingRatio * ( 1./6.))+lookupOffset;
  vec3 lookup_table_color = texture2D( t_iri , vec2( fLookup , 0. ) ).xyz;
  

 // gl_FragColor = vec4( c * c * c * color + .3*(color* .2 + vec3( .3 , .3 , .3 )) , 1.0 );
  gl_FragColor = vec4( lookup_table_color *( aColor+vec3( .3 , .3 , .3 )) , 1.0 );

}

