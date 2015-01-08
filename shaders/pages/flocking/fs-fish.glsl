void main(){

  if( length(gl_FragCoord.xy - vec2(.5,.5)) > 1.5 ){

  //  discard;

  }
  gl_FragColor = vec4( .4 , .9 , .7 , 1. );

}
