
varying float vDisplacement;
varying vec3 vMPos;

$simplex
void main(){

  //float noise = snoise( vMPos * ( vDisplacement + 40. )  * .0001 );
  
  vec3 col = vec3( 1. );
 // if( abs(noise) > (vDisplacement+10.) * .05 ){ col = vec3( 0. ); }

  gl_FragColor = vec4( col ,1. );

}
