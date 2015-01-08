
uniform vec3 lightPos;
uniform float time;
uniform sampler2D t_audio;
uniform vec3 vVel;

varying vec2 vUv;

varying vec3 vPos;
varying vec3 vNorm;
varying vec3 vView;


varying mat3 vNormalMat;
varying vec3 vLightDir;
varying float vDisplacement;
varying float vMatch;

varying vec3 vMVPos;

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
  vNormalMat = normalMatrix;

  vUv = uv; 
  vNorm = normal;//normalize( cross( difP , difT ));
  

 // vec3 flow = sin( time ) * vec3( 0. , 1. , 0. );

  float match = dot( normalize( vView ), vNorm );

  //vec4 aPower = texture2D( t_audio , vec2( abs( match ) , 0. ) );
  vec4 aPower = texture2D( t_audio , vec2( match , 0. ) );

  //vPos *= length( aPower )/4.;

  //vPos *= match *match;


  vDisplacement = length( aPower )/4.;
  vMatch = match;

 // vNorm *= aPower.xyz;

  //vPos += flow * vPos.x; //.3 *  normal * radial * texture2D( t_audio ,vec2( abs(normal.x) , 0. ) ).x ;

  vMVPos = (modelViewMatrix * vec4( vPos , 1.0 )).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );

}
