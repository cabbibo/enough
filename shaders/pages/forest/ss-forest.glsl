uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_audio;
uniform sampler2D t_active;
uniform sampler2D t_og;

uniform float dT;
uniform float timer;

uniform vec3 flow;
uniform vec3 offset;
uniform float uFlowMultiplier;  // multiplier
uniform float uFloatForce;  // multiplier
uniform float uSpringForce; // multiplier
uniform float uSpringDist; // multiplier
uniform float uRepelMultiplier; // multiplier
uniform float uDampening; // multiplier
uniform float maxVel;

uniform vec3 repelPositions[10];
uniform vec3 repelVelocities[10];
uniform float repelRadii[10];

uniform float xySpacing;
uniform float springDistance;

varying vec2 vUv;


const vec3 floating = vec3( 0. , 0. , 1. );

vec3 cubicCurve( float t , vec3  c0 , vec3 c1 , vec3 c2 , vec3 c3 ){
  
  float s  = 1. - t; 

  vec3 v1 = c0 * ( s * s * s );
  vec3 v2 = 3. * c1 * ( s * s ) * t;
  vec3 v3 = 3. * c2 * s * ( t * t );
  vec3 v4 = c3 * ( t * t * t );

  vec3 value = v1 + v2 + v3 + v4;

  return value;

}

vec3 springForce( vec3 p1 , vec3 p2 , float dist ){

  vec3 dif = p2 - p1;

  vec3 norm = normalize( dif );

  float l = length( dif );

  float springDif = l - dist;

  vec3 force = norm * springDif * uSpringForce;

  return force;


}

vec3 getRepelForce( vec3 p ){

  vec3 repelForce = vec3( 0. );
  
  for( int i = 0; i < 10; i++ ){

    vec3 repelPosition = repelPositions[i];
    vec3 repelVelocity = repelVelocities[i];
    float repelRadius = repelRadii[i];

    vec3 fRepelPoint = repelPosition + offset;

    vec3 repelDif = fRepelPoint - p;

    float repelLength = length( repelDif );

    if( repelLength < repelRadius ){
      float dis = abs(repelLength - repelRadius);
      repelForce -= normalize( repelDif ) * dis * uRepelMultiplier;
    }

  }


  return repelForce;


}


const float size = 1. / 64.;
const float size4 = size * 4.;


void main(){


  vec3 pos = texture2D( t_pos , vUv.xy ).xyz;
  vec3 oPos = texture2D( t_oPos , vUv.xy ).xyz;
  vec3 ogPos = texture2D( t_og , vUv.xy ).xyz;


  float upwardsForce = 80000. / ( pos.z * pos.z);
  //float upwardsForce = 282. /pos.z;

  //vec3 fRepelPoint = repelPoint - offset;
  /*pos   += offset;
  oPos  += offset;
  ogPos += offset;*/
 
  float indexRow = floor(( 1. -vUv.y) * 4. );
  float tendrilIndex = floor( vUv.x * 64. ) + ( indexRow*64. );


 
  float lookupX = mod( tendrilIndex , 16. ) / 16.;
  float lookupY = 1.- ceil( (tendrilIndex+.5) / 16. ) / 16.;

  lookupX += .5/16.;
  lookupY += .5/16.;
    
  vec2 lookup = vec2( lookupX , lookupY );

  vec4 active = texture2D( t_active , lookup );


  float hovered   = active.x;
  float selected  = active.y;
  float current   = active.z;
  float playing   = current * selected;


  float column = vUv.x;

  vec3 vel = pos.xyz - oPos.xyz;

  float preX = (vUv.x * 16.);
  float x = floor(vUv.x *16.);

  float y = vUv.y;
  y *= 4.;
  y = floor( y );

  float slice = ((vUv.y * 4.) - y);

  y += preX - x ;
  x /= 4.;
  
  float z = slice;

  z *= 50.;
  
  y *= 10.;
  x *= 10.;

  vec3 newPos = pos;

  vec3 force = vec3( 0. );

  // The Base Position
  if( slice <= size4 ){

    newPos = ogPos;


    //force += flow * 10.;

  // The tip Position
  }else if( slice >= 1. - size4 ){

    vec3 posDown = texture2D( t_pos , vUv.xy - vec2( 0. , size ) ).xyz;
   
    //vec3 difDown = posDown - pos;
   // force += difDown/12.;
   
    force += springForce( pos , posDown , uSpringDist * ( 1. + ( selected * 300. ) ) / 100.  );

    vec3 dif = ogPos - pos;

   // force += normalize( dif ) * 30.;
 
    force += flow * slice * uFlowMultiplier;//*( ( current * 5.)+1.);

    force += floating * upwardsForce * uFloatForce * selected;

    force += getRepelForce( pos );

    //gl_FragColor = vec4( posDown , 1. );

  // Middle Positions
  }else{

    vec3 posDown = texture2D( t_pos , vUv.xy - vec2( 0. ,  size ) ).xyz;
    vec3 posUp = texture2D( t_pos , vUv.xy + vec2( 0. , size ) ).xyz;

    force += springForce( pos , posDown , uSpringDist * ( 1. + ( selected * 100. ) ) / 100. );
    //force += springForce( pos , posUp , uSpringDist* ( 1. + ( selected * 100. ) ) / 100. );
    
    //force += springForce( pos , posDown , 0. ) * 10.;
   // force += springForce( pos , posUp , 10. ) * 100.;

    gl_FragColor = vec4( posDown , 1. );
    vec3 dif = ogPos - pos;

    //force += normalize( dif ) * 30.;


//    vec3 columnDif = vec3( x , y , 0 ) - pos;
   // force += vec3( columnDif.xy * 10. , 0. )*10.;
    force += flow * slice * uFlowMultiplier;// *( ( current * 5.)+1.);

    force += floating * upwardsForce * uFloatForce * selected; //(( selected * 5.)+1.);

    force += getRepelForce( pos );

  }

 
  float fDT = dT;
  if( dT > .1 ){
    fDT = .1;
  }
  if( slice <= size4 ){ 

    gl_FragColor = vec4( newPos , 1. );

  }else{

     vel += force * 10. * fDT;
    vel *= uDampening;

    if( length( vel ) > maxVel ){

      vel = normalize( vel ) * maxVel;

    }
    
    newPos = pos + vel * fDT; //* ((playing * 4.)+1.);

    gl_FragColor = vec4( newPos , 1. );

  }



}
