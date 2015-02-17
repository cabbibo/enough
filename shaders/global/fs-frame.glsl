uniform float opacity;
uniform vec2 scale;
uniform sampler2D t_audio;
uniform float width;

varying vec2 vUv;

void main(){

  vec4 aX = texture2D( t_audio , vec2( vUv.x , 0. ) );
  vec4 aY = texture2D( t_audio , vec2( vUv.y , 0. ) );

  float r = scale.x / scale.y;

  if( vUv.x > width / r && vUv.x < 1. - ( width / r)  && vUv.y > ( width / r) && vUv.y < 1. - ( width  / r)  ){
    discard;
  }

  gl_FragColor = vec4((aX * aY * 3.).xyz , opacity );

}
