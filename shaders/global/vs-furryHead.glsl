
  uniform vec3 lightPos;
  uniform sampler2D t_pos;

  varying vec3 vView;
  varying vec3 vNormal;
  varying vec2 vUv;

  varying mat3 vNormalMat;
  varying vec3 vLightDir;

  const float size = 1. / 32.;
  const float hSize = size / 2.;


    
  void main(void)
  {


    vec3 pos = texture2D( t_pos , position.xy ).xyz;

    vUv = position.xy;
    
    vec2 uvL = vUv;
    uvL.x -= size;
    if( uvL.x < 0. ){
        uvL.x = 1. - hSize;
    }
    vec4 posL = texture2D( t_pos , uvL ); 

    vec2 uvR = vUv;
    uvR.x += size;

    if( uvR.x > 1. ){
        uvR.x = 0. + hSize;
    }
    vec4 posR = texture2D( t_pos , uvR ); 
     
    
    vec2 uvU = vUv;
    uvU.y -= size;
    if( uvU.y < 0. ){
        uvU.y = vUv.y;
    }
    vec4 posU = texture2D( t_pos , uvU ); 

    vec2 uvD = vUv;
    uvD.y += size;

    if( uvD.y > 1. ){
        uvD.y = vUv.y;
    }
    vec4 posD = texture2D( t_pos , uvD ); 


    vec3 difX = posL.xyz - posR.xyz;
    vec3 difY = posD.xyz - posU.xyz;

    vec3 normal = normalize( cross( difX , difY ) );
    

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1.0 );
    
    vView = modelViewMatrix[3].xyz;
    vNormal = normalMatrix *  normal ;
    vNormalMat = normalMatrix;

    vec3 lightDir = normalize( lightPos -  (modelViewMatrix * vec4( pos , 1.0 )).xyz );

    vLightDir = lightDir;
    
  }
