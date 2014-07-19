
  uniform sampler2D t_pos;

  varying vec3 vPos;
  varying vec2 vUv;
  varying vec3 vNorm;

  const float size = 1. / 32.;
  const float hSize = size / 2.;

  void main()
  {

    vec3 pos = texture2D( t_pos , position.xy ).xyz;

    vPos = pos;
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

    vNorm = normalize( cross( difX , difY ) );

   // vNorm = normalize(difX);
   // vNorm = vec3( vUv.x , vUv.y , 1.0 );



    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );
    

  }
