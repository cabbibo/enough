uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_og;
uniform sampler2D t_audio;
uniform sampler2D t_flag;


uniform float dT;
uniform float time;

uniform float maxVel;
uniform float springLength;
uniform float dampening;
uniform float springMultiplier;
uniform float noiseSize;
uniform float sample;

uniform vec3 windDirection;
uniform float windSpeed;
uniform float windDepth;
uniform float windHeight;

uniform float returnMultiplier;


const float size  = @SIZE;
const float iSize = @ISIZE;
const float hSize = @HSIZE;

varying vec2 vUv;

$simplex
$springForce

void main(){

  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos , vUv );

  vec4 og   = texture2D( t_og , vUv );
  vec3 vel  = pos.xyz - oPos.xyz;
  vec3 p    = pos.xyz;

  float life = pos.w;
  
  vec3 f = vec3( 0. , 0. , 0. );
 
  vec3 dif = pos.xyz - og.xyz;

  float sl = springLength;

  float power = 2.;
 // vec3 newP = p;
  if( vUv.x > iSize ){

    vec3 p1 = texture2D( t_pos , vec2( vUv.x - iSize , vUv.y )).xyz;
    vec3 nP = springForce(  p , p1 , sl );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }

 
  }
  
  if( vUv.x < 1. - iSize ){

    vec3 p1 = texture2D( t_pos , vec2( vUv.x + iSize , vUv.y )).xyz;
    vec3 nP = springForce(  p , p1 , sl );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }

  
  }

  if( vUv.y > iSize ){

    vec3 p1 = texture2D( t_pos , vec2( vUv.x , vUv.y - iSize)).xyz;
    vec3 nP = springForce(  p , p1 , sl );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }

  
  
  }

  if( vUv.y < 1. - iSize ){

    vec3 p1 = texture2D( t_pos , vec2( vUv.x , vUv.y + iSize)).xyz;
    vec3 nP = springForce(  p , p1 , sl );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }

 
  }

  if( vUv.y < 1. - iSize && vUv.x < 1. - iSize ){

    vec3 p1 = texture2D( t_pos , vec2( vUv.x + iSize , vUv.y + iSize)).xyz;
    vec3 nP = springForce(  p , p1 , pow( 2. * sl*sl , .5 )  );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }
  }

  if( vUv.y > iSize && vUv.x < 1. - iSize ){

    vec3 p1 = texture2D( t_pos , vec2( vUv.x + iSize , vUv.y - iSize)).xyz;
    vec3 nP = springForce(  p , p1 , pow( 2. * sl*sl , .5 )  );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }


  }

  if( vUv.y > iSize && vUv.x > iSize ){

    vec3 p1 = texture2D( t_pos , vec2( vUv.x - iSize , vUv.y - iSize)).xyz;
    vec3 nP = springForce(  p , p1 , pow( 2. * sl*sl , .5 )  );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }

  }
  
  if( vUv.y < 1. - iSize && vUv.x > iSize ){

    vec3 p1 = texture2D( t_pos , vec2( vUv.x - iSize , vUv.y + iSize)).xyz;

    vec3 nP = springForce(  p , p1 , pow( 2. * sl*sl , .5 )  );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }

  }

  //newP /= 8.;



  f /= 20.;
 
/*  vec3 rF = vec3( 0. );
  vec3 P = p - vec3( 0. );
  if( length( P ) < 1.5 ){
    rF = (1.5 - length( P )  ) *  normalize( P ) / length( P );
  }
  P = p - vec3( 3. , 2. , 0. );
  if( length( P ) < 1.5 ){
    rF = (1.5 - length( P )  ) *  normalize( P ) / length( P );
  }
  P = p - vec3( -3. , -2. , 0. );
  if( length( P ) < 1.5 ){
    rF = (1.5 - length( P )  ) *  normalize( P ) / length( P );
  }
  f += rF;*/
 // f -= pos.xyz * pos.xyz *pos.xyz * .1;

 // vel +=  f*min( .1 , dT);
 //  vel *= dampening;

  vec3 offset = vec3( sin( time * 49.0056012 ) , cos( time * 19.026933) , sin( time * .15248));
  offset = vec3( sin( time * .56012 ) , cos( time * .046933) , sin( time * .015248));

  float windMultiplier = snoise( pos.xyz * noiseSize + offset );
  offset = vec3( sin( time * .36012 ) , cos( time * .26933) , sin( time * .015248));
  float windHMultiplier = snoise( pos.xyz * noiseSize + offset );

//  float windMultiplier = (abs(sin( time )) + abs(cos( time * .026933)))*.5 + 1. ;

  f += windDirection * .2 * windSpeed + windSpeed * vec3( 0.,  windHeight * windHMultiplier , windDepth * windMultiplier);
  
  // windDirection +vec3( 0. , windHeight * windHMultiplier , windDepth * windMultiplier)) * windSpeed;



  //vel *= (length( a )*length( a )*length( a ) )+.5;
 /* vel = (newP + (windDirection * windSpeed * (snoise( p * .01 +offset)*.8+1.))) *min( .1 , dT) ;
  if( length(vel) > maxVel){
    vel = normalize( vel ) * maxVel;
  }*/

//  vec4 flag = texture2D( t_flag , vUv );

  //if( flag.r < .5 ){

  //  f-= .00001 * returnMultiplier*(p - og.xyz) *( 1. - flag.r);

  //}


 // p += 6000. * normalize( newP) * ( length( newP ) * length( newP ) * length( newP ));

 //+= windDirection * windSpeed * .0001 * windMultiplier / sample;
 
  vel += f;
  vel *= dampening;
  p += vel;//* min( .1 , dT );/// sample;


  //vel = min( length(maxVel) , length(vel) )*normalize(vel) / 1.1;
  // Verlet integration 
  //p = pos.xyz + (pos.xyz - oPos.xyz) * (.99 + .01*dampening);  //+ min( .01 , dT * dT );

  vec3 difP = p - pos.xyz;

  if( length( difP ) > maxVel * (3.-vUv.x) ){
    p = pos.xyz + normalize( difP ) * maxVel * .9* (3.-vUv.x);
  }

  if( vUv.x < iSize  ){

    float aPow = length( texture2D( t_audio , vec2( abs( vUv.y-.5), 0. ) ) );
    p = og.xyz - .0001 * vec3( 3.1 * aPow , sin( aPow * 20.) * 4. , cos( aPow * 6. ) * 5. );



  }


  /*if( vUv.x < iSize  ){//|| vUv.y < iSize || vUv.x > 1.- iSize ||vUv.y > 1. -iSize   ){
    p = og.xyz - vec3( length( texture2D( t_audio , vec2( vUv.y, 0. ) ) ) , 0. , length( texture2D( t_audio , vec2( vUv.y, 0. ) ) ) );
  }
  if( vUv.x > 1. - iSize  ){//|| vUv.y < iSize || vUv.x > 1.- iSize ||vUv.y > 1. -iSize   ){
    p = og.xyz + vec3( length( texture2D( t_audio , vec2( vUv.y, 0. ) ) ) , 0. , length( texture2D( t_audio , vec2( vUv.y, 0. ) ) ) );
  }
  if( vUv.y > 1. - iSize  ){//|| vUv.y < iSize || vUv.x > 1.- iSize ||vUv.y > 1. -iSize   ){
    p = og.xyz + vec3( 0. , length( texture2D( t_audio , vec2( vUv.x, 0. ) ) )  , length( texture2D( t_audio , vec2( vUv.y, 0. ) ) ) );
  }
   if( vUv.y <  iSize  ){//|| vUv.y < iSize || vUv.x > 1.- iSize ||vUv.y > 1. -iSize   ){
    p = og.xyz - vec3( 0. , length( texture2D( t_audio , vec2( vUv.x, 0. ) ) )  , length( texture2D( t_audio , vec2( vUv.y, 0. ) ) ) );
  }*/



 

  //gl_FragColor = vec4( og.xyz + sin( timer ) * 1.* vec3( vUv.x , vUv.y , 0. ), 1.  );
  gl_FragColor = vec4( p , life );

}
