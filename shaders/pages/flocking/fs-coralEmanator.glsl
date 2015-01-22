uniform sampler2D t_audio;
uniform float active;
varying float radius;
void main(){



  vec2 fromC = gl_PointCoord.xy - vec2( .5 );
  float dist = length(fromC);

  if( dist > .5 ){ discard; }

  vec4 aCol = texture2D( t_audio , vec2( dist * 2. , 0.));

  float brightness = (500. - radius) / 200.;
  //gl_FragColor = vec4( 1. , dist , .5 , 1. );
  gl_FragColor = brightness * aCol * vec4( 1.  );

}
