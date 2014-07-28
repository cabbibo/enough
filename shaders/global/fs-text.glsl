uniform vec3 color;
uniform sampler2D t_text;
uniform float opacity; 

varying vec4 vTextCoord;
varying vec2 vTextOffset;
varying vec4 vLookup;
varying vec3 vPos;

uniform float textureSize;
uniform float glyphWidth;
uniform float glyphHeight;
uniform float glyphBelow;


const vec2 textSize = vec2( 16. / 512. , 16./256.);
const float smoothing = 1. / 4.0;


void main(){

  float totalSize = glyphHeight;

  float widthOffset = (glyphHeight - glyphWidth)/2.;
  float wOPercent = widthOffset / totalSize;


  float belowP = glyphBelow / totalSize;

  float wO = (glyphHeight - glyphWidth)/2.;


  float wh = glyphWidth / glyphHeight;


  float blah = vPos.x;


  float x = vTextCoord.x;
  float y = vTextCoord.y;
  float w = vTextCoord.z;
  float h = vTextCoord.w;

  float xO = vTextOffset.x;
  float yO = vTextOffset.y;

  float xP = xO / totalSize; 
  float yP = yO / totalSize;

  float wP = w / totalSize;
  float hP = h / totalSize;

  float xGL = gl_PointCoord.x;
  float yGL = gl_PointCoord.y;

  float xOG = xGL - xP;
  float yOG = yGL - yP;

  float xF = x - xO - widthOffset + gl_PointCoord.x *totalSize; //(wP + xP)*w; //* w * .1;
  float yF = y + yO + glyphBelow - (1.-gl_PointCoord.y)* totalSize; 


 /* if(gl_PointCoord.x < xP ){
    discard;
  }
  if(gl_PointCoord.y < yP ){
    discard;
  }*/
  //xF = x + gl_PointCoord.x * .1;
  //yF = y + gl_PointCoord.y * .1;

  vec2 sCoord =  vec2( xF , yF );

  float distance = texture2D(t_text , sCoord ).a;
  float lum = smoothstep( 0.5 - smoothing , 0.5 + smoothing , distance );
  float alpha = lum; //1. - lum;

  float simplex = vLookup.w; //abs(vLookup.w);
  //float mult = .1 + simplex * 3.7;
  float mult = .7 + simplex * .02;
  gl_FragColor = vec4( vec3( 1. , 1. , 1. )*mult, alpha * opacity );


  if( gl_PointCoord.x < xP + wOPercent ){
    alpha = 0.; //discard;
  }


  if( gl_PointCoord.x > xP + wP + wOPercent){
    alpha = 0.; //discard;
  }

  if( (1.-gl_PointCoord.y) > yP + belowP  ){
    alpha = 0.; //discard;
  }

  float lowerBound = (yO - h + glyphBelow)/totalSize;
  
  if( (1.-gl_PointCoord.y) < lowerBound  ){
    alpha = 0.; //discard;
  }


  float r = abs( cos( simplex * 1. ));
  float g = abs( cos( simplex * 2. ));
  float b = abs( sin( simplex * 1. ));
  vec3 red  = vec3( r , g , b);
  vec3 blue = vec3( 0. , -.2 , .4 ) * gl_PointCoord.y;
   gl_FragColor = vec4(vec3( 1.)*mult , alpha * opacity );

/*
  
  vec3 red = vec3( 1. , 0. , 0. ) * alpha;
  vec3 blue = vec3( 1. , 1. , 1. ) *( 1.-alpha);
  gl_FragColor = vec4( red + blue*.3 , 1. );*/

 // gl_FragColor = vec4( 1.0 );

}
