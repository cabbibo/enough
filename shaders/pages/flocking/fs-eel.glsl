
varying vec3 vVel;
varying float vDepth;
void main(){

  //gl_FragColor = vec4( 1.,.3,0.,1. )* vDepth + vec4( 0. , .3 , 1. , 1. ) * ( 1. - vDepth );
  gl_FragColor = vec4( normalize( vVel ) * .5 + .5 , 1. );// vec4( 1.,.3,0.,1. )* vDepth + vec4( 0. , .3 , 1. , 1. ) * ( 1. - vDepth );

}
