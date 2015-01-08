
uniform sampler2D t_audio;
uniform sampler2D t_normal;
varying float vDepth;

varying vec2 vRibbonUV;
varying vec2 vLookupUV;
varying float vAmount;

varying vec3 vEye;

varying vec3 vNormal;
void main(){

  //vec3 col = vec3( 1. , .3 , .3 );
  vec4 col = vec4( 0. );


  vec4 nCol =  vec4( (vNormal * .5 + .5) , 1.);


  //vec4 col = vec4( vec3( pow( abs( dot( vNormal , vEye ) ), 100. )),1.); 
  //vec4 col = vec4( vec3( pow( abs( dot( vNormal , vEye ) ), 100. )),1.); 

  if( vAmount < .01 ){

    col = vec4( 1. , 1. , 1. , 0. );

  }

  if( vRibbonUV.y > .8 || vRibbonUV.y < -.8 ||  vRibbonUV.x < .1  ){

    col = nCol;//nCol; //vec4( 1. , 1.  , 1. , 1. );

  }else{
    
    col = nCol * pow( dot( vNormal , normalize(vEye) ) , 5. );

  }

  vec4 norm = texture2D( t_normal , vRibbonUV * .5 );
  col = texture2D( t_audio , vRibbonUV );

  if( norm.x < .45 ){

    discard;
  }


  gl_FragColor =col;// vec4( col ,  1. );//* vec4( vRibbonUV.x , vRibbonUV.y , 1. , 1. );
 // gl_FragColor = vec4( 1.,.3,0.,1. )* vDepth + vec4( 0. , .3 , 1. , 1. ) * ( 1. - vDepth );

}
