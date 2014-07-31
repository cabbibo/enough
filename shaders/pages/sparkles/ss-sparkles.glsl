//uniform sampler2D t_to;
uniform sampler2D t_oPos;
uniform sampler2D t_pos;

uniform float timer;
uniform float flowSpeed;
uniform float startingVel;
uniform float lifeMultiplier;
uniform float curlPower;
uniform float noiseSize;

uniform float repelCutoff;
uniform float repelPower;
uniform float repelMultiplier;

uniform vec3 repelPos[ 4 ];


varying vec2 vUv;

$simplex
$curl

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(){

  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos  , vUv );
 
  vec3 vel = pos.xyz - oPos.xyz;

  float random = rand( vUv * 100. );
  float random2 = rand( vUv * 10. );
  float random3 = rand( vUv * 50. );
  float random4 = rand( vUv * 75. );

  //vel += vec3( -.05 , .05 * (random3 - .5) , .05 * (random2 - .5) ) * flowSpeed;

  
  for( int i = 0; i < 4; i++ ){

    vec3 rPos = repelPos[i];

    vec3 dif = pos.xyz - rPos;

    float l = length( dif );

    vel += normalize( dif ) * pow( repelCutoff / l , repelPower ) * repelMultiplier;

  }

  vel += vec3( -1. , 0.  , 0. ) * flowSpeed;
  float life = pos.w;

  life -= .005  * ( 1. + random ) * lifeMultiplier;

  float t = random * 3.14159 * 2.;


  float z = cos( t ) * 1000. * random4;
  float y = sin( t ) * 1000. * random4;
 

  if( life > 100. ){

    pos.xyz = vec3( 1000. ,  (random3 -.5 ) * 600. , (random2 -.5 ) * 1000.  );


    vel = vec3( -.1000000 , 0. , 0. ) * startingVel;

    life = 1.;


  }

  if( life < 0. ){

    pos.xyz = vec3( 1000. , (random3 -.5 ) * 600.  ,(random2 -.5 ) * 1000.  );

   vel = vec3( -.100000 , 0. , 0. ) * startingVel;
    life = 105.;

  }
  /*if( life > 100. ){

    life = 1.;

    pos.xyz = vec3( 100. ,  0. , 0.  );
    vel = vec3( -.1 , 0. , 0. ) //* startingVel;

  }*/

  vec3 curlForce = curlNoise( pos.xyz * noiseSize );

  vel += curlForce * curlPower;

  vel *= .9;


    vec3 newPos = pos.xyz + vel;


  gl_FragColor= vec4( newPos , life );

}
