
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
varying vec3 vMPos;
varying vec3 vLightDir;
varying vec3 vRefl;
varying float vFacingRatio;
varying float vLookup;

void main(){ 

 // vec3 finalNormal = vNormal;

  //float playing = active * selected;

 // vec3 color = vec3( hovered , active , selected);
  vec3 aColor = texture2D( t_audio , vec2( vLookup *2.  , 0.0 ) ).xyz;


/*
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





  float fLookup = ( vLookup * ( 1./6.))+lookupOffset;
  vec3 lookup_table_color = texture2D( t_iri , vec2( fLookup , 0. ) ).xyz;
  */

 // gl_FragColor = vec4( c * c * c * color + .3*(color* .2 + vec3( .3 , .3 , .3 )) , 1.0 );
 // gl_FragColor = vec4( lookup_table_color * abs(( vec3(.1 , .3 , .5 )-aColor )) , 1.0 );

   vec3 lookup_table_color = texture2D( t_iri , vec2( vLookup *2. , 0. ) ).xyz;

  gl_FragColor = vec4( lookup_table_color * aColor, 1.);
}

