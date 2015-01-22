const int numOfCoral = @SIZE;

uniform vec4 coralData[numOfCoral];
uniform vec3 coral[numOfCoral];
varying float vDisplacement;

varying vec3 vMPos;
void main(){

  vec3 mPos = (modelMatrix * vec4( position , 1. )).xyz;

  float displacement = 0.;

  vec2 mXZ = mPos.xz;
  for( int i = 0; i < numOfCoral; i++ ){

    vec2 coralPos = coralData[i].xz;

    float dist = length(  coralPos - mXZ );

    displacement += pow(coralData[i].w,2.) *  .02 / pow( dist, 1.3);// ( dist * dist);


  }

  displacement = min( 200. , displacement );

  vec3 pos = position;
  pos.z += pow( displacement, .1 ) * 300.;

  vMPos = ( modelMatrix * vec4( pos , 1. )).xyz;

  vDisplacement = displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );



}
