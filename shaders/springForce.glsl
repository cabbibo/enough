vec3 springForce( vec3 p1 , vec3 p2 , float l ){

  vec3 dif = p1 - p2;
  float dL = l - length( dif );

  vec3 r = vec3( 0. );
   if( dL < .001 || length( dif ) < .001){

  }else{

    float s = dL / abs( dL );

    r = normalize( dif ) * abs( dL )* s;
  
  }
  return (normalize( dif ) * dL);

}


vec3 springForce( vec3 p1 , vec3 p2 , float l , float p ){

  vec3 dif = p1 - p2;

  float dL = l - length( dif );

  vec3 r = vec3( 0. );

  if( dL < .001 || length( dif ) < .001){

  }else{

    float s = dL / abs( dL );

    r = normalize( dif ) * pow( abs( dL ) , p ) * s;
  
  }

  return r;

}
