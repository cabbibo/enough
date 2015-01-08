
  uniform mat4 textureMatrix;

  uniform float time;
  varying vec4 mirrorCoord;


  varying float vDisplacement;

  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying mat3 vNormalMat;
  varying vec3 vEye;
  

  $simplex
  $sNormal

  void main() {

    vUv = uv;
    vec3 offset = vec3( time * .04 , time * .05 , time * .03);
    vec3 noiseVec = position * .001 * (1.-uv.y * uv.y) +offset;
    vDisplacement = snoise( noiseVec );

    vec3 x = vec3( 1. , 0. , 0. );
    vec3 y = vec3( 0. , 1. , 0. );
    vec3 z = vec3( 0. , 0. , 1. );

    vNormalMat = normalMatrix;
    vNormal = sNormal( position , x , y , z , 100. * (1.-uv.y)  , .001 * (1.-uv.y * uv.y) , .1 , offset );
    vec3 pos = position + vec3( 0. , 0. ,  100. * (1.-uv.y)  ) * vDisplacement;

    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );
    mirrorCoord = textureMatrix * worldPosition;

    vPos = position;

    vEye = cameraPosition - worldPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;

  }
