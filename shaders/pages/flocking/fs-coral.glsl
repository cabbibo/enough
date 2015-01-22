varying vec3 vNormal;
varying vec3 vMPos;


uniform float hovered;
uniform float active;
uniform float timer;

uniform sampler2D t_audio;
$simplex

void main(){

  vec3 offset = vec3( timer , timer * .01 , timer * .001 );
  float size = (active + .5 ) * .02;
  vec3 scale = vec3( .1 , 3. , 10. );
  float noise = snoise( vMPos * scale * size + offset );
  
 
  if( noise < -.1 ){
    discard;
  }


  vec4 aCol = texture2D( t_audio , vec2( noise , 0. ) );


  vec3 color = (vNormal * .5) + .5;
  if( hovered > 0.5 ){
    color *= 2.;
  }else{
    color *= .7;
  }
  gl_FragColor = vec4( aCol.xyz * color ,1. );

}
