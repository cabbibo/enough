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
