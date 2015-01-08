
uniform vec3 lightPos;
uniform sampler2D t_matcap;

varying float vDepth;

varying vec2 vRibbonUV;
varying vec2 vLookupUV;
varying float vAmount;

varying vec3 vEye;
varying vec3 vMVPos;
varying vec2 vSEM;
varying vec3 vNormal;

varying float vHead;

void main(){

  //vec3 col = vec3( 1. , .3 , .3 );
  vec4 col = vec4( 0. );


  vec4 nCol =  vec4( (vNormal * .5 + .5) , 1.);


  vec3 lightVec = lightPos - vMVPos;
  vec3 lightDir = normalize( lightVec );

  vec3 refl = reflect( lightDir , vNormal );

  float reflMatch = max( 0. , dot( refl , normalize( vEye ) ) );

  reflMatch = pow( reflMatch , 5. );

  float match = max( 0. , dot( lightDir , vNormal ) );
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

  //float noise = abs(snoise( vRibbonUV * abs(vNormal.x ) * vec2( 1. , 10. ) ));

//  vec4 vei = vec4( 4. , .2 , .2 , 0. );
  vec4 vei = vec4( 1. , .5 , .5 , 0. );
  //if( noise > .2){

    if( vHead > .3 ){
      vei = vec4( 229. / 255. , 200. / 255. ,200. / 255. , 0. );
    }else{
      vei = vec4( 200. / 255. , 200. / 255. , 200. / 255. , 0. );
    }
    //vei = vec4( 1. , .5 , .5 , 0. );

  //}

  col = nCol * reflMatch; //+ vec4( 1. ) * pow( match , 4. );

  vec4 sem = texture2D( t_matcap , vSEM );
  gl_FragColor = col + (vei* sem); //* match;// vec4( col ,  1. );//* vec4( vRibbonUV.x , vRibbonUV.y , 1. , 1. );
  //gl_FragColor = reflMatch * vec4( 1. );// vec4( col ,  1. );//* vec4( vRibbonUV.x , vRibbonUV.y , 1. , 1. );
 // gl_FragColor = (1.- pow(dot( vNormal , vEye ),6.)) * nCol;// vec4( col ,  1. );//* vec4( vRibbonUV.x , vRibbonUV.y , 1. , 1. );
 // gl_FragColor = vec4( 1.,.3,0.,1. )* vDepth + vec4( 0. , .3 , 1. , 1. ) * ( 1. - vDepth );

}
