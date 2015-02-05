uniform sampler2D t_audio;
uniform float time;
uniform float offset;

varying vec2 vUv;
void main(){

  vec2 lookup = vec2(abs( sin( offset+4. + time * .1 + vUv.x)) * .5 , 0. );
  vec4 aCol = texture2D( t_audio , lookup);

  aCol *= vUv.y;
  aCol *= (.5 - abs(vUv.x -.5)) * 2.; 


  gl_FragColor = aCol;


}
