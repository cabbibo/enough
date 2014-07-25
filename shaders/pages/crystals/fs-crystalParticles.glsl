uniform sampler2D t_audio;
uniform sampler2D sprite;
uniform vec3  color;
uniform float id;
uniform vec3 uPos;
uniform vec3 uVel;

varying vec2 vUv;


varying vec4 vPos;
//varying vec4 vVel;
//varying vec4 vAudio;

void main(){

  /*float y = smoothstep( -5.0 , 5. ,  vVel.y );

  vec4 s = texture2D( sprite , vec2( gl_PointCoord.x , 1.0 - gl_PointCoord.y) );

  vec2 sample = vec2( abs( vPos.y / 20. ) , 0.0 );
  vec4 a = texture2D( t_audio , sample );

  float newY = vVel.y * -1.;
  vec3 vNorm = normalize( vVel.xyz + vec3( 0. , newY* .99 , 0. ) );
 // vNorm = normalize( vPos.xyz );

  vec3 c1 = y * normalize(abs(sin( vNorm * 20. ) ) + abs(sin( vNorm * 20.2 ) ));
  vec3 c2 = vec3( .5 , .5 , .5 );

  vec3 newC = smoothstep( c1 , c2 , abs(vNorm) );
  vec3 finalC = normalize( vec3( .8 , .2 , 1.9 ) + newC );
  gl_FragColor = vec4( color *  normalize( vec3( s.x * (.9 + (.5 * vUv.x) ) , s.yz*  ((finalC + vAudio.xyz*.6) -.4).xy)) , s.w * s.x );

  gl_FragColor = vec4( color + vec3( normalize(s * a * normalize( vVel ) * normalize( vPos )).xyz), s.w * s.x );


  vec3 cTest = smoothstep( vec3( 1. , 1. , 1. ), vec3( id , 1. - id , cos( id)), vec3( .0 , 2. , 1. ) );
  vec3 shimmer = vec3( (.8+ (.2 * a.y)) * 5.3 ,(.8+ (.2 * a.x)) * .6 , .1 );// - a.xyz * 5.;
  gl_FragColor = vec4( shimmer * (1. / vPos.w ) , (.5 / vPos.w ) * s.w * s.x * .6);*/

  /*vec4 s = texture2D( sprite , vec2( gl_PointCoord.x , 1.0 - gl_PointCoord.y) );
  
  vec2 sample = vec2( abs( vPos.y / 20. ) , 0.0 );
 
  if( s.a < .1 ){
    discard;
  }
  
  vec4 a = texture2D( t_audio , sample );
  
  gl_FragColor = vec4( a * s * vec4(color , 1.0 ));*/

  gl_FragColor = texture2D( t_audio , vec2( vUv.x , 0.0 ) );
  //gl_FragColor = vec4( 1. );


}
