var loadBarShader = {

  vs:`


    uniform mat4 iModelMat;

    attribute vec3 tangent;
    attribute float faceType;

    // TODO: can we compute this in cpu?
    varying mat3 vINormMat;

    varying vec3 vNorm;
    varying vec3 vTang;
    varying vec3 vBino;
    varying vec2 vUv;

    varying vec3 vEye;
    varying vec3 vMPos;
    varying vec3 vPos;

    varying float vFaceType;

    mat3 matInverse( mat3 m ){
    
  
    vec3 a = vec3(
      
        m[1][1] * m[2][2] - m[2][1] * m[1][2],
        m[0][2] * m[2][1] - m[2][2] * m[0][1],
        m[0][1] * m[1][2] - m[1][1] * m[0][2]
        
    );
    
    vec3 b = vec3(
      
        m[1][2] * m[2][0] - m[2][2] * m[1][0],
        m[0][0] * m[2][2] - m[2][0] * m[0][2],
        m[0][2] * m[1][0] - m[1][2] * m[0][0]
        
    );
    
     vec3 c = vec3(
      
        m[1][0] * m[2][1] - m[2][0] * m[1][1],
        m[0][1] * m[2][0] - m[2][1] * m[0][0],
        m[0][0] * m[1][1] - m[1][0] * m[0][1]
        
    );
    
    
    return mat3( 
        
       a.x , a.y , a.z ,
       b.x , b.y , b.z ,
       c.x , c.y , c.z
        
    );
    
 
  
    
}


    void main(){

      vFaceType = faceType;

      vec3 pos = position;
      vUv = uv;
      vNorm = normalMatrix * normal;
      
      vMPos = ( modelMatrix * vec4( pos , 1. ) ).xyz;
      //vMPos = pos.xyz;

      vNorm = normal;
      vTang = tangent;

      vBino = cross( vNorm , vTang );

      mat3 normMat = mat3(
        vNorm.x , vNorm.y , vNorm.z ,
        vTang.x , vTang.y , vTang.z ,
        vBino.x , vBino.y , vBino.z 
      );

      //normMat = normalMatrix * normMat;
      vINormMat = matInverse( normMat );

      vec3 iCamPos = ( iModelMat * vec4( cameraPosition , 1. ) ).xyz;
      vEye = iCamPos - pos;
      vPos = pos;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );


    }

  `,

  fs:`

  vec3 hsv(float h, float s, float v){
  return mix( vec3( 1.0 ), clamp( ( abs( fract(
    h + vec3( 3.0, 2.0, 1.0 ) / 3.0 ) * 6.0 - 3.0 ) - 1.0 ), 0.0, 1.0 ), s ) * v;
  }


  // Taken from https://www.shadertoy.com/view/4ts3z2
  float tri(in float x){return abs(fract(x)-.5);}
  vec3 tri3(in vec3 p){return vec3( tri(p.z+tri(p.y*1.)), tri(p.z+tri(p.x*1.)), tri(p.y+tri(p.x*1.)));}
                                   

  // Taken from https://www.shadertoy.com/view/4ts3z2
  float triNoise3D(in vec3 p, in float spd , in float time){
    
    float z=1.4;
    float rz = 0.;
    vec3 bp = p;

    for (float i=0.; i<=3.; i++ ){
     
      vec3 dg = tri3(bp*2.);
      p += (dg+time*.1*spd);

      bp *= 1.8;
      z *= 1.5;
      p *= 1.2; 
        
      rz+= (tri(p.z+tri(p.x+tri(p.y))))/z;
      bp += 0.14;

    }

    return rz;

  }

uniform float stepDepth;
uniform float oscillationSize;
uniform float time;
uniform float brightness;
uniform float noiseSize;
uniform float transparency;
uniform vec3 lightPos;


varying float vFaceType;

varying vec3 vNorm;

varying vec2 vUv;

varying vec3 vEye;
varying vec3 vMPos;
varying vec3 vPos;

varying mat3 vINormMat;

#define STEPS 2
vec4 volumeColor( vec3 ro , vec3 rd  , mat3 iBasis){

  vec3 col = vec3( 0. );
  float lum = 0.;
  for( int i = 0; i < STEPS; i++ ){

    vec3 p = ro - rd * float( i ) * stepDepth*5.;
    
    lum += pow(triNoise3D( p * .002 * noiseSize , float( i ) / float( STEPS ), time * .01),.3);//lu / 5.;

    col += hsv( lum * 2. + sin( time * .1 ) , .4 , .4 );

  } 

  return vec4( col , lum ) / float( STEPS );


}

void main(){


  vec3 col =vec3(1.);// vTang * .5 + .5;
  float alpha = 1.;

  vec3 lightDir = normalize( lightPos - vMPos );
  vec3 reflDir = reflect( lightDir , vNorm );
  
  float lambMatch =  -dot(lightDir ,  vNorm );
  float reflMatch = max( 0. , -dot(normalize(reflDir) ,  normalize(vEye)) );

  reflMatch = pow( reflMatch , 2. );

  vec4 volCol = volumeColor( vPos , normalize(vEye) , vINormMat );

  vec3 lambCol = lambMatch * volCol.xyz;
  vec3 reflCol = reflMatch * (vec3(1.) - volCol.xyz);

  col = volCol.xyz;// * lambMatch  + vec3(1. ) * (1.-lambMatch ) ;

  float size = .04;
  if( vUv.y > 1. - size  ){
    col *= 2.;// lambCol * 3.;
  }

  gl_FragColor = vec4(  col *2. * brightness ,  transparency  );

}


  `,

  vsRing:`


    uniform mat4 iModelMat;

    attribute vec3 tangent;
    attribute float faceType;
    attribute float id;

    // TODO: can we compute this in cpu?
    varying mat3 vINormMat;

    varying vec3 vNorm;
    varying vec3 vTang;
    varying vec3 vBino;
    varying vec2 vUv;

    varying vec3 vEye;
    varying vec3 vMPos;
    varying vec3 vPos;

    varying float vType;
    varying float vID;

    mat3 matInverse( mat3 m ){
    
  
    vec3 a = vec3(
      
        m[1][1] * m[2][2] - m[2][1] * m[1][2],
        m[0][2] * m[2][1] - m[2][2] * m[0][1],
        m[0][1] * m[1][2] - m[1][1] * m[0][2]
        
    );
    
    vec3 b = vec3(
      
        m[1][2] * m[2][0] - m[2][2] * m[1][0],
        m[0][0] * m[2][2] - m[2][0] * m[0][2],
        m[0][2] * m[1][0] - m[1][2] * m[0][0]
        
    );
    
     vec3 c = vec3(
      
        m[1][0] * m[2][1] - m[2][0] * m[1][1],
        m[0][1] * m[2][0] - m[2][1] * m[0][0],
        m[0][0] * m[1][1] - m[1][0] * m[0][1]
        
    );
    
    
    return mat3( 
        
       a.x , a.y , a.z ,
       b.x , b.y , b.z ,
       c.x , c.y , c.z
        
    );
    
 
  
    
}


    void main(){

      vType = faceType;

      vec3 pos = position;
      vUv = uv;
      vNorm = normalMatrix * normal;
      
      vMPos = ( modelMatrix * vec4( pos , 1. ) ).xyz;
      //vMPos = pos.xyz;

      vNorm = normal;
      vTang = tangent;

      vBino = cross( vNorm , vTang );

      mat3 normMat = mat3(
        vNorm.x , vNorm.y , vNorm.z ,
        vTang.x , vTang.y , vTang.z ,
        vBino.x , vBino.y , vBino.z 
      );

      //normMat = normalMatrix * normMat;
      vINormMat = matInverse( normMat );
      vID = id;

      vec3 iCamPos = ( iModelMat * vec4( cameraPosition , 1. ) ).xyz;
      vEye = iCamPos - pos;
      vPos = pos;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );


    }

  `,
  fsRing:`

   vec3 hsv(float h, float s, float v){
  return mix( vec3( 1.0 ), clamp( ( abs( fract(
    h + vec3( 3.0, 2.0, 1.0 ) / 3.0 ) * 6.0 - 3.0 ) - 1.0 ), 0.0, 1.0 ), s ) * v;
  }


  // Taken from https://www.shadertoy.com/view/4ts3z2
  float tri(in float x){return abs(fract(x)-.5);}
  vec3 tri3(in vec3 p){return vec3( tri(p.z+tri(p.y*1.)), tri(p.z+tri(p.x*1.)), tri(p.y+tri(p.x*1.)));}
                                   

  // Taken from https://www.shadertoy.com/view/4ts3z2
  float triNoise3D(in vec3 p, in float spd , in float time){
    
    float z=1.4;
    float rz = 0.;
    vec3 bp = p;

    for (float i=0.; i<=3.; i++ ){
     
      vec3 dg = tri3(bp*2.);
      p += (dg+time*.1*spd);

      bp *= 1.8;
      z *= 1.5;
      p *= 1.2; 
        
      rz+= (tri(p.z+tri(p.x+tri(p.y))))/z;
      bp += 0.14;

    }

    return rz;

  }

uniform float stepDepth;
uniform float oscillationSize;
uniform float time;
uniform float brightness;
uniform float noiseSize;
uniform vec3 lightPos;
uniform float percentLoaded;
uniform float transparency;

varying float vType;
varying float vID;

varying vec3 vNorm;

varying vec2 vUv;

varying vec3 vEye;
varying vec3 vMPos;
varying vec3 vPos;



varying mat3 vINormMat;

#define STEPS 2
vec4 volumeColor( vec3 ro , vec3 rd  , mat3 iBasis){

  vec3 col = vec3( 0. );
  float lum = 0.;
  for( int i = 0; i < STEPS; i++ ){

    vec3 p = ro - rd * float( i ) * stepDepth*5.;
    
    lum += pow(triNoise3D( p * .002 * noiseSize , float( i ) / float( STEPS ), time * .01),.3);//lu / 5.;

    col +=  hsv( lum * 2. + sin( time * .1 ) ,  .4  , .5 );

  } 

  return vec4( col , lum ) / float( STEPS );


}


void main(){


  vec3 col =vec3(1.);// vTang * .5 + .5;
  float alpha = 1.;

  vec3 lightDir = normalize( lightPos - vMPos );
  vec3 reflDir = reflect( lightDir , vNorm );
  
  float lambMatch =  -dot(lightDir ,  vNorm );
  float reflMatch = max( 0. , -dot(normalize(reflDir) ,  normalize(vEye)) );

  reflMatch = pow( reflMatch , 2. );

  vec4 volCol = volumeColor( vPos , normalize(vEye) , vINormMat );

  vec3 lambCol = lambMatch * volCol.xyz;
  vec3 reflCol = reflMatch * (vec3(1.) - volCol.xyz);

  col = volCol.xyz;// * lambMatch  + vec3(1. ) * (1.-lambMatch ) ;

  float size = .04;
  if( vUv.y > 1. - size  ){
    col *= 2.;// lambCol * 3.;
  }

  if( vType > 0.5){
    col *= sin( (( vID /80.) * 6. * 3.14195  )+ time * percentLoaded * 5.);
  }else{
    if( vUv.x < .1 || vUv.x > .9 || vUv.y < .2 || vUv.y > .8 ){
    }else{
      if( percentLoaded - .01 < vID / 40. ){
        col = vec3( 0. );
      }
    }
  }


  gl_FragColor = vec4(  col *2. * brightness , transparency  );

}


  `


}