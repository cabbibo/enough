uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_start;
uniform float dT;

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
    
    vec3 curl = curlNoise( pos.xyz * .02 );
    f += curl* .005;
    f += vec3(0. , -.007 ,0.);
 
  }
 
 /* vec3 curl = curlNoise( pos.xyz * .002 );
  f+= curl* .5;
*/



  vel += f;
  vel *= .99;//dampening;


  /*if( length(vel) > 5. ){

    vel = normalize( vel ) * 5.;

  }*/


  if( life > 10. ){
   
   
    p = texture2D( t_start , vUv ).xyz + target.xyz;
     vel *= 0.;
     life = -1.;

  }

  if( life == 0. ){
 
    p = texture2D( t_start , vUv ).xyz * 10. + target.xyz;

    vel = direction;
   // vel *= 0.;

  }


  if( explosion > .1 ){
     

    //p = texture2D( t_start , vUv ).xyz + target.xyz;
    //vel = direction * 
    
   // vel = direction* .0;
    vec3 curl = curlNoise( pos.xyz * .01 * sin(vUv.y) * cos(vUv.x));
    //vel += curl * 6.;  

    // pastry:
   // vec3 esp = vec3(sin(vUv.y* 100.) , cos( vUv.y*100. ) , sin( vUv.x * vUv.y * 100. ) )  * 5.;  

    vec3 esp = direction;

    if( explosionType < .3 ){
      esp += vec3( 1. * floor( vUv.x * 6. ) +sin(vUv.y* 100.)*.3  , 1. ,  1. * floor( vUv.y * 6. )+sin(vUv.x* 100.)*.3   );

      esp *= 2.;

    }else if( explosionType > .3 && explosionType < .6 ){

      esp += vec3(sin(vUv.y* 100.) , cos( vUv.y*100. ) , sin( vUv.x * vUv.y * 100. ) )  * 5.;  


    }else if( explosionType > .6 && explosionType < .9 ){

      esp += 4. * curlNoise( pos.xyz * .01 * sin(vUv.y) * cos(vUv.x));

    }else if( explosionType > .9 && explosionType < .91 ){


      esp +=  floor( vUv.y * vUv.x * 100. ) * direction * .1; //4. * curlNoise( pos.xyz * .01 * sin(vUv.y) * cos(vUv.x));
     
      float t =vUv.x * 3.14159 * 2.;
    
      vec3 x = vec3(0.);

      x.x += sin( t ) * 4.;
      x.z += cos( t ) * 4.;

      esp += x;

    }else{

      vec3 di = vec3( 0. );
      float c = floor( vUv.y * 20. );

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


      esp +=  di * 1.; //4. * curlNoise( pos.xyz * .01 * sin(vUv.y) * cos(vUv.x));
     

    }


    //wha:
    //vec3( vUv.x , vUv.y , length( vUv ) );


    vel += esp; //+ direction;//vec3( vUv.x -.5, vUv.y-.5 , length( vUv )-1. ) * 3.;
  
 
    life = .1;
   // vel += vec3( 0. , 10. , 0. );
  }
  
  p += vel * 1.;//speed;


  if( instant > .5 ){

     p = texture2D( t_start , vUv ).xyz + target.xyz;


  }

  if( exploded < .5 ){

    p = texture2D( t_start , vUv ).xyz * 10. + target.xyz;
    
   // p = texture2D( t_start , vUv ).xyz + target.xyz;

  }

  gl_FragColor = vec4( p , life  );

}
