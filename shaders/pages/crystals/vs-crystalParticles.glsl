uniform sampler2D t_pos;
//uniform sampler2D t_vel;
//uniform sampler2D t_audio;

//varying vec4 vVel;
varying vec4 vPos;
//varying vec4 vAudio;

varying vec2 vUv;

void main(){

  vUv = position.xy;

  vPos =  texture2D( t_pos , position.xy );
 // vVel = texture2D( t_vel , position.xy );
  //vAudio = texture2D( t_audio , vec2( position.x , 0. ) );

  vec3 pos = vPos.xyz;

  
  
  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );

  //gl_PointSize =  min( 100. ,3.+ 10. * abs(vAudio.x* vAudio.x* vAudio.x)) / length( mvPos) ;

  //gl_PointSize = gl_PointSize * 50.;

  //gl_PointSize = min( 100. , 500. * vAudio.x * vAudio.x * vAudio.y / length( mvPos ));
  gl_PointSize = 4.;
  gl_Position = projectionMatrix * mvPos;

}
