uniform sampler2D t_audio;
uniform sampler2D t_sprite;
uniform vec3  color;
uniform float id;
uniform vec3 uPos;
uniform vec3 uVel;

varying vec2 vUv;
varying vec4 vAudio;
varying float vID;

void main(){


  vec2 uv = vec2( gl_PointCoord.x , 1.0 - gl_PointCoord.y);
  vec4 s = texture2D( t_sprite , uv );
 
  float lu = length( uv - vec2( .5 , .5 ) );
  vec4 aCol = texture2D( t_audio , vec2( vID + lu*.1 , 0. ) ); 
   
  gl_FragColor =   aCol * 2. *(.5 - lu * lu ) * s;

}
