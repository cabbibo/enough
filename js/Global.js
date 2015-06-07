// TODO: Global Loki Character

function Global(){

  this.postProcessingOn = false;

  this.pageTransitionLength = 20;

  this.texturesToLoad = [
   
    ['ubuntuMono'       , 'img/extras/ubuntuMono.png'       ],
    
    ['iri_red'          , 'img/iri/red.png'                 ],
    ['iri_gold'         , 'img/iri/gold.png'                ],
    ['iri_blue'         , 'img/iri/blue.png'                ],

    ['norm_moss'        , 'img/normals/moss_normal_map.jpg' ],

    ['sprite_flare'     , 'img/sprite/flare.png'            ],
    ['sprite_cabbibo'   , 'img/sprite/cabbibo.png'          ],
    ['sprite_mote'      , 'img/sprite/mote.png'             ],

    ['ribbonNorm'       , 'img/normals/ribbon.jpg'          ],
    ['matcapMetal'      , 'img/matcap/metal.jpg'            ],

    ['logo'             , 'img/icons/cabbibo.png'           ],
    ['toggleOpen'       , 'img/sprite/eyeOpened.png'        ],
    ['toggleClose'      , 'img/sprite/eyeClosed.png'        ],
    ['postprocessingOn' , 'img/sprite/lightIcon.png'        ],

  ]

  this.pages   = {};

  // Loaded objects that may be
  // Used across pages
  this.AUDIO     = {};
  this.TEXTURES  = {};
  this.GEOS      = {};
  this.MATS      = {};

  this.loaded = false;

  this.audio   = new AudioController();
  this.shaders = new ShaderLoader( 'shaders' , 'shaders' );
  this.leap    = new Leap.Controller();
  this.gui     = new dat.GUI({autoPlace:false});

  this.loader  = new Loader();


  // Assigning load bar af
  this.loadBar = new LoadBar();

  this.stats   = new Stats();

  this.tmpV3   = new THREE.Vector3();
  this.v1      = this.tmpV3;
  this.v2      = this.v1.clone();         // for typing sake
  this.v3      = this.v1.clone();         // for typing sake
  this.v4      = this.v1.clone();         // for typing sake
  this.tmpV2   = new THREE.Vector2();


  // Just something to make things flow
  this.flow = new THREE.Vector3();


  this.w             = window.innerWidth;
  this.h             = window.innerHeight;
  this.windowSize    = new THREE.Vector2( this.w , this.h );
  this.dpr           = window.devicePixelRatio || 1;
  this.ratio         = this.w / this.h * this.ratio 
  this.camera        = new THREE.PerspectiveCamera( 45 * this.ratio  , this.ratio , 10 , 20000 );
  this.scene         = new THREE.Scene();
  this.renderer      = new THREE.WebGLRenderer();
  this.clock         = new THREE.Clock();

  this.position      = new THREE.Vector3();
  this.lookAt        = new THREE.Vector3();

  this.pageMarker    = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 40,2 ),
    new THREE.MeshBasicMaterial({color:0xffffff})
  );
  this.pageTurnerOffset = new THREE.Vector3(  400 , -150 , -1000 );

  this.cursor = new THREE.Mesh(

    new THREE.IcosahedronGeometry( 2,2 ),
    new THREE.MeshBasicMaterial({color:0xffffff})

  )

  //G.scene.add( G.pageMarker );

  this.camera.position.relative = new THREE.Vector3().copy( this.camera.position );

  this.container     = document.getElementById('container' );


  // Some Global Uniforms

  this.dT      = { type:"f" , value: 0               } 
  this.timer   = { type:"f" , value: 0               }
  this.t_audio = { type:"t" , value: this.audio.texture }
  this.dpr     = { type:"f" , value: window.devicePixelRatio || 1 }
  this.time    = this.timer // because this has destroyed me too many times


  this.paused  = false;

  // Get all the fun stuff started

  this.renderer.setSize( this.w , this.h );
  this.renderer.setPixelRatio( this.dpr.value );

  this.composer = new WAGNER.Composer( this.renderer, { useRGBA: false } );

  this.container.appendChild( this.renderer.domElement );
    
  this.stats.domElement.id = 'stats';
  document.body.appendChild( this.stats.domElement );

  this.leap.connect();
  this.gui.close();
  this.scene.add( this.camera );
  this.onResize();


  this.tween = TWEEN;

  TWEEN.origTween = TWEEN.Tween;
  TWEEN.Tween = function (options){
    var res = new TWEEN.origTween(options);
    res.easing(TWEEN.Easing.Quadratic.InOut);
    return res;
  };

  // Need something to call when started
  this.startArray = [];





  this.loader.loadUpdate = function( percent ){

    //console.log( 'hello : ' + percent )
    this.loadBar.onLoad( percent )

  }.bind( this )

  this.loader.onStart = function(){
    
    //console.log( this.loadBar)

    this.onResize();
    this.init();

    for( var i = 0; i < this.startArray.length; i++ ){

      this.startArray[i]();

    }


    this.loadBar.onFinishedLoad();

    //this.loaded = true;

  }.bind( this );

}

Global.prototype.init = function(){



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


  // Intersection plane for just the text
  this.iTextPlane = new THREE.Mesh(
    new THREE.PlaneGeometry( 100000 , 100000 ),
    new THREE.MeshNormalMaterial()
  );
  this.scene.add( this.iTextPlane );
  this.iTextPlane.visible = false;
  this.iTextPlaneDistance = 1000;

  this.iTextPoint = new THREE.Vector3();
  this.iTextPoint.relative = new THREE.Vector3();

  //this.iTextPlane.faceCamera = true;

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


  this.GEOS[ 'icosahedron'       ] = new THREE.IcosahedronGeometry( 1 , 2 );
  this.GEOS[ 'icosahedronDense'  ] = new THREE.IcosahedronGeometry( 1 , 3 );
  this.GEOS[ 'sun'               ] = new THREE.IcosahedronGeometry( 3000 , 6 );
  this.GEOS[ 'planeBuffer'       ] = new THREE.PlaneBufferGeometry( 1 , 1 );
  this.MATS[ 'normal'            ] = new THREE.MeshNormalMaterial();



  /*

     WAGNER SETUP

  */

	this.noisePass           = new WAGNER.NoisePass();
	this.multiPassBloomPass  = new WAGNER.MultiPassBloomPass();
	this.vignette2Pass       = new WAGNER.Vignette2Pass();
	this.dirtPass            = new WAGNER.DirtPass();
	this.blendPass           = new WAGNER.BlendPass();
	this.fxaaPass            = new WAGNER.FXAAPass();

	this.multiPassBloomPass.params.blurAmount = .5;




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
  

  /*
  
     Text

  */

  this.text = new TextParticles({
    vertexShader:   this.shaders.vs.text,
    fragmentShader: this.shaders.fs.text,
    lineLength:     48,
    letterWidth:    13,
    lineHeight:     20
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


  this.maniGroup = new FurryGroup( this ,  'mani' , this.audio , 1 ,{
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

  this.solGroup = new FurryGroup( this ,  'sol' , this.audio , 1 ,{
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

  this.sol.addDistanceSquaredForce( this.solAttractor , 10 );
  

  this.onResize();

}


Global.prototype.updateIntersection = function(){

  if( this.iPlane.faceCamera == true ){
    
    this.iPlane.position.copy( this.camera.position );
    G.v1.set( 0 , 0 , -this.iPlaneDistance );
    G.v1.applyQuaternion( this.camera.quaternion );
    this.iPlane.position.add( G.v1 );
    this.iPlane.lookAt( this.camera.position );

    this.iObj.lookAt( this.camera.position );

  }else{

    G.v1.set( 0 , 0 , 1 );
    G.v1.applyQuaternion( this.iPlane.quaternion );

    var lookat =this.iObj.position.clone().add( G.v1 );

    this.iObj.lookAt( lookat ); 

  }


  //console.log('YERPS');
  this.iTextPlane.position.copy( this.camera.position );
  G.v1.set( 0 , 0 , -this.iTextPlaneDistance );
  G.v1.applyQuaternion( this.camera.quaternion );
  this.iTextPlane.position.add( G.v1);
  this.iTextPlane.lookAt( this.camera.position );

  G.v1.copy( this.mouse );

  if( this.objectControls.leap === true ){

    G.v1.copy(this.rHand.hand.position);
 
  }
  
  G.v1.sub( this.camera.position );
  G.v1.normalize();

  
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


  var intersects = this.raycaster.intersectObject( this.iTextPlane );

  if( intersects.length > 0 ){
    this.iTextPoint.copy( intersects[0].point );
  }else{
   // console.log('NOT HITTING IPLANE!');
  }

  this.iTextPoint.relative.copy( this.iTextPoint );
  this.iTextPoint.relative.sub( this.position );



  G.cursor.position.copy( this.iTextPoint );




}

Global.prototype.animate = function(){

  this.tween.update();

  if( !this.loaded ){

    this.loadBar.update();

  }else{

    this.pageMarker.position.copy( this.position );
    
    if( !this.paused ){



      this.dT.value = this.clock.getDelta();  
      this.timer.value += this.dT.value;
      
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


      this.updateAttractor();

      for( var propt  in this.pages ){

        this.pages[ propt ].update();

      }

      this.stats.update();

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


     

    }

  }



  if( this.postProcessingOn == false ){
    this.renderer.render( this.scene , this.camera );
  }else{
 
    this.composer.reset();
    this.composer.render( this.scene, this.camera );
    //  this.composer.pass( this.sepiaPass );

    // this.multiPassBloomPass.params.applyZoomBlur = true;
    this.composer.pass( this.multiPassBloomPass ); 
    
    this.vignette2Pass.params.reduction = 3
    this.composer.pass( this.vignette2Pass );
    this.composer.pass( this.fxaaPass );
    this.noisePass.params.speed = 1;
    this.composer.pass( this.noisePass );
    this.composer.pass( this.dirtPass );

    this.composer.toScreen();

  }


  //this.stats.update();
  //this.renderer.render( this.scene , this.camera );

  requestAnimationFrame( this.animate.bind( this ) );
  

}

Global.prototype.togglePostprocessing = function(){
 
  this.postProcessingOn = !this.postProcessingOn;

}

Global.prototype.updateAttractor = function(){

   if( this.attracting === true ){

    this.attractor.copy( G.iPoint );

  }

  if( (this.timer.value - this.attractionTimer ) > 2.5 ){
  
    this.attracting = true;

  }

  if( this.mani.iPlaneAttracting === true ){

    var d = this.mani.position.clone().sub( this.iPoint ).length();


    if( d < 5 ){

      this.attractor.copy( this.iPoint );

      this.v1.set( 
        (Math.random()-.5) * 1000  , 
        (Math.random()-.5) * 1000  ,
        Math.random() * 500
      );

      this.v1.applyQuaternion( this.iPlane.quaternion );
     // G.v1.multiplyScalar( Math.random() * 500 );
      
      this.attractor.add( G.v1 );


      this.attracting = false;
      this.attractionTimer = G.timer.value

    }

  }


  if( this.sol.maniAttracting === true ){
    
    this.v1.copy( this.mani.position );

    this.v1.sub( this.solAttractor );

   // G.v1.normalize();

    this.solVelocity.add( this.v1 );

    this.v1.copy( this.solVelocity );
    this.v1.normalize();
    this.v1.multiplyScalar( 3.4 );
    this.v1.multiplyScalar( this.dT.value * 60 );
    this.solAttractor.add( this.v1 );

    this.solVelocity.multiplyScalar( .995 );

  }

 // this.attractorMesh.position.copy( this.attractor );
 // this.solAttractorMesh.position.copy( this.solAttractor );


}


Global.prototype.addToStartArray = function( callback ){

  this.startArray.push( callback );

}


Global.prototype.onResize = function(){

  
  this.w = window.innerWidth;
  this.h = window.innerHeight;
  //this.dpr = window.devicePixelRatio || 1;

  this.windowSize.x = this.w;
  this.windowSize.y = this.h;

  this.ratio = this.w / this.h;

 
  // To try and keep everything neccesary on screen
  this.camera.aspect = this.ratio;
  this.camera.fov    = 60 / Math.pow(this.ratio,.7);   
  this.camera.updateProjectionMatrix();

  this.renderer.setSize( this.w , this.h);

  //renderer.setSize( s * w, s * h );
	//camera.projectionMatrix.makePerspective( fov, w / h, camera.near, camera.far );
  //TODO: Make this work for dpr!
	this.composer.setSize( this.w , this.h);
//	depthTexture = WAGNER.Pass.prototype.getOfflineTexture( w, h, true );

  this.renderer.setSize( this.w , this.h );

  if( this.currentPage ){
    this.currentPage.resizeFrames();
    if( this.nextPage ){
      this.nextPage.resizeFrames();
    }
  }

  var div = document.getElementById( "experienceInfo")
  var dpr = window.devicePixelRatio || 1;
  div.style.fontSize = ( window.innerWidth ) / 80

}

Global.prototype.onKeyDown = function( e ){

  //console.log( e.which );
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

Global.prototype.loadTextures = function(){

  for( var i = 0; i < this.texturesToLoad.length; i++ ){

    var t = this.texturesToLoad[i];

    this.loadTexture( t[0] , t[1] );

  }

}

Global.prototype.loadTexture = function( name , file ){

  var cb = function(){
    this.loader.onLoad(); 
  }.bind( this );

  var m = THREE.UVMapping;

  var l = THREE.ImageUtils.loadTexture;

  this.loader.addLoad();
  this.TEXTURES[ name ] = THREE.ImageUtils.loadTexture( file , m , cb );
  this.TEXTURES[ name ].wrapS = THREE.RepeatWrapping;
  this.TEXTURES[ name ].wrapT = THREE.RepeatWrapping;

}

Global.prototype.fullscreenIt = function(){

  var element = document.body;

  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }

}

var G = new Global();

window.addEventListener( 'resize'   , G.onResize.bind( G )  , false );
window.addEventListener( 'keydown'  , G.onKeyDown.bind( G ) , false );

