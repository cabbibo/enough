
uniform float alive;
uniform float time;
uniform sampler2D t_sprite;
uniform sampler2D t_audio;

varying vec2 vUv;
varying vec3 vVel;
varying vec4 vAudio;
varying vec3 vMPos;

varying float vLife;

void main(){

   
  vec4 s = texture2D( t_sprite , vec2( gl_PointCoord.x , 1.0 - gl_PointCoord.y) );
 
  float l =  100. / vMPos.y;
  vec4 aC = texture2D( t_audio , vec2( vLife , 0. ) );
 // aC *= texture2D( t_audio , vec2( vUv.x , 0. ) );
 // aC *= texture2D( t_audio , vec2( vUv.y , 0. ) );

  gl_FragColor =  alive * s * (aC + vec4( .8 , .5 , .0, 1. )) * ( .4 +   abs( sin( time * 10000. * vUv.x + vUv.y * 100000. ))); //* vec4(  1000. - vMPos.y , 100. / vMPos.y , .3, 1. );
 
  //gl_FragColor =  aC ; //* vec4(  1000. - vMPos.y , 100. / vMPos.y , .3, 1. );

}
