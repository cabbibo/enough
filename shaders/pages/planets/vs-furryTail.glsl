uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_ooPos;


uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

attribute vec3 color;

varying vec3 vPos;
varying vec3 vVel;
varying vec3 vColor;
varying vec3 vNorm;

varying vec3 vView;
varying vec3 vLightDir;


varying float vC;

const vec3 lightPos = vec3( 1.0 , 1.0 , 1.0 );


void main(){

  vec4 pos    =  texture2D( t_pos , position.xy );
  vec4 oPos   =  texture2D( t_oPos , position.xy );
  vec4 ooPos  =  texture2D( t_ooPos , position.xy );

  vec3 oDir1 = normalize( oPos.xyz - pos.xyz    );
  vec3 oDir2 = normalize( oPos.xyz - ooPos.xyz  );

  vec3 aveDir = (oDir1 - oDir2) /2.;
  vNorm = -normalize(aveDir);

  vec3 vel = pos.xyz - oPos.xyz;
  vVel = vel;
  vPos = pos.xyz;


  if( color.g < .1 ){
  
    vColor = color1;//color1.xyz;

  }else if( color.g < 1.1 ){
    vColor = color2;
  }else if( color.g < 2.1 ){
   vColor = color3;
  }else if( color.g < 3.1 ){
    vColor = color4;
  }  
  vC = position.z;

  vView = modelViewMatrix[3].xyz;

  vec3 lightDir = normalize( lightPos -  (modelViewMatrix * vec4( vPos , 1.0 )).xyz );
  vLightDir = lightDir;

  //vPos = position;
  vec4 mvPos = modelViewMatrix * vec4( vPos , 1.0 );
  gl_Position = projectionMatrix * mvPos;
  


}
