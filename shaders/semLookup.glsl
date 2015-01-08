// Taken from : http://www.clicktorelease.com/blog/creating-spherical-environment-mapping-shader

vec2 semLookup( vec3 pos , vec3 norm , mat4 mvMat , mat3 nMat ){
  
  vec4 p = vec4( pos, 1. );

  vec3 e = normalize( vec3( mvMat * p ) );
  vec3 n = normalize( nMat * norm );

  vec3 r = reflect( e, n );
  float m = 2. * sqrt( 
      pow( r.x, 2. ) + 
      pow( r.y, 2. ) + 
      pow( r.z + 1., 2. ) 
  );

  return ( r.xy / m + .5 );

}

vec2 semLookup( vec3 e , vec3 n ){
  
  vec3 r = reflect( e, n );
  float m = 2. * sqrt( 
      pow( r.x, 2. ) + 
      pow( r.y, 2. ) + 
      pow( r.z + 1., 2. ) 
  );

  return ( r.xy / m + .5 );

}
