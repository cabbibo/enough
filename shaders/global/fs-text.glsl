uniform vec3 color;
uniform sampler2D t_text;
uniform float opacity; 

varying vec4 vTextCoord;
varying vec4 vLookup;

uniform float textureSize;


const vec2 textSize = vec2( 16. / 512. , 16./256.);
const float smoothing = 1. / 16.0;

void main(){

  vec2 newCoord = vTextCoord.xy; 
  vec2 sCoord =  newCoord + gl_PointCoord * vec2( .05 , .1 );

  float distance = texture2D(t_text , sCoord ).g;
  float lum = smoothstep( 0.5 - smoothing , 0.5 + smoothing , distance );
  float alpha = 1. - lum;

  float simplex = abs(vLookup.w);
  float mult = .7+ simplex * .5;
  gl_FragColor = vec4( vec3( 1. , 1. , 1. )*mult, alpha * opacity );

}
