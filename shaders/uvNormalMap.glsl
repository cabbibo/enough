
#extension GL_OES_standard_derivatives : enable




vec3 uvNormalMap( sampler2D normalMap , vec3 pos , vec2 uv , vec3 norm , float texScale , float normalScale ){
 
  vec3 q0 = dFdx( pos.xyz );
  vec3 q1 = dFdy( pos.xyz );
  vec2 st0 = dFdx( uv.st );
  vec2 st1 = dFdy( uv.st );

  vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
  vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  vec3 N = normalize( norm );

  //vec2 offset = vec2(  timer * .000000442 , timer * .0000005345 );

  vec3 mapN = texture2D( normalMap, uv*texScale ).xyz * 2.0 - 1.0;
  mapN.xy = normalScale * mapN.xy;
 
  mat3 tsn = mat3( S, T, N );
  vec3 fNorm =  normalize( tsn * mapN ); 

  return fNorm;

}


vec3 uvNormalMap( sampler2D normalMap , vec3 pos , vec2 uv , vec3 norm , float texScale , float normalScale , vec2 offset ){
 
  vec3 q0 = dFdx( pos.xyz );
  vec3 q1 = dFdy( pos.xyz );
  vec2 st0 = dFdx( uv.st );
  vec2 st1 = dFdy( uv.st );

  vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
  vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  vec3 N = normalize( norm );

  vec3 mapN = texture2D( normalMap, uv*texScale + offset ).xyz * 2.0 - 1.0;
  mapN.xy = normalScale * mapN.xy;
 
  mat3 tsn = mat3( S, T, N );
  vec3 fNorm =  normalize( tsn * mapN ); 

  return fNorm;

}



