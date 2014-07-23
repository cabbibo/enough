

uniform sampler2D t_pos;

varying vec2 vUv;

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

const float size = 1. / 64.;

void main(){

  vec2 uv = position.xy;

  vUv = uv;

  vec4 pos = texture2D( t_pos , uv );

  float slices = 16.;
  float sides  = 10.;

  float simSize = 16.;

  float whichRow = floor(uv.y * 4.);
  float base = ((uv.y-(whichRow/4.))*4.) * simSize; 
  float baseUp = floor( base );
  float baseDown = ceil( base );
  float amount = base - baseUp;
  float rowBase = whichRow / 4.;
  
  vec3 p0 = vec3(0.);
  vec3 v0 = vec3(0.);
  vec3 p1 = vec3(0.);
  vec3 v1 = vec3(0.);

  vec3 p2 = vec3(0.);

  if( baseUp == 0. ){

    p0 = texture2D( t_pos , vec2( uv.x , rowBase + ( baseUp / simSize ))).xyz;
    p1 = texture2D( t_pos , vec2( uv.x , rowBase + ( baseDown / simSize ))).xyz;
    p2 = texture2D( t_pos , vec2( uv.x , rowBase + ((baseDown + 1.) / simSize ))).xyz;
   
    // v0 = 0
    v1 = .5 * ( p2 - p0 );

  }else if( baseDown == simSize ){

    p0 = texture2D( t_pos , vec2( uv.x , rowBase + ( baseUp / simSize )) ).xyz;
    p1 = texture2D( t_pos , vec2( uv.x , rowBase + ( baseDown / simSize ) ) ).xyz;
    p2 = texture2D( t_pos , vec2( uv.x , rowBase + (baseUp - 1. ) / simSize )).xyz;
       
    // v1 = 0;
    v0 = .5 * ( p1 - p2 );

  }else{

    p0 = texture2D( t_pos , vec2( uv.x , rowBase + ( baseUp / simSize )) ).xyz;
    p1 = texture2D( t_pos , vec2( uv.x , rowBase + ( baseDown / simSize ) ) ).xyz;

    // v0 = 0;

    vec3 pMinus;

    pMinus = texture2D( t_pos, vec2( uv.x , rowBase + ((baseUp -1.) / simSize )) ).xyz;
    p2 = texture2D( t_pos, vec2( uv.x , rowBase + ((baseDown + 1.)/ simSize ))).xyz;
    
    v1 = .5 * ( p2 - p0 );
    v0 = .5 * ( p1 - pMinus );

  }


  vec3 c0 = p0;
  vec3 c1 = p0 + v0/3.;
  vec3 c2 = p1 - v1/3.;
  vec3 c3 = p1;

  vec3 centerOfCircle = cubicCurve( amount , c0 , c1 , c2 , c3 );
  vec3 forNormal      = cubicCurve( amount - .1 , c0 , c1 , c2 , c3 );

  vec3 dirNorm = normalize(forNormal - centerOfCircle);

  vec3 columnPos = centerOfCircle;
  
  vec3 columnToPos = pos.xyz - columnPos;


  // Exact rotation Method

  vec3  upVector = vec3( 0. , 1. , 0. );
  float upVectorProj = dot( upVector , dirNorm );
  vec3  upVectorPara = upVectorProj * dirNorm;
  vec3  upVectorPerp = upVector - upVectorPara;

  vec3 basisX = normalize( upVectorPerp );
  vec3 basisY = cross( dirNorm , basisX );

  basisX = vec3( 1. , 0. , 0. );
  basisY = vec3( 0. , 1. , 0. );

  float theta = position.z * 2. * 3.14195;
 
  float x = cos( theta );
  float y = sin( theta );

  float r =  .1;

  vec3 point = columnPos + ( r * x * basisX ) + ( r * y * basisY );


  vec3 centerPos = texture2D( t_pos , uv ).xyz;

  point = centerPos;
  

  gl_Position = projectionMatrix * modelViewMatrix * vec4( point , 1.0 );


}

