var tree = new Page( 'tree' );

tree.textChunk = [

  "The after leaving the flowing forest, Mani began feeling lonely again.",
  "","",
  "It was true that he had loved seeing the whisping silver flow around him, and the sounds he had heard were truly magical, but what he wanted there to be more. He wanted to find the purpose for the world around him. He wanted to know why he was hear, and most importantly he begged of the reality around him, that he was not alone."

].join("\n" );


tree.position.set(  0 , 0 , 0 );
tree.cameraPos.set( 0 , 3500 , 4000 );
tree.iPlaneDistance = 1000


tree.lights = [];

tree.lightParamArray = [
    
  {
    audio:"lup",
    color: new THREE.Vector3( 1.  , 0. , 0. ),
    position: new THREE.Vector3(),
    early: true
  },

  { 
    audio:"snare",
    color: new THREE.Vector3( 0. , 1. , 0 ),
    position: new THREE.Vector3(),
    early: true

  },

  { 
    audio:"glo",
    color: new THREE.Vector3( 0. , 1. , 1. ),
    position: new THREE.Vector3(),
    early: true

  },


  { 
    audio:"game",
    color: new THREE.Vector3( 1. , 1. , 0 ),
    position: new THREE.Vector3(),
    early: true

  },

  { 
    audio:"allRight",
    color: new THREE.Vector3( .3 , 1. , 1 ),
    position: new THREE.Vector3(),
    early: false
  },

  { 
    audio:"daWay",
    color: new THREE.Vector3( 1. , 1. , 0 ),
    position: new THREE.Vector3(),
    early: false
  },

  { 
    audio:"tongue",
    color: new THREE.Vector3( 1. , 1. , 1 ),
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
  
  var f = 'pages/tree/';

  this.loadShader( 'tree' , f + 'fs-tree' , 'fragment' );
  this.loadShader( 'tree' , f + 'vs-tree' , 'vertex' );
  this.loadShader( 'treeFloor' , f + 'fs-treeFloor' , 'fragment' );
  this.loadShader( 'treeFloor' , f + 'vs-treeFloor' , 'vertex' );

  var f = 'audio/pages/tree/'
  for( var i = 0; i < this.lightParamArray.length; i++ ){

    var name = this.lightParamArray[i].audio;
    this.loadAudio( name , f + name + '.mp3' );

  }

  this.loadTexture( 'sand' , 'img/normals/sand.png' );

}.bind( tree ) );


tree.addToStartArray( function(){

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


}.bind( tree ) );



tree.addToStartArray( function(){

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 120,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });

  this.text = new PhysicsText( this.textChunk );

}.bind( tree ) );


tree.addToStartArray( function(){



  var lightGeo =  new THREE.IcosahedronGeometry( 30 , 2 );
  var lightMat = new THREE.MeshNormalMaterial();  

  for( var i = 0; i < this.lightParamArray.length; i++ ){

    var params = this.lightParamArray[i];

    var height = (i+3 / 8 ) * 100.; 

    var t = Math.random() * 2 * Math.PI;

    var r = 1000;

    var x = r * Math.cos( t );
    var z = r * Math.cos( t );

    var light = new THREE.Mesh( lightGeo, lightMat );

    light.position.x =  x;
    light.position.z =  z;
    light.position.y = height;

    light.radius = r;
    light.height = height;
    light.theta  = t;

    light.audio = G.AUDIO[ params.audio ];
    light.audio.reconnect( this.gain );

    light.texture = light.audio.texture;

    light.color = params.color;

    this.looper.everyLoop( function(){ this.audio.play() }.bind( light ) );

    light.audio.updateAnalyser = true;
    light.audio.updateTexture = true;

    this.lightParams.textures.value.push( light.texture );
    this.lightParams.positions.value.push( light.position );
    this.lightParams.colors.value.push( light.color );

   
    this.scene.add( light );

    this.lights.push( light );

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

  console.log( 'TREE' );
  console.log( tree );

  tree.position.y = -500;

  this.scene.add( tree );

  this.looper.start();

}.bind( tree ) );

tree.addToActivateArray( function(){

  this.text.activate();

}.bind( tree ));


tree.addToAllUpdateArrays( function(){

  for( var i =0 ; i < this.lights.length; i++ ){

    var l = this.lights[i];

    l.theta += .001 + i * .001;
    l.position.x = l.radius * Math.cos( l.theta );
    l.position.z = l.radius * Math.sin( l.theta );
    l.position.y = l.height + Math.cos( (l.theta  )) * 500;

    G.tmpV3.copy( l.position );

    G.tmpV3.sub( G.camera.position );
    

  }

  this.text.update();

}.bind( tree ));


tree.addToDeactivateArray( function(){

  this.text.kill();

}.bind( tree) );



