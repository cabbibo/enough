uniform sampler2D t_audio;

varying vec2 vUv;

      
void main() {


  vUv = uv;

  vec4 a = texture2D( t_audio , vUv );

  vec3 newPos = position - vec3( 0 , 0 , a.x*10. );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
}
