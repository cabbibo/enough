uniform float time;
uniform float alive;
uniform sampler2D t_audio;

varying vec3 vVel;
varying float vDepth;
varying float vExploded;

float noise( vec3 p ){

  return (abs( sin( p.x * 100. )) +  abs( sin( p.y * 76. )) +  abs( sin( p.x * 515. )))/3.;

}

void main(){

  vec4 aCol = texture2D( t_audio , vec2( vDepth ,0.));
  //gl_FragColor = vec4( 1.,.3,0.,1. )* vDepth + vec4( 0. , .3 , 1. , 1. ) * ( 1. - vDepth );

  float sparkly = noise( vVel * vDepth );
  //vec3 col = normalize( vVel ) * .5 + .5;
  vec3 col = vec3(  .8 , .5 , .0 );
  gl_FragColor = 2. * sparkly * aCol * (1. - vDepth) * vec4( col , vExploded * alive );// vec4( 1.,.3,0.,1. )* vDepth + vec4( 0. , .3 , 1. , 1. ) * ( 1. - vDepth );


}
