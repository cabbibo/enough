
uniform sampler2D t_audio;
uniform sampler2D t_normal;
uniform sampler2D t_ribbon;
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

  /*if( vRibbonUV.y > .8 || vRibbonUV.y < -.8 ||  vRibbonUV.x < .1  ){

    col = nCol;//nCol; //vec4( 1. , 1.  , 1. , 1. );

  }else{*/
    
    col = nCol;// nCol * pow( dot( vNormal , normalize(vEye) ) , 1. );

 // }

  //vec4 norm = texture2D( t_normal , vRibbonUV * .5 );
  vec4 ribbon = texture2D( t_ribbon ,( vRibbonUV + vec2( 0. , 1. ) ) * vec2( 1. , .25));
  vec4 aColor = texture2D( t_audio , vRibbonUV );

  if( ribbon.a < .8 ){

    discard;
  }


  gl_FragColor =ribbon * vec4( aColor.xyz  * 2., 1. ) * pow( dot( vNormal , normalize(vEye) ) , 2. ); ;// vec4( col ,  1. );//* vec4( vRibbonUV.x , vRibbonUV.y , 1. , 1. );
 // gl_FragColor = vec4( 1.,.3,0.,1. )* vDepth + vec4( 0. , .3 , 1. , 1. ) * ( 1. - vDepth );

}
