// TODO: Global Loki Character

var G = {};

G.pages   = {};

// Loaded objects that may be
// Used across pages
G.AUDIO   = {};
G.TEXTURE = {};
G.GEOS    = {};
G.MATS    = {};

G.audio   = new AudioController();
G.shaders = new ShaderLoader( 'shaders' );
G.leap    = new Leap.Controller();
G.gui     = new dat.GUI({});
G.loader  = new Loader();

G.loader.onStart = function(){

  this.onResize();
  this.init();
  this.animate();

  for( var i = 0; i < this.startArray.length; i++ ){

    this.startArray[i]();

  }

}.bind( G );

G.w             = window.innerWidth;
G.h             = window.innerHeight;

console.log( G.w , G.h );

G.camera        = new THREE.PerspectiveCamera( 65 , G.w / G.h , 1 , 200000 );
G.scene         = new THREE.Scene();
G.renderer      = new THREE.WebGLRenderer(); //autoclear:false

G.clock         = new THREE.Clock();

G.container     = document.getElementById('container' );


// Some Global Uniforms

G.dT      = { type:"f" , value: 0               } 
G.timer   = { type:"f" , value: 0               }
G.t_audio = { type:"t" , value: G.audio.texture }

G.paused  = false;



// Get all the fun stuff started

G.renderer.setSize( G.w , G.h );
G.container.appendChild( G.renderer.domElement );

G.leap.connect();
G.gui.close();
G.scene.add( G.camera );
//G.onResize();

// Need something to call when started
G.startArray = [];


G.init = function(){
  

  /*
  
     Leap Hands!

  */


  var rHandMesh = new THREE.Mesh( 
    new THREE.BoxGeometry( 10 , 10, 100 ),
    new THREE.MeshBasicMaterial( 0xff0000 )
  );
 
  this.rHand = new RiggedSkeleton( this.leap , {
  
    movementSize: 1000,
    handSize:     100,

  });
  
  this.rHand.addScaledMeshToAll( rHandMesh );

  this.rHand.addToScene( this.scene );
    

  var lHandMesh = new THREE.Mesh( 
    new THREE.BoxGeometry( 10 , 10, 100 ),
    new THREE.MeshBasicMaterial( 0xff0000 )
  );
 
  this.lHand = new RiggedSkeleton( this.leap , {
  
    movementSize: 1000,
    handSize:     100,

  });
  
  this.lHand.addScaledMeshToAll( rHandMesh );

  this.lHand.addToScene( this.scene );
  


  /*

     Object Controls for the entire book

  */

    
  this.objectControls = new ObjectControls( 
    this.camera , 
    this.rHand.hand , 
    this.leap  
  );



}

G.animate = function(){

  if( !this.paused ){

    this.dT.value = this.clock.getDelta();
    this.timer.value += G.dT.value;

    this.audio.update();

    this.rHand.update( 0 );
    this.lHand.update( 1 );

    for( var propt  in this.pages ){

      this.pages[ propt ].update();

    }

  }
 
  this.renderer.render( this.scene , this.camera );
  requestAnimationFrame( this.animate.bind( this ) );
  

}


G.addToStartArray = function( callback ){

  this.startArray.push( callback );

}
G.onResize = function(){

  this.w = window.innerWidth;
  this.h = window.innerHeight;
 
  this.camera.aspect = this.w / this.h ;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize( this.w , this.h );

}

G.onKeyDown = function( e ){

  //console.log( e.which );
  if( e.which == 32 ){

    this.paused = !this.paused;

  }


}



// Some Event Listeners

window.addEventListener( 'resize'   , G.onResize.bind( G )  , false );
window.addEventListener( 'keydown'  , G.onKeyDown.bind( G ) , false );

