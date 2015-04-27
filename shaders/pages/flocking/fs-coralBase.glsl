uniform vec3 mani;
varying float vDisplacement;
varying float vRadius;
varying vec3 vMPos;
varying vec3 vNorm;


void main(){

  //float noise = snoise( vMPos * ( vDisplacement + 40. )  * .0001 );
  
  vec3 col = vec3( 1. );

  vec3 lightDir = mani - vMPos;

  col *= dot( vNorm , -normalize(lightDir));//vNorm * .5 + .5;
 // if( abs(noise) > (vDisplacement+10.) * .05 ){ col = vec3( 0. ); }

  gl_FragColor = vec4( col *  pow( ( 1. - vRadius ) , 2. ) ,1. );

}
