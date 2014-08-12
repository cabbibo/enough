// TODO: Global Loki Character

var G = {};

G.texturesToLoad = [
 
  ['ubuntuMono' , 'img/extras/ubuntuMono.png'],
  
  ['iri_red'    , 'img/iri/red.png'],
  ['iri_gold'   , 'img/iri/gold.png'],
  ['iri_blue'   , 'img/iri/blue.png'],

  ['norm_moss'  , 'img/normals/moss_normal_map.jpg' ],

  ['sprite_flare'   , 'img/sprite/flare.png'],
  ['sprite_cabbibo'   , 'img/sprite/cabbibo.png'],

  ['logo'       , 'img/icons/cabbibo.png' ],

]

G.pages   = {};

// Loaded objects that may be
// Used across pages
G.AUDIO     = {};
G.TEXTURES  = {};
G.GEOS      = {};
G.MATS      = {};

G.audio   = new AudioController();
G.shaders = new ShaderLoader( 'shaders' );
G.leap    = new Leap.Controller();
G.gui     = new dat.GUI({autoPlace:false});
G.loader  = new Loader();
G.stats   = new Stats();

G.tmpV3   = new THREE.Vector3();
G.tmpV2   = new THREE.Vector2();



// Just something to make things flow
G.flow = new THREE.Vector3();


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
G.windowSize    = new THREE.Vector2( G.w , G.h );
G.dpr           = window.devicePixelRatio || 1;
G.ratio         = G.w / G.h * G.ratio 
G.camera        = new THREE.PerspectiveCamera( 45 * G.ratio  , G.ratio , 10 , 10000 );
G.scene         = new THREE.Scene();
G.renderer      = new THREE.WebGLRenderer();
G.clock         = new THREE.Clock();

G.position      = new THREE.Vector3();
G.pageMarker    = new THREE.Mesh(
  new THREE.IcosahedronGeometry( 40,2 ),
  new THREE.MeshBasicMaterial({color:0xffffff})
);
G.pageTurnerOffset = new THREE.Vector3(  450 , -150 , 0 );
//G.scene.add( G.pageMarker );

G.camera.position.relative = new THREE.Vector3().copy( G.camera.position );

G.container     = document.getElementById('container' );


// Some Global Uniforms

G.dT      = { type:"f" , value: 0               } 
G.timer   = { type:"f" , value: 0               }
G.t_audio = { type:"t" , value: G.audio.texture }
G.dpr     = { type:"f" , value: window.devicePixelRatio || 1 }

G.paused  = false;


// Get all the fun stuff started

G.renderer.setSize( G.w , G.h );
G.container.appendChild( G.renderer.domElement );
  
G.stats.domElement.id = 'stats';
document.body.appendChild( G.stats.domElement );

G.leap.connect();
G.gui.close();
G.scene.add( G.camera );
//G.onResize();

G.tween = TWEEN;

TWEEN.origTween = TWEEN.Tween;
TWEEN.Tween = function (options){
  var res = new TWEEN.origTween(options);
  res.easing(TWEEN.Easing.Quadratic.InOut);
  return res;
};

// Need something to call when started
G.startArray = [];


G.init = function(){

  this.pageTurner    = new PageTurner();
  
  /*
   
    Non Leap interaction

  */
  
  this.iPlane = new THREE.Mesh(
    new THREE.PlaneGeometry( 100000 , 100000 ),
    new THREE.MeshNormalMaterial()
  );
  this.scene.add( this.iPlane );
  this.iPlane.visible = false;
  this.iPlane.faceCamera = true;

  var l = 1000000000;

  this.iObj = new THREE.Object3D();
  this.iObj.position.set( l , l , l );

  this.iPointMarker = new THREE.Mesh(
    new THREE.BoxGeometry( 5 , 5 , 100 ),
    new THREE.MeshBasicMaterial({color:0xffff00})
  );

  //this.iObj.add( this.iPointMarker );
  this.scene.add( this.iObj );

  this.iPoint = this.iObj.position;
  this.iPoint.relative = new THREE.Vector3();
  this.iPoint.relative.copy( this.iPoint );

  this.iDir   = new THREE.Vector3( 0 , 0 , -1 );
  this.iPlaneDistance = 600;


  G.GEOS[ 'icosahedron' ]  = new THREE.IcosahedronGeometry( 1 , 2 );
  G.MATS[ 'normal'      ]  = new THREE.MeshNormalMaterial();

  /*

     For Mani

  */
  this.attractor = new THREE.Vector3();

  this.attracting = false;
  this.attractionTimer = 0;

  this.solAttractor = new THREE.Vector3();
  this.solVelocity  = new THREE.Vector3();


  /*var g = G.GEOS[ 'icosahedron' ];
  var m = G.MATS[ 'normal'      ];

  this.attractorMesh    = new THREE.Mesh( g , m );
  this.solAttractorMesh = new THREE.Mesh( g , m );

  this.scene.add( this.attractorMesh );
  this.scene.add( this.solAttractorMesh );*/
 
  /*
  
     Leap Hands!

  */


  var rHandMesh = new THREE.Mesh( 
    new THREE.BoxGeometry( 10 , 10, 100 ),
    new THREE.MeshBasicMaterial( 0xff0000 )
  );
 

  var smallMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 1 , 2 ),
    new THREE.MeshBasicMaterial({color:0xffffff})

  );
  this.rHand = new RiggedSkeleton( this.leap , this.camera , {
  
    movementSize: 1000,
    handSize:     100,

  });
  
 // this.rHand.addScaledMeshToAll( rHandMesh );

  //this.rHand.hand.add( smallMesh );
  this.rHand.addToScene( this.scene );

  this.rHand.relative = new THREE.Vector3();




  var lHandMesh = new THREE.Mesh( 
    new THREE.BoxGeometry( 10 , 10, 100 ),
    new THREE.MeshBasicMaterial( 0xff0000 )
  );
 
  this.lHand = new RiggedSkeleton( this.leap , this.camera ,  {
  
    movementSize: 1000,
    handSize:     100,

  });
  
  //this.lHand.addScaledMeshToAll( rHandMesh );

  var sm = smallMesh.clone();
  this.lHand.hand.add( sm );
  this.lHand.addToScene( this.scene );

  this.lHand.relative = new THREE.Vector3();


  //this.lHand.particles = new HandParticles( this.lHand.hand , 64 );
  this.rHand.particles = new HandParticles( this.rHand.hand , 64 );

  //this.lHand.particles.activate();
  this.rHand.particles.activate();

  /*
  
     Text

  */

  this.text = new TextParticles({
    vertexShader:   this.shaders.vs.text,
    fragmentShader: this.shaders.fs.text,
    lineLength:     60,
    //letterWidth:    40,
    //lineHeight:     40
  });

  this.textCreator = new TextCreator( 300 );

  /*

     Object Controls for the entire book

  */

    
  this.objectControls = new ObjectControls( 
    this.camera , 
    this.rHand.hand , 
    this.leap  
  );

  this.mouse = this.objectControls.unprojectedMouse;
  this.raycaster = this.objectControls.raycaster;

  var c = [
    new THREE.Color( '#1157ff' ),
    new THREE.Color( '#00a4ff' ),
    new THREE.Color( '#5e2dff' ),
    new THREE.Color( '#00fff0' ),
  ];

  var col1 = new THREE.Vector3( c[0].r , c[0].g , c[0].b );
  var col2 = new THREE.Vector3( c[1].r , c[1].g , c[1].b );
  var col3 = new THREE.Vector3( c[2].r , c[2].g , c[2].b );
  var col4 = new THREE.Vector3( c[3].r , c[3].g , c[3].b );

    
  this.furryTails = [];


  var center = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 100 , 0 ),
    new THREE.MeshNormalMaterial({side:THREE.DoubleSide})
  );

  var bait = center.clone();


  this.maniGroup = new FurryGroup( this ,  'mani' , G.audio , 1 ,{
    center:center,
    bait: bait,
    color1: col1,
    color2: col2,
    color3: col3,
    color4: col4,
  });



  this.mani =  this.furryTails[0];
  this.mani.position.relative = new THREE.Vector3();

  //this.mani.activate();

  this.mani.iPlaneAttracting = true;

  this.mani.addDistanceSquaredForce( this.attractor , 100 );

  var c = [
    new THREE.Color( '#ed0000' ),
    new THREE.Color( '#fff000' ),
    new THREE.Color( '#ff8700' ),
    new THREE.Color( '#e82626' ),
  ];


  var col1 = new THREE.Vector3( c[0].r , c[0].g , c[0].b );
  var col2 = new THREE.Vector3( c[1].r , c[1].g , c[1].b );
  var col3 = new THREE.Vector3( c[2].r , c[2].g , c[2].b );
  var col4 = new THREE.Vector3( c[3].r , c[3].g , c[3].b );

  this.solGroup = new FurryGroup( this ,  'sol' , G.audio , 1 ,{
    center:center,
    bait: bait,
    color1: col1,
    color2: col2,
    color3: col3,
    color4: col4,
  });



  this.sol =  this.furryTails[1];
  this.sol.position.relative = new THREE.Vector3();
  this.sol.maniAttracting = true;

  //this.mani.activate();

  this.sol.addDistanceSquaredForce( this.solAttractor , 100 );
  


}


G.updateIntersection = function(){

  if( this.iPlane.faceCamera == true ){
    
    this.iPlane.position.copy( this.camera.position );
    var vector = new THREE.Vector3( 0 , 0 , -this.iPlaneDistance );
    vector.applyQuaternion( this.camera.quaternion );
    this.iPlane.position.add( vector );
    this.iPlane.lookAt( this.camera.position );

    this.iObj.lookAt( this.camera.position );

  }else{

    G.tmpV3.set( 0 , 0 , 1 );
    G.tmpV3.applyQuaternion( this.iPlane.quaternion );

    var lookat =this.iObj.position.clone().add( G.tmpV3 );

    this.iObj.lookAt( lookat ); 

  }


  G.tmpV3.copy( this.mouse );

  if( this.objectControls.leap === true ){

    G.tmpV3.copy(this.rHand.hand.position);
 
  }
  
  G.tmpV3.sub( this.camera.position );
  G.tmpV3.normalize();

  
  this.raycaster.set( this.camera.position ,  G.tmpV3 );

  var intersects = this.raycaster.intersectObject( this.iPlane );

  if( intersects.length > 0 ){
  
    this.iPoint.copy( intersects[0].point );
    this.iPoint.relative.copy( this.iPoint );
    this.iPoint.relative.sub( this.position );
    this.iDir.copy( G.tmpV3 );
   // bait.position.copy( intersects[0].point );
  }else{
    //console.log('NOT HITTING IPLANE!');
  }


}

G.animate = function(){

  this.pageMarker.position.copy( this.position );
  
  if( !this.paused ){

     this.dT.value = this.clock.getDelta();  
  this.timer.value += G.dT.value;

    this.tween.update();

    this.objectControls.update();
    this.updateIntersection();

    this.audio.update();

    this.rHand.update( 0 );
    this.lHand.update( 1 );

    this.rHand.particles.update();
    //this.lHand.particles.update();


    this.rHand.relative.copy( this.rHand.hand.position );
    this.rHand.relative.sub( this.position );
    
    this.lHand.relative.copy( this.lHand.hand.position );
    this.lHand.relative.sub( this.position );

    this.iPoint.relative.copy( this.iPoint );
    this.iPoint.relative.sub( this.position );
   
    this.camera.position.relative.copy( this.camera.position );
    this.camera.position.relative.sub( this.position );

    if( this.mani.active == true ){
      this.mani.updateTail();
      this.mani.updatePhysics();
      this.mani.position.relative.copy( this.mani.position );
      this.mani.position.relative.sub( this.position );
    }


    if( this.sol.active == true ){
      this.sol.updateTail();
      this.sol.updatePhysics();
      this.sol.position.relative.copy( this.sol.position );
      this.sol.position.relative.sub( this.position );
    }


    this.updateAttractor();

    for( var propt  in this.pages ){

      this.pages[ propt ].update();

    }

    this.stats.update();
    this.renderer.render( this.scene , this.camera );

  }

  //this.stats.update();
  //this.renderer.render( this.scene , this.camera );

  requestAnimationFrame( this.animate.bind( this ) );
  

}

G.updateAttractor = function(){

   if( this.attracting === true ){

    this.attractor.copy( G.iPoint );

  }

  if( (G.timer.value - this.attractionTimer ) > 2.5 ){
  
    this.attracting = true;

  }

  if( this.mani.iPlaneAttracting === true ){

    var d = this.mani.position.clone().sub( this.iPoint ).length();


    if( d < 5 ){

      this.attractor.copy( this.iPoint );

      G.tmpV3.set( 
        (Math.random()-.5) * 1000  , 
        (Math.random()-.5) * 1000  ,
        Math.random() * 500
      );

      G.tmpV3.applyQuaternion( this.iPlane.quaternion );
     // G.tmpV3.multiplyScalar( Math.random() * 500 );
      
      this.attractor.add( G.tmpV3 );


      this.attracting = false;
      this.attractionTimer = G.timer.value

    }

  }


  if( this.sol.maniAttracting === true ){
    
    G.tmpV3.copy( this.mani.position );

    G.tmpV3.sub( this.solAttractor );

   // G.tmpV3.normalize();

    this.solVelocity.add( G.tmpV3 );

    G.tmpV3.copy( this.solVelocity );
    G.tmpV3.normalize();
    G.tmpV3.multiplyScalar( 2.4 );
    this.solAttractor.add( G.tmpV3 );

    this.solVelocity.multiplyScalar( .995 );

  }

 // this.attractorMesh.position.copy( this.attractor );
 // this.solAttractorMesh.position.copy( this.solAttractor );


}


G.addToStartArray = function( callback ){

  this.startArray.push( callback );

}


G.onResize = function(){

  
  this.w = window.innerWidth;
  this.h = window.innerHeight;

  this.windowSize.x = this.w;
  this.windowSize.y = this.h;

  this.ratio = this.w / this.h;

 
  // To try and keep everything neccesary on screen
  this.camera.aspect = this.ratio;
  this.camera.fov    = 60 / Math.pow(this.ratio,.7);   
  this.camera.updateProjectionMatrix();
  this.renderer.setSize( this.w , this.h );

}

G.onKeyDown = function( e ){

  console.log( e.which );
  if( e.which == 32 ){

    this.paused = !this.paused;

  }


   /*if( e.which == 80 ){

    this.paused = true;
      
     var cb = function(){
    
       G.paused = false;

     }.bind( G );
    THREE.renderTiledScene( G.renderer, G.scene,G.camera, 10 , 10 , 'enough' , cb );

  }*/




}
G.loadTextures = function(){

  for( var i = 0; i < G.texturesToLoad.length; i++ ){

    var t = G.texturesToLoad[i];

    this.loadTexture( t[0] , t[1] );

  }

}

G.loadTexture = function( name , file ){

  var cb = function(){
    this.loader.onLoad(); 
  }.bind( this );

  var m = THREE.UVMapping;

  var l = THREE.ImageUtils.loadTexture;

  G.loader.addLoad();
  G.TEXTURES[ name ] = l( file , m , cb );
  G.TEXTURES[ name ].wrapS = THREE.RepeatWrapping;
  G.TEXTURES[ name ].wrapT = THREE.RepeatWrapping;

}

//G.createNextPage

// Some Event Listeners

window.addEventListener( 'resize'   , G.onResize.bind( G )  , false );
window.addEventListener( 'keydown'  , G.onKeyDown.bind( G ) , false );

