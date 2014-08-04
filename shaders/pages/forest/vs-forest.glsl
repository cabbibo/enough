
uniform sampler2D tNormal;
uniform sampler2D t_pos;
uniform vec3 lightPos;
uniform float girth;
uniform float headMultiplier;

varying vec2 vUv;
varying vec3 vNormal;

varying float vSlice;
varying float vAmount;
varying vec3 vTest;
varying float vHead;

varying vec3 vView;
varying mat3 vNormalMat;
varying vec3 vLightDir;
varying vec3 vMVPos;
varying vec2 vActiveLookup;

varying vec3 vPos;


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
const float hSize = size / 2.;

void main(){

  vec2 uv = position.xy; //+ vec2( size/2. , size/2. );

  vUv = uv;

  vec4 pos = texture2D( t_pos , uv );

 // float slices = 23.;// * 2.;
  float sides  = 10.;

  float simSize = 16.;

  float whichRow = floor(uv.y * 4.);

  // float base
  float base = ((uv.y-(whichRow/4.))*4.) * (simSize-1.); 
  float baseUp = floor( base );
  float baseDown = ceil( base );
  float amount = base - baseUp;
  float rowBase =( whichRow / 4.) +  hSize;

  //float slice = ( uv.y - ( whichRow / 4. ) * 4. ) * simSize
  
  float indexRow = floor(( 1. - uv.y) * 4. );
  float tendrilIndex = floor( uv.x * 64. ) + ( indexRow*64. );


 
  float lookupX = mod( tendrilIndex , 16. ) / 16.;
  float lookupY = 1.- ceil( (tendrilIndex+.5) / 16. ) / 16.;

  lookupX += .5/16.;
  lookupY += .5/16.;
    
  vActiveLookup = vec2( lookupX , lookupY );
  vAmount = amount;
  vSlice = base; 

  vec3 p0 = vec3(0.);
  vec3 v0 = vec3(0.);
  vec3 p1 = vec3(0.);
  vec3 v1 = vec3(0.);

  vec3 p2 = vec3(0.);

  vTest = vec3( 0. , 0. , 0. );
  // Top
  if( baseUp == 0. ){

    vTest = vec3( 1. , 0. , 0. );
    p0 = texture2D( t_pos , vec2( uv.x , rowBase + ( baseUp / simSize )/4.)).xyz;
    p1 = texture2D( t_pos , vec2( uv.x , rowBase + ( baseDown / simSize )/4.)).xyz;
    p2 = texture2D( t_pos , vec2( uv.x , rowBase + ((baseDown + 1.) / simSize )/4.)).xyz;
   
    // v0 = 0
    v1 = .5 * ( p2 - p0 );

  // bottom
  }else if( baseDown == 16. ){

    vTest = vec3(0. , 0. , 1. );
    p0 = texture2D( t_pos , vec2( uv.x , rowBase + ( baseUp / simSize )/4.) ).xyz;
    p1 = texture2D( t_pos , vec2( uv.x , rowBase + ( (baseDown) / simSize )/4. ) ).xyz;
    p2 = texture2D( t_pos , vec2( uv.x , rowBase + (baseUp - 1. ) / simSize )/4.).xyz;
       
    // v1 = 0;
    v0 = .5 * ( p1 - p2 );

  }else{

    vTest = vec3( 0. , 1. , 0. );

    p0 = texture2D( t_pos , vec2( uv.x , rowBase + ( baseUp / simSize )/4.) ).xyz;
    p1 = texture2D( t_pos , vec2( uv.x , rowBase + ( baseDown / simSize )/4. ) ).xyz;
                                         
    // v0 = 0;

    vec3 pM;

    pM = texture2D( t_pos , vec2( uv.x , rowBase + ((baseUp -1.) / simSize )/4.) ).xyz;
    p2 = texture2D( t_pos , vec2( uv.x , rowBase + ((baseDown + 1.)/ simSize )/4.)).xyz;
    
    v1 = .5 * ( p2 - p0 );
    v0 = .5 * ( p1 - pM );

  }


  vec3 c0 = p0;
  vec3 c1 = p0 + v0/3.;
  vec3 c2 = p1 - v1/3.;
  vec3 c3 = p1;

  vec3 centerOfCircle = cubicCurve( amount , c0 , c1 , c2 , c3 );
  vec3 forNormal      = cubicCurve( amount - .1 , c0 , c1 , c2 , c3 );

  vec3 dirNorm = normalize(forNormal - centerOfCircle);

  vNormal = dirNorm;

  vec3 columnPos = centerOfCircle;
  
  vec3 columnToPos = pos.xyz - columnPos;


  // Exact rotation Method

  vec3  upVector = vec3( 0. , 1. , 0. );
  float upVectorProj = dot( upVector , dirNorm );
  vec3  upVectorPara = upVectorProj * dirNorm;
  vec3  upVectorPerp = upVector - upVectorPara;

  vec3 basisX = normalize( upVectorPerp );
  vec3 basisY = cross( dirNorm , basisX );

  //basisX = vec3( 1. , 0. , 0. );
  //basisY = vec3( 0. , 1. , 0. );

  float theta = position.z * 2. * 3.14195;
 
  float x = cos( theta );
  float y = sin( theta );

  float r =  .1;

  vec3 point = columnPos + ( r * x * basisX ) + ( r * y * basisY );


  //vec3 centerPos = columnPos;

  vec3 centerPos = texture2D( t_pos , uv ).xyz;

 

  float radius = girth;//(baseDown-baseUp); //( baseDown - baseUp );// * //amount;

  vHead = 0.;
 
  if( baseDown < .8 ){


   // radius = girth * 60.;

    
  }else if( baseDown > 9. ){

    vHead = 1.;
    radius = girth * headMultiplier * (max( 0. , sqrt(( 14. - (base) )))/5.);

  }
  //if( uv.x < 1. / 64. ){
    
  point = centerOfCircle + radius * basisX * x  + radius * basisY * y;
  //}else{
  //  point = vec3(0.);
  //}
 
  vNormal = normalize(point - centerOfCircle);

  vView = modelViewMatrix[3].xyz;
 // vNormal = normalMatrix *  vNormal ;
  vNormalMat = normalMatrix;

  vPos = point;
 
  vMVPos = (modelViewMatrix * vec4( vPos , 1.0 )).xyz;
  vec3 lightDir = normalize( lightPos -  vMVPos );

  vLightDir = lightDir;


  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );


}

