
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

varying float vLength;
varying vec3 vPos;
varying vec3 vNorm;
varying float vID;

varying vec2 vUv;
varying float vEdge;

const float shininess = 30.;



//const vec3 lightPos = vec3( 500 , -2000 , 1400 );

void main(){


  vec3 fNorm = vNorm;

  vec3 w = vec3( 1.);

  vec3 cX = .5 * vec3( 1. , 0. , 0. )  * vNorm.x * ( .5 * hovered + .5) ; 
  vec3 cY = .5 * vec3( 1. , 0. , 0. )  *vNorm.y * ( .5 * playing + .5); 
  vec3 cZ = .5  * vec3( 1. , 0. , 0. )  *vNorm.z * ( .5 * selected + .5); 
  

  vec3 lightv = normalize( lightPos - vPos );
  vec3 viewv = normalize( cameraPos - vPos );
  vec3 halfv = normalize( normalize( lightPos ) + normalize( cameraPos )); 

  vec3 reflectionv = reflect( -lightv , fNorm );


  float FR     = dot( lightv , fNorm );
  float specFR = dot( fNorm , halfv );
  float reflFR = dot( reflectionv , viewv  );

  float d =  pow( (distanceCutoff / length( lightPos - vPos )) , distancePow );


  vec4 aD = d * texture2D( t_audio , vec2( abs( cos( d * 1.) ), 0. ) );
  //vec4 aFR = FR * texture2D( t_audio , vec2( FR , 0. ) );
  vec4 aRefl = texture2D( t_audio , vec2( abs(cos( reflFR * 1. )) , 0. ) );

  //vec4 aNorm = reflFR * texture2D( t_audio , vec2( fNorm.x , 0. ) );

  vec3 fColor = vec3( 0. );
 
  //vec4 aNormX = 
  fColor += /*aD.xyz * extra +*/ max( 0. , specFR ) * (aRefl.xyz) + FR * aRefl.xyz; // * (1. - pow( d , .5 )) ;

  fColor += vec3( 1. ) * FR;
 
  fColor.r *= .7;
  fColor.g *= .9;

 // vec3 base = pow( d , .2 ) * FR *  (fColor+aC) * ( 1. - special ) * baseMultiplier;

  vec3 hColor = vec3( .3 , .3 , .3 ) * hovered;
  vec3 sColor = vec3( .1 , .5 , .3 ) * selected;
  vec3 pColor = vec3( .1 , .4 , .6 ) * playing;

  vec3 f = (hColor * (1.- playing * .3)) + (sColor ) * (1. - playing) + pColor *aRefl.xyz;

  fColor = vec3( 0. );

  fColor += f + vec3( .1 , .4 , .5 ) * FR  + aRefl.xyz; //aFR.xyz ;


  float unspecial = ( 1. - special );
  float lMult = min( 1.0 , (5000. * 1. * extra * unspecial + 80.) / vLength);
  vec4 aID = texture2D( t_audio , vec2( vID+.1 , 0.  ) );
  vec4 aL = texture2D( t_audio , vec2( lMult , 0.  ) );
  //vec4 aEdge = texture2D( t_audio , vec2( vEdge , 0.  ) );
  vec4 aUV = texture2D( t_audio , vec2( vUv.y , 0.  ) );
  vec4 aEdge = texture2D( t_audio , vec2( vEdge , 0.  ) );

  float side = 0.;
  if( vEdge > .9  ){
    
    side = 1.;

  }

  vec3 top = aEdge.xyz *( 1. - side)*FR*lMult; 
  vec3 column = aUV.xyz * side * FR*lMult;

  vec3 base = (top * vec3( .4 , .5+vID*.5 , .5 )+ column * vec3( .4 , .3 , .3 + .7 *vID)) * unspecial ;


  vec3 none = vec3( .1 , .5 , .4 ) * lMult * lMult * (1.-playing) ;
  vec3 played = vec3( .3 , .2 , .6 ) * lMult * lMult * (playing) ;
  vec3 hover = vec3( .1 , .4 , .5 ) *  hovered * lMult *lMult ;
  vec3 selectedNonPlay = vec3( .4 , .1 , .7 ) *  selected * ( 1.-playing) * lMult *lMult ;

  vec3 playNonSelect = vec3( .6 , .1 , .4 ) * ( 1. - selected ) * playing * lMult *lMult ;


  vec3 ring =  (played+ none+selectedNonPlay+playNonSelect + hover + top + column)  *  special; 


  gl_FragColor = vec4( base + ring, .1 );




}

