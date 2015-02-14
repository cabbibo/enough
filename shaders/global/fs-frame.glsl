uniform float opacity;
uniform vec2 scale;
uniform sampler2D t_audio;

varying vec2 vUv;

void main(){

  vec4 aX = texture2D( t_audio , vec2( vUv.x , 0. ) );
  vec4 aY = texture2D( t_audio , vec2( vUv.y , 0. ) );

  float r = scale.x / scale.y;

  if( vUv.x > 0.1 / r && vUv.x < 1. - (.1 / r)  && vUv.y > (.1 / r) && vUv.y < 1. - (.1 / r)  ){
    discard;
  }
  gl_FragColor = aX * aY * 3.;

}
