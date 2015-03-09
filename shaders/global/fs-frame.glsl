uniform float opacity;
uniform vec2 scale;
uniform sampler2D t_audio;
uniform float width;

varying vec2 vUv;

void main(){

  vec4 aX = texture2D( t_audio , vec2( vUv.x , 0. ) );
  vec4 aY = texture2D( t_audio , vec2( vUv.y , 0. ) );

  float r = scale.x / scale.y;


  float x = width / scale.x;
  float y = width / scale.y;

  if( vUv.x > x && vUv.x < 1. - x  && vUv.y > y && vUv.y < 1. - y  ){
    discard;
  }

 gl_FragColor = vec4((aX * aY * 3.).xyz , opacity );
 // gl_FragColor = vec4(vec3(1.) , opacity * .4 );

}
