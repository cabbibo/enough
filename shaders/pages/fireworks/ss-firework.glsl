uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_start;
uniform float dT;
uniform float time;

uniform float exploded;
uniform float alive;

uniform vec3 target;
uniform vec3 direction;

uniform float explosion;
uniform float explosionType;

uniform float instant;
varying vec2 vUv;


$simplex
$curl

void main(){


  
  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos , vUv );

  vec3 vel  = pos.xyz - oPos.xyz;
  vec3 p    = pos.xyz;


  float life = pos.w;
  
  vec3 f = vec3( 0. , 0. , 0. );
  
  // Always restarting
  if( life < 0. ){
    life = 0.;
  }else{
    if( exploded > .5 ){
     // life += dT*10.* (abs(sin( vUv.x * 1000. * cos( vUv.y * 500. )))+4.) ;
    }
  }
  
 
  if( exploded > .5 ){
    
    //vec3 curl = curlNoise( pos.xyz * .1 );
    //f += curl* .05;
    f += vec3(0. , -.03 ,0.);
 
  }
 


  vel += f;
  vel *= .99;//dampening;



  if( life > 10. ){
   
   
    p = texture2D( t_start , vUv ).xyz + target.xyz;
     vel *= 0.;
     life = -1.;

  }

  if( life == 0. ){
 
    p = texture2D( t_start , vUv ).xyz * 1.2 + target.xyz;

    vel = direction;
   // vel *= 0.;

  }


  
  // We get 1 frame of explosion
  if( explosion > .1 ){
     
    float type = abs(sin(sin( vUv.y * 75.89 + time ) * 1816. + 8962. * sin( vUv.x * 51.35 * time )));

    vec3 esp = direction;

    vec3 curl = curlNoise( pos.xyz * .01 * sin(vUv.y) * cos(vUv.x));
     
    vec3 di = vec3( 0. );
    float c = floor( vUv.y * 6. );

    if( c < 1. ){
      di = vec3( 1. , 0. , 0. );
    }else if( c < 2. && c >= 1. ){
      di = vec3( -1. , 0. , 0. );
    }else if( c < 3. && c >= 2. ){
      di = vec3( 0. , 1. , 0. );
    }else if( c < 4. && c >= 3. ){
      di = vec3( 0. , -1. , 0. );
    }else if( c < 5. && c >= 4. ){
      di = vec3( 0. , 0. , 1. );
    }else{
      di = vec3( 0. , 0. , -1. );
    }

  

    float v = 1. / 6.;
    if( explosionType < v ){ 
      vel += esp * 2. + di * 4.;
    }else if( explosionType >= v * 1. && explosionType < v * 2. ){ 
      vel += esp * 2. + vec3( vUv.x -.5, vUv.y-.5 , length( vUv )-1. ) * 5.;
    }else if( explosionType >= v * 2. && explosionType < v * 3. ){ 
      vel += esp * 2. + curl * 2.;
    }else if( explosionType >= v * 3. && explosionType < v * 4. ){ 
      vel += esp * 2. + 1. * vec3( sin( vUv.x * 20. ) , vUv.x * 10. , cos( vUv.x * 20. ) ) ;
    }else if( explosionType >= v * 4. && explosionType < v * 5. ){ 
      vel += esp * 3.;
    }else if( explosionType >= v * 5. && explosionType < v * 6. ){ 
      vel += esp * 2. + di * 4.;
    }else{


    }

   
 
    life = 1.;
   // vel += vec3( 0. , 1. , 0. );
  }
  
  p += vel * 1.;//speed;


  if( instant > .5 ){

     p = texture2D( t_start , vUv ).xyz + target.xyz;


  }

  if( exploded < .5 ){

    p = texture2D( t_start , vUv ).xyz + target.xyz;
    
   // p = texture2D( t_start , vUv ).xyz + target.xyz;

  }

  float esp = life;

  life += exploded * .1;
  life = clamp( life , 0. , 2. );
  
  gl_FragColor = vec4( p , life  );

}
