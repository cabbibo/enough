
varying vec3 vPos;
varying vec2 vUv;
varying vec3 vNorm;

void main(){


  gl_FragColor = vec4( abs(vNorm) , 1. );

}
