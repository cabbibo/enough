varying vec3 vNormal;
varying vec3 vMPos;


uniform float hovered;
uniform float active;
uniform float timer;

uniform vec3 lightPos;

uniform sampler2D t_audio;
$simplex

void main(){

  vec3 offset = vec3( timer , timer * .01 , timer * .001 );
  float size = (active + .5 ) * .02;
  vec3 scale = vec3( 1. );//vec3( .1 , 3. , 10. );
  float noise = abs(snoise( vMPos * scale * size + offset ));
  
 
  noise += abs(snoise( vMPos * scale * .2 * size + offset * .1 ));
  noise += abs(snoise( vMPos * scale * 3.2 * size + offset * .6 ));

  float match = dot( vNormal , normalize(lightPos - vMPos) );
  //noise = abs( snoise( vNormal ) );
  if( noise < match * 4. ){
    discard;
  }


  vec4 aCol = texture2D( t_audio , vec2( noise , 0. ) );


  vec3 color = (vNormal * .5) + .5;
  if( hovered > 0.5 ){
    color *= 2.;
  }else{
    color *= .7;
  }
  gl_FragColor = vec4( aCol.xyz * vec3((match+1.)/2.) , 1.); //* vec4( aCol.xyz * color ,1. );

}
