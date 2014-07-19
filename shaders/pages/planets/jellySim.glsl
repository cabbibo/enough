uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_audio;
uniform sampler2D t_column;

uniform vec3 leader;
uniform float dT;
uniform float timer;

varying vec2 vUv;

const float maxVel = 5.;

const float size = 1. / 32.;
const float hSize = size / 2.;
const float interpolation = .5;
const float springLength = .05;
const float radiusMultiplier = 7.;
const float headSize = 6.;

$simplex

vec3 springForce( vec3 toPos , vec3 fromPos , float staticLength ){

  vec3 dif = fromPos - toPos;
  vec3 nDif = normalize( dif );
  vec3 balance = nDif * staticLength;

  vec3 springDif = balance - dif;

  return springDif;

}


float getRadius( float i ){

  float x = i * 7.5;

  float s1 =((x * ((1./x)*log( x+.1))) + 1.);
  float s2 = ( x * x*.1);
  float s3 = (x*x*x * .015);

  return s1 - s2 + s3;


}

vec3 cubicCurve( float t , vec3  c0 , vec3 c1 , vec3 c2 , vec3 c3 ){
  
  float s  = 1. - t; 

  vec3 v1 = c0 * ( s * s * s );
  vec3 v2 = 3. * c1 * ( s * s ) * t;
  vec3 v3 = 3. * c2 * s * ( t * t );
  vec3 v4 = c3 * ( t * t * t );

  vec3 value = v1 + v2 + v3 + v4;

  return value;

}


void main(){


  vec4 pos = texture2D( t_pos , vUv.xy );
  vec4 oPos = texture2D( t_oPos , vUv.xy );

  vec3 vel = pos.xyz - oPos.xyz;

  float sizeOfTail = headSize / 32.;
  float base      = (vUv.y * sizeOfTail)  * headSize;
  float baseUp    = floor( base );
  float baseDown  = ceil( base );
  float amount    = base - baseUp;

  vec3 pUp    = texture2D( t_column , vec2( 0. , baseUp   / headSize ) ).xyz;
  vec3 pDown  = texture2D( t_column , vec2( 0. , baseDown / headSize ) ).xyz;

  vec3 direction = pUp - pDown;
  vec3 dirNorm  = normalize( direction );

  vec3 columnPos = pDown + (direction * (1.-amount));
  
  vec3 columnToPos = pos.xyz - columnPos;


  vec3 p0 = vec3(0.);
  vec3 v0 = vec3(0.);
  vec3 p1 = vec3(0.);
  vec3 v1 = vec3(0.);
 
  vec3 p2 = vec3(0.);
  if( baseUp == 0. ){

    p0 = texture2D( t_column , vec2( 0. , baseUp    / headSize ) ).xyz;
    p1 = texture2D( t_column , vec2( 0. , baseDown  / headSize ) ).xyz;

    // v0 = 0;

    p2 = texture2D( t_column , vec2( 0. , (baseDown + 1. ) / headSize )).xyz;
    v1 = .5 * ( p2 - p0 );

  }else if( baseDown == headSize ){

    p0 = texture2D( t_column , vec2( 0. , baseUp    / headSize ) ).xyz;
    p1 = texture2D( t_column , vec2( 0. , baseDown  / headSize ) ).xyz;

    // v1 = 0;

    p2 = texture2D( t_column , vec2( 0. , (baseUp - 1. ) / headSize )).xyz;
    v0 = .5 * ( p1 - p2 );

  }else{

    p0 = texture2D( t_column , vec2( 0. , baseUp    / headSize ) ).xyz;
    p1 = texture2D( t_column , vec2( 0. , baseDown  / headSize ) ).xyz;

    // v0 = 0;

    vec3 pMinus = texture2D( t_column , vec2( 0. , (baseUp -1.)    / headSize ) ).xyz;
    p2 = texture2D( t_column , vec2( 0. , (baseDown + 1. ) / headSize )).xyz;
    v1 = .5 * ( p2 - p0 );
    v0 = .5 * ( p1 - pMinus );

  }


  vec3 c0 = p0;
  vec3 c1 = p0 + v0/3.;
  vec3 c2 = p1 - v1/3.;
  vec3 c3 = p1;

  vec3 centerOfCircle = cubicCurve( amount , c0 , c1 , c2 , c3 );
  vec3 forNormal      = cubicCurve( amount - .1 , c0 , c1 , c2 , c3 );

  dirNorm = normalize(forNormal - centerOfCircle);

  columnPos = centerOfCircle ;
  
  columnToPos = pos.xyz - columnPos;

  vec3 p = vec3( 0. );

  // Exact rotation Method

  vec3 upVector = vec3( 0. , 0. , 1. );
  float upVectorProj = dot( upVector , dirNorm );
  vec3 upVectorPara = upVectorProj * dirNorm;
  vec3 upVectorPerp = upVector - upVectorPara;

  vec3 basisX = normalize( upVectorPerp );
  vec3 basisY = cross( dirNorm , basisX );

  float theta = vUv.x * 2. * 3.14195;
 
  float x = cos( theta );
  float y = sin( theta );

  float bell = smoothstep( 0. , 1. , vUv.y*vUv.y*1.);
  float r =  100. * vUv.y * vUv.y ;


  c0 = vec3( 0. , 0. , 0. );
  c1 = vec3(.1 , 100. , 0. );
  c2 = vec3( 4. , 100. , 0. );
  c3 = vec3( 5. , 550. , 0. );
  vec3 cc = cubicCurve( vUv.y, c0 , c1 , c2 , c3 );

  vec2 absVUv = vec2( abs( vUv.x - .5 )*2. , abs( vUv.y - .5 ) * 2. ); 
  vec2 noiseLookup = absVUv * 5. + vec2( timer * .5 , timer * .5 );
  float noiseAmount = 1.2 + snoise( noiseLookup ) * .4 * vUv.y * vUv.y;
  r = getRadius( vUv.y ) * radiusMultiplier * noiseAmount;
 

  float pointInCircle = sin((vUv.x+timer*.1)*10.*3.14159);
  
  vec3 pointToAttractTo = columnPos + ( r * x * basisX ) + ( r * y * basisY ) + pointInCircle * dirNorm * vUv.y * vUv.y * 5.;
  vec3 distToPoint = pointToAttractTo - pos.xyz;

  vec3 pointPower = distToPoint ;

  p = pos.xyz +vel*.5+( pointPower * (noiseAmount-.6) + .8 * pointInCircle);
  gl_FragColor = vec4( p , 1. );



}
