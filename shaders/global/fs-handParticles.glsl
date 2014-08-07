uniform sampler2D t_audio;
uniform sampler2D sprite;
uniform vec3  color;
uniform float id;
uniform vec3 uPos;
uniform vec3 uVel;

varying vec2 vUv;
varying vec4 vAudio;

void main(){

   vec4 s = texture2D( sprite , vec2( gl_PointCoord.x , 1.0 - gl_PointCoord.y) );
  gl_FragColor = vAudio*s;

}
