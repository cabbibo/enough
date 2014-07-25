uniform sampler2D t_audio;

varying vec2 vUv;

void main(){

  vec4 a = texture2D( t_audio , vUv );

  gl_FragColor = a;

}
