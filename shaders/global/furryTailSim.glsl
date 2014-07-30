
uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_audio;

uniform vec3 flow;

uniform float dT;

uniform float audioPower;
uniform float audioAmount;

uniform vec3 leader;

// Spine
uniform float dist_spineAttract;         // 1.1;
uniform float force_spineAttract;        // 1.;

// SpineBundle
uniform float dist_bundleAttract;   // .1;
uniform float dist_bundleRepel;     // .4;

uniform float force_bundleAttract;  // .1;
uniform float force_bundleRepel;    // .4;


// Sub
uniform float dist_subAttract;          //5.1
uniform float dist_subRepel;            //5.1

uniform float force_subAttract;         //1
uniform float force_subRepel;           //.1


// Sub Sub
uniform float dist_subSubAttract;       //1.1
uniform float dist_subSubRepel;         //.1

uniform float force_subSubAttract;      //1
uniform float force_subSubRepel;        //1

varying vec2 vUv;


const float size = 1. / 32.;
const float hSize = size / 2.;

const float maxVel = 150.;

vec3 springForce( vec3 toPos , vec3 fromPos , float staticLength ){

  vec3 dif = fromPos - toPos;
  vec3 nDif = normalize( dif );
  vec3 balance = nDif * staticLength;

  vec3 springDif = balance - dif;

  return 10000. * springDif;

}

$simplex

void main(){


  // Making sure the tails don't go outside the heads
  float f_dist_spineAttract   = dist_spineAttract   ;
  float f_dist_subSubAttract  = dist_subSubAttract  * vUv.y;
  float f_dist_subSubRepel    = dist_subSubRepel    * vUv.y;
  float f_dist_subAttract     = dist_subAttract     * vUv.y;
  float f_dist_subRepel       = dist_subRepel       * vUv.y;
  float f_dist_bundleAttract  = dist_bundleAttract  * vUv.y;
  float f_dist_bundleRepel    = dist_bundleRepel    * vUv.y;

  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos , vUv );

  float life = pos.w;
  life -= .1;

  // Get our velocity
  vec3 vel = oPos.xyz - pos.xyz;

  vec3  force = vec3(0.);
  
  vec4 audioForce = texture2D( t_audio , vec2( vUv.y , 0.0 ) );
  vec2 aL , aL3;
  aL.y = length( audioForce);
  aL3.y = aL.y * aL.y * aL.y;

  float aF = min( pow( aL.y , audioPower ) , 4.0);
  aF *= audioAmount;
  aF += ( 1. - audioAmount );

  audioForce = texture2D( t_audio , vec2( vUv.x , 0.0 ) );
  aL.x = length( audioForce );
  aL3.x = aL.x * aL.x * aL.x;

  // Waveyness
  // ( as object moves through simplex noise field, will look different )
  // TODO
 // float w = 1. + snoise( pos * .01 );

  float mIx = floor( (vUv.x -hSize ) / size );
  float mIy = floor( (vUv.y -hSize) / size );

  // Main Index
  vec2 mI = vec2( mIx , mIy );

  // If we are in the first column ( spine )
  if( mI.x < 1.){


    // If we are the upper most spine
    // We are connected to the leader
    if( mI.y < 1.){

      vec3 attract = springForce( leader.xyz , pos.xyz , f_dist_spineAttract );
      force += attract * force_spineAttract;

    
    // Every other vertabrae in the spine
    // Gets attracted to the one above it
    }else{

      vec4 otherPos = texture2D( t_pos , vec2( vUv.x , vUv.y - size ) ); 
      
      vec3 attract = springForce( otherPos.xyz , pos.xyz , f_dist_spineAttract );
      force += attract * force_spineAttract;

      force += flow * ( 1. -  vUv.y);

    }


  // The 'sub' objects
  }else{

    // first level
    if( mI.x < 5. ){

      vec4 otherPos = texture2D( t_pos , vec2( hSize , vUv.y ) );
 
      // Attract to the column
      vec3 attract = springForce( otherPos.xyz , pos.xyz , f_dist_subAttract * aF );
      force += attract * force_subAttract;

      // Get the 'index' of this verta 
      // in the 4 first level sub objects
      int index = int( (vUv.x - hSize ) / size );

 

      // Loop through all the other objects in this level
      for( int i = 0; i < 4; i++ ){

        // As long as we are not looking at ourself,
        // repel the other ones
        if( (i - index) != 0 ){

          float lookup = (float(i) * size) -  hSize;

          vec4 otherPos = texture2D( t_pos , vec2( lookup , vUv.y ) );

          vec3 attract = springForce(  pos.xyz , otherPos.xyz , f_dist_subRepel * aF );

          force -= attract * force_subRepel;  
        
        }
      }


    // The 'Sub Sub' objects
    }else if( mI.x < 21. ){


      // Which chunk

      int index = int( ( vUv.x - (5.* size) ) / size );

      float chunk = floor( float( index / 4) );

      float lookup = (chunk * size) + size;

      vec4 otherPos = texture2D( t_pos , vec2( lookup , vUv.y ) );

      vec3 attract = springForce( otherPos.xyz , pos.xyz , f_dist_subSubAttract * aF  );

      force += attract * force_subSubAttract;

      int indexInChunk = index - int( chunk * 4. );

      for( int i = 0; i < 4; i++ ){

        if( (i - indexInChunk) != 0 ){

          float lookup = (float(i) * size) + (size*4. + hSize) + (chunk * 4. * size);

          vec4 otherPos = texture2D( t_pos , vec2( lookup , vUv.y ) );

          vec3 attract = springForce( pos.xyz , otherPos.xyz  , f_dist_subSubRepel * aF  );

          force -= attract * force_subSubRepel;           
        }

      }


     
    // Bundle around spine
    }else{


       vec4 otherPos = texture2D( t_pos , vec2( hSize , vUv.y ) );


      vec3 attract = springForce( otherPos.xyz , pos.xyz , f_dist_bundleAttract * aF  );

      force +=  attract * force_bundleAttract;

      int index = int( ( vUv.x - (21.* size) ) / size );
      

      for( int i = 0; i < 11; i++ ){

        if( i-index != 0 ){

          float lookup = ( float(i) * size ) + ( size * 21. + hSize );

          vec4 otherPos = texture2D( t_pos , vec2( lookup , vUv.y ) );

          vec3 attract = springForce( pos.xyz , otherPos.xyz  , f_dist_bundleRepel * aF  );

          force -= attract * force_bundleRepel;  

        }

      }

    }

  }

  /*vec3 dampeningForce = vel * -.1;
  
  force += dampeningForce;*/
 

  vel += force * dT;

  if( length( vel ) > maxVel ){

    vel = normalize( vel ) * maxVel;

  }

  //vel *= .7;

  vec3 p = pos.xyz + vel * dT ; 

  if( dT < .5 ){
  
    gl_FragColor = vec4( p , life );

  }else{

   gl_FragColor = vec4( pos.xyz , life );

  }



}
