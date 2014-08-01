var tree = new Page( 'tree' );

tree.textChunk = [

  "The after leaving the flowing forest, Mani began feeling lonely again.",
  "","",
  "It was true that he had loved seeing the whisping silver flow around him, and the sounds he had heard were truly magical, but what he wanted there to be more. He wanted to find the purpose for the world around him. He wanted to know why he was hear, and most importantly he begged of the reality around him, that he was not alone."

].join("\n" );

tree.textChunk2 = [

  "As he approached the haunting tree in front of him, Mani felt ready to resign. What was the purpose of all of this, if there was no purpose at all.",
  "","",
  "Than, suddenly, out of the corner of his eye, he spotted an orange glow. He wondered what the glow could be, and as he moved forward, he began to understand that the impossible occured"

].join("\n" );



tree.position.set(  0 , -3000 , 0 );
tree.cameraPos.set( 1000 , -2000 , 3000 );
tree.cameraPos2 = new THREE.Vector3( 0 , -2200 , 2000 );

tree.iPlaneDistance = 1000


tree.lights = [];

tree.lightParamArray = [
    
  {
    audio:"lup",
    color: new THREE.Vector3( .2  , 0. , .9 ),
    position: new THREE.Vector3(),
    early: true
  },

  { 
    audio:"snare",
    color: new THREE.Vector3( 0. , .4 , .8 ),
    position: new THREE.Vector3(),
    early: true

  },

  { 
    audio:"glo",
    color: new THREE.Vector3( .2 , .3 , .9 ),
    position: new THREE.Vector3(),
    early: true

  },




  { 
    audio:"allRight",
    color: new THREE.Vector3( .3 , .5 , 1 ),
    position: new THREE.Vector3(),
    early: true
  },

  { 
    audio:"startingOver",
    color: new THREE.Vector3( 0 , .2 , .5 ),
    position: new THREE.Vector3(),
    early: true
  },

  { 
    audio:"tongue",
    color: new THREE.Vector3( .1 , .4 , .9  ),
    position: new THREE.Vector3(),
    early: true 
  },

   { 
    audio:"game",
    color: new THREE.Vector3( 1. , .4 , .1 ),
    position: new THREE.Vector3(),
    early: false

  },

]


tree.params = { 
  
  radius:                 100,
  height:                1000,
  sides:                    8,
  numOf:                   18, 
  randomness:             180,
  slices:                 100,
  startingChance:          4.,
  chanceReducer:           .9,
  randomnessReducer:       .5,
  sliceReducer:            .7,
  numOfReducer:            .8,
  progressionPower:        1.4,
  lengthReduction:         .5,
  maxIterations:            3,
  material:             null,
  createTree: function(){
    this.createTree();
  }.bind( tree )
}


tree.lightParams = {

  cutoff: { type:"f" , value:1000 } ,
  power: { type:"f" , value:1 } ,
  positions: { type:"v3v" , value:[] },
  textures:{   type:"tv" , value:[] },
  colors: { type:"v3v" , value:[] },
  normalScale:{ type:"f" , value:.5 } ,
  texScale: { type:"f" , value:1.5 } ,


}

tree.floorParams = {

  normalScale:{ type:"f" , value:.3 } ,
  texScale: { type:"f" , value:7 } ,
  bumpHeight: { type:"f" , value:200 } ,
  bumpSize: { type:"f" , value:.001 } ,
  bumpSpeed: { type:"f" , value:.1 } ,
  bumpCutoff: { type:"f" , value:.5 } ,

}


tree.treeRenderParams = {

  normalScale:{ type:"f" , value:.3 } ,
  texScale: { type:"f" , value:.01 } ,

}

// Need to load at least 1 thing
tree.addToInitArray( function(){
  
  console.log('TREE INIT' );


  var f = 'pages/tree/';

  this.loadShader( 'tree' , f + 'fs-tree' , 'fragment' );
  this.loadShader( 'tree' , f + 'vs-tree' , 'vertex' );
  this.loadShader( 'treeFloor' , f + 'fs-treeFloor' , 'fragment' );
  this.loadShader( 'treeFloor' , f + 'vs-treeFloor' , 'vertex' );

  this.loadShader( 'treeLight' , f + 'vs-treeLight' , 'vertex'    );
  this.loadShader( 'treeLight' , f + 'fs-treeLight' , 'fragment'    );

  var f = 'audio/pages/tree/'
  for( var i = 0; i < this.lightParamArray.length; i++ ){

    var name = this.lightParamArray[i].audio;
    this.loadAudio( name , f + name + '.mp3' );

  }

  this.loadTexture( 'sand' , 'img/normals/sand.png' );

}.bind( tree ) );


tree.addToStartArray( function(){

  console.log('TREE START' );
  
  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( tree ));


tree.addToStartArray( function(){

  /*

     Tree Params

  */

  var treeGui = this.gui.addFolder( 'Tree Params' );

  var g = treeGui.add( tree.params , 'radius' , 0 , 400 )
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'height' , 0 , 4000 )
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'sides' , 0 , 20 ).step(1)
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'numOf' , 4 , 40).step(1)
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'randomness' , 0 , 500 )
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'slices' , 10 , 500 ).step(1)
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'startingChance' , 0 , 10 )
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'chanceReducer' , 0 , .99)
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'randomnessReducer' , 0 , .99 )
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'sliceReducer' , 0 , .99 )
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'numOfReducer' , 0 , .99)
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'progressionPower' , 0 , 5 )
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'lengthReduction' , 0 , 1 )
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'maxIterations' , 0 , 5).step(1)
  g.onFinishChange(function(){this.createTree();}.bind( tree ));

  var g = treeGui.add( tree.params , 'createTree' ).name('Recreate Tree');
  g.onFinishChange(function(){this.createTree();}.bind( tree ));



  /*

     Floor Params

  */
     
  var fP = this.floorParams;
  var floorGui = this.gui.addFolder( 'Floor Params' );

  var g = floorGui.add( fP.normalScale  , 'value' ).name( 'normalScale' );
  var g = floorGui.add( fP.texScale     , 'value' ).name( 'texSize' );
  var g = floorGui.add( fP.bumpHeight   , 'value' ).name( 'bumpHeight' );
  var g = floorGui.add( fP.bumpSize     , 'value' ).name( 'bumpSize' );
  var g = floorGui.add( fP.bumpSpeed    , 'value' ).name( 'bumpSpeed' );
  var g = floorGui.add( fP.bumpCutoff   , 'value' ).name( 'bumpCutoff' );


  /*
   
     Tree Render Params

  */
  var tP = this.treeRenderParams 
  var treeRenderGui = this.gui.addFolder( 'Tree Render Params' );

  var g = treeRenderGui.add( tP.normalScale  , 'value' ).name( 'normalScale' );
  var g = treeRenderGui.add( tP.texScale     , 'value' ).name( 'texSize' );


  /*
  
     lightParams

  */
  var lightGui = this.gui.addFolder( 'Light Params' );

  var lp = this.lightParams;

  var g = lightGui.add( lp.cutoff , 'value' ).name( 'cutoff' );
  var g = lightGui.add( lp.power  , 'value' ).name( 'power' );
   
  var g = lightGui.add( lp.normalScale , 'value' ).name( 'normalScale' );
  var g = lightGui.add( lp.texScale  , 'value' ).name( 'texScale' );


}.bind( tree ) );



tree.addToStartArray( function(){

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 120,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });

  this.text = new PhysicsText( this.textChunk );

  this.text2 = new PhysicsText( this.textChunk2 );

}.bind( tree ) );


tree.addToStartArray( function(){


  var lightGeo =  new THREE.IcosahedronGeometry( 50 , 2 );
  
  for( var i = 0; i < this.lightParamArray.length; i++ ){

    var params = this.lightParamArray[i];

    var height = (i+3 / 8 ) * 100.; 

    var t = Math.random() * 2 * Math.PI;

    var r = 1000;

    var x = r * Math.cos( t );
    var z = r * Math.cos( t );

    params.position = new THREE.Vector3( x , height , z );

    if( params.early === false ){

      params.position.x = 1000000000;

    }

    params.id = i;

    params.geo = lightGeo;
    params.loadedAudio = G.AUDIO[ params.audio ];  
    params.loadedAudio.reconnect( this.gain );

    params.radius = r;
    params.height = height;
    params.theta  = t;

    params.audio = G.AUDIO[ params.audio ];
    params.audio.reconnect( this.gain );

    new TreeLight( this , params );

  }


}.bind( tree ) );


tree.addToStartArray( function(){
    
  var floorGeo =  new THREE.PlaneGeometry( 5000 , 5000 , 100 , 100 );

  
  var floorMat = new THREE.ShaderMaterial({


    uniforms:{
      timer:G.timer,
      t_normal:{ type:"t" , value: G.TEXTURES.sand },
      normalScale:  this.floorParams.normalScale,
      texScale:     this.floorParams.texScale,
      bumpHeight:   this.floorParams.bumpHeight,
      bumpSize:     this.floorParams.bumpSize,
      bumpSpeed:    this.floorParams.bumpSpeed,
      bumpCutoff:    this.floorParams.bumpCutoff,
      lightCutoff:    this.lightParams.cutoff,
      lightPower:     this.lightParams.power,
      lightPositions: this.lightParams.positions, 
      lightTextures:  this.lightParams.textures,
      lightColors:    this.lightParams.colors,
      cameraPos:{ type:"v3" , value: G.camera.position }
    },

    vertexShader: G.shaders.vs.treeFloor,
    fragmentShader: G.shaders.fs.treeFloor,

  });


  var floor = new THREE.Mesh( floorGeo , floorMat );

  floor.rotation.x = -Math.PI / 2;

  floor.position.y = -450
  this.scene.add( floor );


}.bind( tree ) );


tree.addToStartArray( function(){


  var treeMat = new THREE.ShaderMaterial({

    uniforms:{
      timer:G.timer,
      t_normal:{ type:"t" , value: G.TEXTURES.sand },
      t_iri:{ type:"t" , value: G.TEXTURES.iriTurq },
      normalScale:  this.treeRenderParams.normalScale,
      texScale:     this.treeRenderParams.texScale,
      lightCutoff:   this.lightParams.cutoff,
      lightPower:    this.lightParams.power,
      lightPositions: this.lightParams.positions,
      lightTextures: this.lightParams.textures,
      lightColors: this.lightParams.colors,
      cameraPos:{ type:"v3" , value: G.camera.position }
    },
    vertexShader: G.shaders.vs.tree,
    fragmentShader: G.shaders.fs.tree,

  });

  this.params.material = treeMat;


  var tree = new Tree( this.params );


  tree.position.y = -500;

  this.scene.add( tree );

  this.looper.start();

}.bind( tree ) );

tree.addToActivateArray( function(){

  this.text.activate();


  var mesh = new THREE.Mesh(
    G.pageTurner.markerGeometry,
    G.pageTurner.markerMaterial
  );

  mesh.hoverOver = function(){

    this.transitionMesh.material.color = G.pageTurner.hoverColor;

  }.bind( tree );

   
  mesh.hoverOut = function(){

    this.transitionMesh.material.color = G.pageTurner.neutralColor;

  }.bind( tree );


  mesh.select = function(){

    this.position

    var l = 10000;
    var tween = new G.tween.Tween( this.cameraPos ).to( this.cameraPos2, l );
   
    this.text.kill( 10000 );

    tween.onUpdate( function( t ){

      G.camera.position.copy( this.cameraPos );
      G.objectControls.unprojectMouse();

      G.camera.lookAt( G.position );

    }.bind( this ));


    tween.onComplete( function(){

      console.log('complete');

      G.sol.activate();
      this.text2.activate();


      G.tmpV3.set( 50 , - 150 , 0 );
      this.endMesh.add( this , G.tmpV3 );

    }.bind( tree ) );


    tween.start();

  }.bind( tree );
  
  mesh.position.copy( G.camera.position.relative );
  
  var forward  = new THREE.Vector3( 0 , 0 , -1 );
  forward.applyQuaternion( G.camera.quaternion );
  forward.normalize();
  forward.multiplyScalar( G.iPlaneDistance );

  //console.log( G.iPlaneDistance );
  mesh.position.add( forward );

  G.tmpV3.set( 150 , -150 , 0 );
  mesh.position.add(  G.tmpV3 );

  G.tmpV3.copy( mesh.position );
  mesh.lookAt( G.tmpV3.sub( forward ) );

  G.objectControls.add( mesh );

  console.log('MEHS');
  console.log( mesh );
  this.scene.add( mesh );

  this.transitionMesh = mesh;



}.bind( tree ));


tree.addToAllUpdateArrays( function(){

  for( var i =0 ; i < this.lights.length; i++ ){

    this.lights[i].update();

  }


  if( this.maniAttractionLight ){


    G.tmpV3.copy( this.position );

    G.tmpV3.add( this.maniAttractionLight.position );

    G.attractor.copy( G.tmpV3 );

    G.tmpV3.copy( G.mani.position.relative );
    var d = G.tmpV3.sub( this.maniAttractionLight.position ).length();

   // d = 1000;
    if( d < 10 ){

      console.log('HIT HIT HIT HIT' );

      this.maniAttractionLight = undefined;

      G.mani.iPlaneAttracting = true;


    }

  }
  this.text.update();
  this.text2.update();

}.bind( tree ));


tree.addToDeactivateArray( function(){

  G.mani.iPlaneAttracting = true;
  this.maniAttractionLight = undefined;


  for( var i =0; i < this.lights.length; i++ ){

    G.objectControls.remove( this.lights[i] );

  }
  this.text2.kill();

}.bind( tree) );

tree.addToEndArray( function(){

  this.looper.end();

}.bind( tree) );



