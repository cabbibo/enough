
attribute vec2 info;
uniform vec3 lightPos;

varying float vDepth;

varying vec2 vRibbonUV;
varying vec2 vLookupUV;
varying float vAmount;

varying vec3 vMVPos;
varying vec3 vNormal;

varying vec3 vEye; 
varying float vHead;
varying vec2 vSEM;

const int depth = @DEPTH;

uniform sampler2D t_posArray[ depth ];

$cubicCurve
$semLookup

void main(){


  // uv.y is if ribbon is top or bottom
  // uv.x is depth

  vRibbonUV = uv.xy;
  vLookupUV = position.xy;

  // Where along the length of the spine we are
  // where the tail is fully at the 'depth' of the spine
  // and head is at 0
  float base = uv.x * float(depth-1);

  // the joint above us
  float baseUp = floor( base );

  // the joint below
  float baseDown   = ceil( base );

  // the position along the current bone
  float amount = base - baseUp;

    vAmount = amount;


  // Assigning some values to use in our cubic curves
  vec3 p = vec3( 0. );

  vec3 p0 = vec3(0.);
  vec3 v0 = vec3(0.);
  vec3 p1 = vec3(0.);
  vec3 v1 = vec3(0.);

  vec3 p2 = vec3(0.);


  // the 'head' of the creature
 // if( baseUp == 1000000000000. ){
  if( baseUp == 0. ){


    // Loop through to find values we need to sample
    for( int i = 0; i < depth; i++ ){

      if( i == int( baseUp ) ){
        p0 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseDown ) ){
        p1 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseDown + 1. )){
        p2 = texture2D( t_posArray[i] , position.xy ).xyz;
      }

    }

    v1 = .5 * ( p2 - p0 );

  // the 'tail' of the creature
  }else if( int( baseDown ) == depth - 1 ){

    // Loop through to find values we need to sample
    for( int i = 0; i < depth; i++ ){

      if( i == int( baseUp ) ){
        p0 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseDown ) ){
        p1 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseUp - 1. )){
        p2 = texture2D( t_posArray[i] , position.xy ).xyz;
      }

    }

    v0 = .5 * ( p1 - p2 );

  // The 'middle' of the creature
  }else{

    vec3 pMinus;
    // Loop through to find values we need to sample
    for( int i = 0; i < depth; i++ ){

      if( i == int( baseUp ) ){
        p0 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseDown ) ){
        p1 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseUp - 1. )){
        pMinus = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseDown + 1. ) ){
        p2 = texture2D( t_posArray[i] , position.xy ).xyz;
      }

    }

    v1 = .5 * ( p2 - p0 );
    v0 = .5 * ( p1 - pMinus );

  }


  vec3 c0 = p0;
  vec3 c1 = p0 + v0/3.;
  vec3 c2 = p1 - v1/3.;
  vec3 c3 = p1;

  vec3 centerOfCircle = cubicCurve( amount , c0 , c1 , c2 , c3 );
  vec3 forNormal      = cubicCurve( amount - .001 , c0 , c1 , c2 , c3 );

  vec3 dirNorm = normalize( forNormal - centerOfCircle );
  //vec3 columnPos = centerOfCircle;
  //vec3 columnToPos = pos.xyz - columnPos;


  vec3  upVector = normalize(centerOfCircle - cameraPosition); //vec3( 0. , 1. , 0. );
  //vec3  upVector = normalize( centerOfCircle );// vec3( 0. , 1. , 0. );
  float upVectorProj = dot( upVector , dirNorm );
  vec3  upVectorPara = upVectorProj * dirNorm;
  vec3  upVectorPerp = upVector - upVectorPara;

  vec3 basisX = normalize( upVectorPerp );
  vec3 basisY = cross( dirNorm , basisX );

  float t = position.z;
  float r = uv.x;


  if( uv.x < .3 ){

    vHead = 1.;
    r = pow( uv.x , .5 ) * 5.3;

  }else{

    vHead = 0.;
    r = 2.;//abs( sin( uv.x  * 5.) ) + uv.x;
  }


  t *= (2. * 3.14159);
  float x = r * cos(t); 
  float y = r * sin(t); 

  p = centerOfCircle + basisY * y + basisX * x;
  

  vEye = normalize( p - cameraPosition);
  vNormal = normalize( p - centerOfCircle);


  vMVPos = (modelViewMatrix * vec4( p , 1. )).xyz;

  vEye = normalize( vMVPos.xyz );

  vSEM = semLookup( vEye , vNormal );

  gl_Position = projectionMatrix * modelViewMatrix * vec4( p , 1. );


}
