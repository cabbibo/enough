
uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform mat4 uModelView;

uniform float toForceMultiplier;

uniform sampler2D t_audio;
uniform sampler2D t_start;
uniform float time;
uniform float delta;

uniform vec3 uPos;
uniform vec3 uVel;
uniform vec3 finalPos;

varying vec2 vUv;

$simplex
$curl


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main(){

  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos , vUv );

  vec3 vel = pos.xyz - oPos.xyz;

  float life = pos.w;


  vec4 audioX = texture2D( t_audio , vec2( vUv.x , 0. ) );
  vec4 audioY = texture2D( t_audio , vec2( vUv.y , 0. ) );


  vec3 mvPos = ( uModelView * vec4( pos.xyz , 1. ) ).xyz;
  vec3 curl = curlNoise( mvPos.xyz * .04 );

  vec3 toForce =  finalPos - mvPos;

  vel += (toForce  / ( 1000. * life )) * toForceMultiplier;

  vel += curl * .5 * ( 1. - life );

  vel += vec3( 0. , 1. * life* life , 0. );
  //vel += vec3( 0. , -1. * ( 1. - life ) , 0. );


  if( life == 1. ){


    float r = rand( vec2( audioX.x , audioY.y ) );

   // vel = uVel.xyz * 10. *  normalize( uVel ) * r;
   // vel = 1. * vec3( sin( r * 3.14159 ) , cos( r * 3.142 ) , cos( sin( r * 10.0 ) ));

    vel = vec3( 0. , 10. , 0. );
  }


  //vec3 p = pos.xyz + vel * .6 * audioX.x * audioX.y* audioX.x * audioX.y  ; 


  vec3 p = pos.xyz + vel * .9 * ( .1 + audioX.x);


  //life -= .01;
  life -= .003 * (length( audioX ) * length( audioY ) + 1.) ;

    
  if( life <= 0.0 ){

    life = 1.;
    p = uPos;



  }


  gl_FragColor = vec4( p , life );


}
