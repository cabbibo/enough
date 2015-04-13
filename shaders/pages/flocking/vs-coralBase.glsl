uniform vec4 coralData;
uniform vec3 coral;
varying float vDisplacement;
varying float vRadius;

varying vec3 vMPos;

varying vec3 vNorm;


vec4 getNewPos( vec3 p ){


  vec3 mPos = (modelMatrix * vec4( p , 1. )).xyz;

  float displacement = 0.;

  vec2 mXZ = mPos.xz;
  
  float r = p.y;

  vec2 coralPos = coralData.xz;

  float dist = length(  coralPos - mXZ );

  displacement += pow(coralData.w,2.) *  .02 / pow( dist, 2.3);// ( dist * dist);


  displacement = min( 5. , displacement );

  vec3 pos = p;
  pos.y = 0.;

  displacement = (1. - r) * pow( displacement, .1 ) * 300.;
  pos.y += displacement;

  return vec4( pos , displacement );

}
void main(){

/*  vec3 mPos = (modelMatrix * vec4( position , 1. )).xyz;

  float displacement = 0.;

  vec2 mXZ = mPos.xz;


  

  float r = position.y;

  vec2 coralPos = coralData.xz;

  float dist = length(  coralPos - mXZ );

  displacement += pow(coralData.w,2.) *  .02 / pow( dist, 2.3);// ( dist * dist);


  displacement = min( 5. , displacement );

  vec3 pos = position;
  pos.y = 0.;

  vDisplacement = (1. - r) * pow( displacement, .1 ) * 300.;
  pos.y += vDisplacement;*/

  vec4 pos = getNewPos( position );

  vec4 pDoX = getNewPos( position + vec3( -1. , 0. , 0. ) );
  vec4 pDoZ = getNewPos( position + vec3(  0. , 0. , -1. ) );
  vec4 pUpX = getNewPos( position + vec3( 1. , 0. , 0. ) );
  vec4 pUpZ = getNewPos( position + vec3( 0. , 0. , 1. ) );

  vec3 c1 = normalize((pDoX - pUpX).xyz);
  vec3 c2 = normalize((pDoZ - pUpZ).xyz);

  vNorm = normalize( cross( c1 , c2 ) );

  

  vMPos = ( modelMatrix * vec4( pos.xyz , 1. )).xyz;
  vRadius = position.y;
  vDisplacement = pos.w;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos.xyz , 1. );



}
