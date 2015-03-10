uniform sampler2D t_audio;
uniform vec3 maniPos;

attribute vec2 info;
varying float vDepth;

varying vec2 vRibbonUV;
varying vec2 vLookupUV;
varying float vAmount;

varying vec3 vNormal;

varying vec3 vEye;

varying vec3 vPos;
varying vec3 vMPos;
varying vec3 vMVPos;
//varying vec3 vLightVec;

const int depth = @DEPTH;

uniform sampler2D t_posArray[ depth ];

$cubicCurve

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
  vec3 forTangent     = cubicCurve( amount + .001 , c0 , c1 , c2 , c3 );


  vec3 dirVec = forNormal - centerOfCircle;
  vec3 dirNorm = normalize( forNormal - centerOfCircle );

  vec3 tang = normalize( cross( forNormal , forTangent ));
  //vec3 columnPos = centerOfCircle;
  //vec3 columnToPos = pos.xyz - columnPos;


  vec3 tanVec = forTangent - centerOfCircle;
  vec3 tanNorm = normalize( tanVec );

  vec3 ave = normalize((((forNormal + forTangent)/2.) - centerOfCircle ));
  //vec3  upVector =  ave;//normalize((modelViewMatrix * vec4( centerOfCircle ,1.)).xyz - maniPos);
  vec3  upVector = normalize((modelViewMatrix * vec4( centerOfCircle ,1.)).xyz - maniPos);
 //vec3( 0. , 1. , 0. );
  //vec3  upVector = normalize( centerOfCircle );// vec3( 0. , 1. , 0. );
  float upVectorProj = dot( upVector , dirNorm );
  vec3  upVectorPara = upVectorProj * dirNorm;
  vec3  upVectorPerp = upVector - upVectorPara;

  vec3 basisX = normalize( upVectorPerp );
  vec3 basisY = cross( dirNorm , basisX );

  vec4 aColor = texture2D( t_audio , vRibbonUV );
  

 // p = centerOfCircle + basisY * (uv.y * abs(sin( uv.x *4.+3.14)) + .4) * 4.;
 // p = centerOfCircle + basisY * 10. *(uv.y * abs(sin( pow( uv.x * 20. , .3) *4.+3.14)) + .4);// * length( aColor );//* (uv.y * abs(sin( uv.x *4.+3.14)) + .4) * 4.;
  p = centerOfCircle + tang * 10. * uv.y * pow( uv.x-.1 , .3); 



  vEye = normalize((modelViewMatrix * vec4( centerOfCircle ,1.)).xyz - cameraPosition);
  vNormal = basisX;

  vec3 e = normalize( vec3( modelViewMatrix * vec4( p.xyz , 1. ) ) );
  vec3 n = normalize( normalMatrix * vNormal );


  vPos = p;
  vMPos = ( modelMatrix * vec4( p , 1. ) ).xyz;
  vMVPos = (modelViewMatrix * vec4( p , 1. )).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( p , 1. );


}
