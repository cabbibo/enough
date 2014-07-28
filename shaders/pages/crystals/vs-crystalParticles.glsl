uniform sampler2D t_pos;
//uniform sampler2D t_vel;
//uniform sampler2D t_audio;

//varying vec4 vVel;
//varying vec4 vAudio;

varying vec2 vUv;
void main(){

  vUv = position.xy;

  vec3 pos = texture2D( t_pos , vUv ).xyz;


  
  
  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );

  gl_PointSize = 4.;
  gl_Position = projectionMatrix * mvPos;

}
