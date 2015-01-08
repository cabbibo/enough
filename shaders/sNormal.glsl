vec3 sNormal( vec3 p , vec3 x , vec3 y , vec3 z , float depth , float noiseSize , float sampleSize , vec3 offset ){

  vec3 upX = p + x * sampleSize;
  vec3 doX = p - x * sampleSize;
  vec3 upY = p + y * sampleSize;
  vec3 doY = p - y * sampleSize;

  vec3 uX = upX + snoise( upX * noiseSize + offset ) * depth * z; 
  vec3 uY = upY + snoise( upY * noiseSize + offset ) * depth * z; 
  vec3 dX = doX + snoise( doX * noiseSize + offset ) * depth * z; 
  vec3 dY = doY + snoise( doY * noiseSize + offset ) * depth * z; 

  vec3 difX = normalize(uX - dX);
  vec3 difY = normalize(uY - dY);

  vec3 n = normalize( cross( difX , difY ) );
  return n;

}
