
attribute float moteID;

uniform sampler2D t_audio;

//varying vec4 vVel;
varying vec4 vAudio;

varying vec2 vUv;
varying float vID;
void main(){

  vUv = position.xy;

  
  vec4 mvPos = modelViewMatrix * vec4( position , 1.0 );

  vAudio = texture2D( t_audio , vec2( moteID , 0.0 ) );
  vID = moteID;
  gl_PointSize = min( 300. , 30000. / length( mvPos ) );//* length( vAudio ) * length( vAudio )* length( vAudio );
  gl_Position = projectionMatrix * mvPos;

}
