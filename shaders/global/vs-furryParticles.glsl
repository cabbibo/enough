uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_ooPos;
uniform sampler2D t_audio;

uniform float dpr;
uniform float particleSize;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

varying vec3 vColor;

varying vec2 vUv;

const float size = 1. / 32.;
const float hSize = size / 2.;
const vec3 lightPos = vec3( 1.0 , 1.0 , 1.0 );

void main(){

  vUv = position.xy;

  vec4 pos    =  texture2D( t_pos , position.xy );
  vec4 oPos   =  texture2D( t_oPos , position.xy );
  vec4 ooPos  =  texture2D( t_ooPos , position.xy );

  vec4 mvPos = modelViewMatrix * vec4( pos.xyz , 1.0 );

  float mIx = floor( (vUv.x + hSize ) / size );
  float mIy = floor( (vUv.y + hSize) / size );

  // Main Index
  vec2 mI = vec2( mIx , mIy );

  vec3 oDir1 = normalize( oPos.xyz - pos.xyz    );
  vec3 oDir2 = normalize( oPos.xyz - ooPos.xyz  );

  vec3 aveDir = (oDir1 - oDir2) /2.;
  vec3 vNorm = -normalize(aveDir);

  vec3 vView = modelViewMatrix[3].xyz;
  
  vec3 lightDir = normalize( lightPos -  (modelViewMatrix * vec4( pos.xyz , 1.0 )).xyz );


  gl_PointSize =  particleSize * vUv.y * 2. * 1000. / length( mvPos.xyz );

  if( mI.x < 1. ){
    gl_PointSize *= 3.;
  }else{
    if( vUv.x < size * 5. - hSize ){
      gl_PointSize *=  2. ;   
    }else{
      gl_PointSize *= 1.;
    }
  }

  gl_PointSize *= dpr;

  vec3 c;

  if( mI.x < size ){
    c = color1;
  }else{

    if( vUv.x < size * 5. + hSize ){
      c = color2;    
    }else if( vUv.x < size * 20. + hSize ) {
      c = color3;    
    }else{
      c = color4;    
    }

  }

  vColor = c;

  vec3 nReflection = normalize( reflect( vView , vNorm )); 

  float nViewDot = dot( normalize( vNorm ), normalize( vView ) );
  float iNViewDot = 1.0 - max( nViewDot  , 0.0);
  
  vec3 refl = reflect( lightDir , vNorm );
  float facingRatio = abs( dot(  vNorm , refl) );

  vec4 aColor = texture2D( t_audio , vec2( iNViewDot * facingRatio , 0.0));

  vColor += ((aColor.xyz * aColor.xyz * aColor.xyz) - .2) * 1.4;

  gl_PointSize = min( gl_PointSize , 50. );
  gl_Position = projectionMatrix * mvPos;

}
