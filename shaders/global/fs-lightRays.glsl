uniform sampler2D t_audio;
uniform float time;
uniform float offset;
uniform float strength;

varying vec2 vUv;
varying vec3 vMNorm;
varying vec3 vMVPos;
void main(){

  vec2 lookup = vec2(abs( sin( offset+4. + time * .1 + vUv.x)) * .5 , 0. );
  vec4 aCol = texture2D( t_audio , lookup);

  float match = dot( normalize(vMNorm) , normalize( vMVPos ));
  aCol *= match * match * match * match * match * match;
  //aCol *= (.5 - abs(vUv.x -.5)) * 2.; 


  gl_FragColor = aCol * strength;


}
