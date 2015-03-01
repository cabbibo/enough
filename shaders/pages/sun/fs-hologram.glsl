uniform float stepDepth;
uniform float oscillationSize;
uniform float time;
uniform float brightness;
uniform vec3 lightPos;
uniform sampler2D t_audio;

varying float vFaceType;

varying vec3 vNorm;

varying vec2 vUv;

varying vec3 vEye;
varying vec3 vMPos;
varying vec3 vPos;

varying mat3 vINormMat;

$hsv
$triNoise3D

#define STEPS 10
vec4 volumeColor( vec3 ro , vec3 rd  , mat3 iBasis){

  vec3 col = vec3( 0. );
  float lum = 0.;
  for( int i = 0; i < STEPS; i++ ){

    vec3 p = ro - rd * float( i ) * stepDepth;
   
    /*p = iBasis * p;
    float lu = abs(sin( p.y * oscillationSize ) +sin( p.z * oscillationSize ))/2.; 
    vec4 aCol = texture2D( t_audio , vec2( lu , 0.));

    lum += lu / 5.;
    col += aCol.xyz * hsv( p.x * 3. + lum / 20., 1. , 1. );*/

    //p = iBasis * p;

    //lum += abs(sin( p.x * oscillationSize ) +sin( p.y * oscillationSize ))/2.; 
    lum += pow(triNoise3D( p * .002, float( i ) / float( STEPS ), time),.3);//lu / 5.;
    vec4 aCol = texture2D( t_audio , vec2( abs( sin(lum)) , 0.));

    //col +=  aCol.xyz * hsv( lum * 4. + sin( time * .1 ) , 1. , 1. );
    col +=  aCol.xyz * hsv( lum * .4 + sin( time * .1 ) , 1. , 1. );
   // col +=  hsv(lum / 20., 1. , 1. );



  } 

  return vec4( col , lum ) / float( STEPS );


}

void main(){


  vec3 col =vec3(1.);// vTang * .5 + .5;
  float alpha = 1.;

  vec3 lightDir = normalize( lightPos - vMPos );
  vec3 reflDir = reflect( lightDir , vNorm );
  
  float lambMatch = max( 0. , -dot(lightDir ,  vNorm ) );
  float reflMatch = max( 0. , -dot(normalize(reflDir) ,  normalize(vEye)) );

  reflMatch = pow( reflMatch , 2. );

  vec4 volCol = volumeColor( vPos , normalize(vEye) , vINormMat );

  vec3 lambCol = lambMatch * volCol.xyz;
  vec3 reflCol = reflMatch * (vec3(1.) - volCol.xyz);

  //vec4 aCol = texture2D( t_audio , vec2( reflMatch , 0.));

  col = volCol.xyz;// * lambMatch  + vec3(1. ) * (1.-lambMatch ) ;

  float size = .04;
  if( vUv.x < size || vUv.x > 1. - size || vUv.y < size || vUv.y > 1. - size ){
    col = lambCol * 3.;
  }

  //if(abs( vFaceType -2.)< .01 ){ alpha = 1.; }
 
  //col = vec3( vUv.x , .3 , vUv.y ) * .5; 
  gl_FragColor =  vec4( col *2. * brightness , volCol.w  * brightness  );

  //gl_FragColor = vec4( normalize( lightDir ) * .5 + .5 , 1. );

  //gl_FragColor = vec4( normalize( vEye ) * .5 + .5 , 1. );
  //gl_FragColor = vec4( vTang , 1. ); 

}
