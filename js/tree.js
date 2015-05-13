var tree = new Page( 'tree' );


tree.addToInitArray( function(){

  this.mani = true;
  this.sol  = false;

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 2000 , 1000 , 3000 ),
    lookPosition: new THREE.Vector3( 1000, 00 , 00 ),

    textChunk:TEXT.TREE[0], 
    start:function(){
      for( var i =0 ; i < this.page.lights.length; i++ ){

        if( this.page.lights[i].playing ){
          this.page.lights[i].select();
        }

        if( 
          this.page.lights[i].name === 'treeMurmur1' ||
          this.page.lights[i].name === 'treeMurmur2' 

        ){
          this.page.lights[i].select();
        }

      }
    }

  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 1000 , 1200 , 2000 ),
    lookPosition: new THREE.Vector3( 1000, 00 , -1000 ),

    textChunk:TEXT.TREE[1], 
    start:function(){
      for( var i =0 ; i < this.page.lights.length; i++ ){

        if( this.page.lights[i].playing ){
          this.page.lights[i].select();
        }

        if( 
          this.page.lights[i].name === 'treeMurmur1' ||
          this.page.lights[i].name === 'treeMurmur2' ||
          this.page.lights[i].name === 'treeChant1'  || 
          this.page.lights[i].name === 'treeChant2'  
        ){
          this.page.lights[i].select();
        }

      }
    }
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( -1000 , 200 , 2000 ),
    lookPosition: new THREE.Vector3( 1000, 200 , -300 ),
    
    textChunk:TEXT.TREE[2], 
    start:function(){
      for( var i =0 ; i < this.page.lights.length; i++ ){

        if( this.page.lights[i].playing ){
          this.page.lights[i].select();
        }

        if( 
          this.page.lights[i].name === 'treeMurmur1' ||
          this.page.lights[i].name === 'treeMurmur2' ||
          this.page.lights[i].name === 'treeChant1'  || 
          this.page.lights[i].name === 'treeChant2'  ||
          this.page.lights[i].name === 'treeHalleBounce'  ||
          this.page.lights[i].name === 'treeVoices'  

        ){
          this.page.lights[i].select();
        }

      }
    }
  });
    
  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  -4000 , 0 , 100  ),
    textChunk:TEXT.TREE[3], 
    start:function(){
      for( var i =0 ; i < this.page.lights.length; i++ ){

        if( this.page.lights[i].playing ){
          this.page.lights[i].select();
        }

        if( 
          this.page.lights[i].name === 'treeMurmur1' ||
          this.page.lights[i].name === 'treeVoices'  
        ){
          this.page.lights[i].select();
        }

      }
    }
  });


this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  -3000 , 100 , 300  ),
    lookPosition: new THREE.Vector3(  0 , 0 , 600  ),
    textChunk:TEXT.TREE[4], 
    start:function(){

      
      for( var i =0 ; i < this.page.lights.length; i++ ){

        if( this.page.lights[i].playing ){
          this.page.lights[i].select();
        }

        if( 
          this.page.lights[i].name === 'treeMurmur1' ||
          this.page.lights[i].name === 'treeMurmur2' ||
          this.page.lights[i].name === 'treeVoices'  


        ){
          this.page.lights[i].select();
        }

      }
    }

  });


this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  -2000 , 400 , 300  ),
    lookPosition: new THREE.Vector3(  0 , 400 ,600  ),
    textChunk:TEXT.TREE[5], 
    start:function(){

      
      for( var i =0 ; i < this.page.lights.length; i++ ){

        if( this.page.lights[i].playing ){
          this.page.lights[i].select();
        }

        if( 
          this.page.lights[i].name === 'treeMurmur1' ||
          this.page.lights[i].name === 'treeMurmur2' ||
          this.page.lights[i].name === 'treeChant1'  || 
          this.page.lights[i].name === 'treeChant2'  ||
          this.page.lights[i].name === 'treeVoices'  


        ){
          this.page.lights[i].select();
        }

      }
    }

  });


this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  -1000 , 0 , 0  ),
    lookPosition: new THREE.Vector3(  0 , 400 ,600  ),
    textChunk:TEXT.TREE[6], 
    start:function(){

      
      for( var i =0 ; i < this.page.lights.length; i++ ){

        if( this.page.lights[i].playing ){
          this.page.lights[i].select();
        }

        if( 
          this.page.lights[i].name === 'treeMurmur1' ||
          this.page.lights[i].name === 'treeMurmur2' ||

          this.page.lights[i].name === 'treeMelody'  ||
          this.page.lights[i].name === 'treeVoices'  

        ){
          this.page.lights[i].select();
        }

      }
    }

  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  -2000 , -400 , -300  ),
    lookPosition: new THREE.Vector3(  0 , 400 ,600  ),
    textChunk:TEXT.TREE[7], 
    start:function(){
      G.sol.activate();

      G.tmpV3.set( 0 , 2000 , 0 );
      G.sol.transport( G.tmpV3.add( G.position ));
      
      for( var i =0 ; i < this.page.lights.length; i++ ){

        if( this.page.lights[i].playing ){
          this.page.lights[i].select();
        }

        if( 
          this.page.lights[i].name === 'treeMurmur1' ||
          this.page.lights[i].name === 'treeMurmur2' ||
          this.page.lights[i].name === 'treeChant1'  || 
          this.page.lights[i].name === 'treeChant2'  ||
          this.page.lights[i].name === 'treeHalleBounce'  ||
          this.page.lights[i].name === 'treeVoices'  ||
          this.page.lights[i].name === 'treeMelody'  ||
          this.page.lights[i].name === 'treeBounce'  

        ){
          this.page.lights[i].select();
        }

      }
    }

  });


//x: 1000, y: 0, z: -2500,

 // this.position.set(  0 , -3000 , 0 );
  this.position.set(  -1000 , -3000 , 2500 );
  

  this.iPlaneDistance = 1000


  this.lights = [];

  this.lightParamArray = [
      
    {
      audio:"treeHalleBounce",
      color: new THREE.Vector3( .2  , 0. , .9 ),
      position: new THREE.Vector3(),
      early: true
    },

    { 
      audio:"treeVoices",
      color: new THREE.Vector3( 0. , .4 , .8 ),
      position: new THREE.Vector3(),
      early: true

    },

    { 
      audio:"treeMurmur1",
      color: new THREE.Vector3( .2 , .3 , .9 ),
      position: new THREE.Vector3(),
      early: true

    },

    { 
      audio:"treeMurmur2",
      color: new THREE.Vector3( .3 , .5 , 1 ),
      position: new THREE.Vector3(),
      early: true
    },

    { 
      audio:"treeChant1",
      color: new THREE.Vector3( .4 , .5 , .8 ),
      position: new THREE.Vector3(),
      early: true
    },

    { 
      audio:"treeChant2",
      color: new THREE.Vector3( .1 , .4 , .9  ),
      position: new THREE.Vector3(),
      early: true 
    },

     { 
      audio:"treeBounce",
      color: new THREE.Vector3( .1 , .5 , .8 ),
      position: new THREE.Vector3(),
      early:true 

    },

    { 
    
      audio:"treeMelody",
      color: new THREE.Vector3( 1. , .4 , .1 ),
      position: new THREE.Vector3(),
      early: false

    },


  ]


  this.params = { 
    
    radius:                 100,
    height:                1000,
    sides:                    6,
    numOf:                   14, 
    randomness:             180,
    slices:                 100,
    startingChance:          4.,
    chanceReducer:           .9,
    randomnessReducer:       .5,
    sliceReducer:            .7,
    numOfReducer:            .8,
    progressionPower:        1.4,
    lengthReduction:         .5,
    maxIterations:           3,
    material:             null,
    createTree: function(){
      this.createTree();
    }.bind( this )

  }


  this.lightParams = {

    cutoff: { type:"f" , value:3000 } ,
    power: { type:"f" , value:.4 } ,
    positions: { type:"v3v" , value:[] },
    textures:{   type:"tv" , value:[] },
    colors: { type:"v3v" , value:[] },
    normalScale:{ type:"f" , value:.5 } ,
    texScale: { type:"f" , value:1.5 } ,


  }

  this.floorParams = {

    normalScale:{ type:"f" , value:.3 } ,
    texScale: { type:"f" , value:7 } ,
    bumpHeight: { type:"f" , value:200 } ,
    bumpSize: { type:"f" , value:.001 } ,
    bumpSpeed: { type:"f" , value:.1 } ,
    bumpCutoff: { type:"f" , value:.5 } ,
    t_audio: G.t_audio

  }


  this.treeRenderParams = {

    normalScale:{ type:"f" , value:.3 } ,
    texScale: { type:"f" , value:.01 } ,

  }

}.bind( tree ));
// Need to load at least 1 thing
tree.addToInitArray( function(){
  
//  console.log('TREE INIT' );


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

  /*console.log('TREE START' );
  
  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

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
   
  var g = lightGui.add( lp.normalScale  , 'value' ).name( 'normalScale' );
  var g = lightGui.add( lp.texScale     , 'value' ).name( 'texScale' );


}.bind( tree ) );



tree.addToStartArray( function(){

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute:  85,
    beatsPerMeasure: 4,
    measuresPerLoop: 4

  });


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

    params.name = params.audio;

    params.radius = r;
    params.height = height;
    params.theta  = t;

    params.audio = G.AUDIO[ params.audio ];
    params.audio.reconnect( this.gain );

    new TreeLight( this , params );

  }


  for( var i =0 ; i < this.lights.length; i++ ){

    this.lights[i].select();

    //console.log( this.lights[i].name );
    if( 
      this.lights[i].name === 'treeMurmur1'
      
    ){

      this.lights[i].select();

    }

  }

}.bind( tree ) );


tree.addToStartArray( function(){
    
  var floorGeo =  new THREE.PlaneBufferGeometry( 5000 , 5000 , 100 , 100 );

  
  var floorMat = new THREE.ShaderMaterial({


    uniforms:{
      timer:G.timer,
      t_audio:G.t_audio,
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
      cameraPos:{ type:"v3" , value: G.camera.position },
      lightPos:{ type:"v3" , value: G.mani.position }
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
      t_audio:G.t_audio,
      t_iri:{ type:"t" , value: G.TEXTURES.iriTurq },
      normalScale:  this.treeRenderParams.normalScale,
      texScale:     this.treeRenderParams.texScale,
      lightCutoff:   this.lightParams.cutoff,
      lightPower:    this.lightParams.power,
      lightPositions: this.lightParams.positions,
      lightTextures: this.lightParams.textures,
      lightColors: this.lightParams.colors,
      lightPos:{type:"v3" , value:G.mani.position },
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

    //  console.log('HIT HIT HIT HIT' );

      this.maniAttractionLight = undefined;

      G.mani.iPlaneAttracting = true;


    }

  }



}.bind( tree ));


tree.addToDeactivateArray( function(){

  G.mani.iPlaneAttracting = true;
  this.maniAttractionLight = undefined;

  for( var i =0; i < this.lights.length; i++ ){

    G.objectControls.remove( this.lights[i] );

  }


}.bind( tree) );

tree.addToEndArray( function(){

  this.looper.end();

}.bind( tree) );



