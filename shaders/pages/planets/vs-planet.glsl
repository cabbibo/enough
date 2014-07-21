
uniform vec3 lightPos;
uniform float time;


varying vec3 vPos;
varying vec3 vNorm;
varying vec3 vView;

varying mat3 vNormalMat;
varying vec3 vLightDir;
varying float vDisplacement;

$simplex


vec3 toSpherical( vec3 pos ){

  float r = length( pos );
  float t = atan( pos.y / pos.x );
  float p = acos( pos.z / r );

  return vec3( r , t , p );

}

vec3 toCart( vec3 rtp ){

  float x = rtp.x * cos( rtp.y ) * sin( rtp.z );
  float y = rtp.x * sin( rtp.y ) * sin( rtp.z );
  float z = rtp.x * cos( rtp.z );

  return vec3( x , y , z );

}

vec3 displace( vec3 p , vec3 o ){

  float noise = snoise( normalize(p) * 2. + o );
 
  vec3 nP = p * (1. + noise * .1 );

  return nP;


}

void main(){

  vPos  = position;
  vNorm = normal;

  vView = modelViewMatrix[3].xyz;


 // vNorm = normalMatrix *  normal ;
  vNormalMat = normalMatrix;

  vec3 offset = vec3( time * .1 , time * .13 , time * .15 );
  vDisplacement = snoise( normalize(vPos) * 2. + offset );


  vec3 rtpMain = toSpherical( vPos );

  vec3 upT = toCart( rtpMain + vec3( 0. ,  .01 , .0 ) );
  vec3 doT = toCart( rtpMain + vec3( 0. , -.01 , .0 ) );
  vec3 upP = toCart( rtpMain + vec3( 0. , 0. ,  .01 ) );
  vec3 doP = toCart( rtpMain + vec3( 0. , 0. , -.01 ) );
 
  vec3 fUpT = displace( upT , offset );
  vec3 fDoT = displace( doT , offset );
  vec3 fUpP = displace( upP , offset );
  vec3 fDoP = displace( doP , offset );

  vec3 difT = normalize( fUpT - fDoT );
  vec3 difP = normalize( fUpP - fDoP );

  
  vNorm = normalize( cross( difP , difT ));
  
 // vNorm = abs( vNorm );  
  vec3 lightDir = normalize( lightPos -  (modelViewMatrix * vec4( vPos , 1.0 )).xyz );
  vLightDir = lightDir;

  vDisplacement = snoise( normalize(vPos) * 2. + offset );
  vPos *= 1. + vDisplacement *.1;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );

}
