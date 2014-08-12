var tree = new Page( 'tree' );


tree.addToInitArray( function(){

  this.textChunk = [

    "By now Webby was growing tired.  He had been looking for answers forever, but still knew so little. Also, he felt lonely. Why, Webby wondered, were there no other creatures like him. There were so many spectacular technologies for creating space puppies like himself, so why had he not seen any?"

  ].join("\n" );

  this.textChunk2 = [

    "The haunting tree that stood before him mirrored the sadness Webby felt. There were amazing tools like Play Canvas, Verold, and Goo; beautiful tutorials by The Spite and Aerotwist. So WHY were people not creating 3D experiences for the web?",  
    "","",
    "He dejectedly chased the lights that moved around the tree, hoping their shininess would make him forget his loneliness. But even they could not quell the feeling that maybe 3D just wasn’t meant for the web. "

  ].join("\n" );


  this.textChunk3 = [

  "Webby was ready to give up. What was the point of his existence, if he was the only one?",
    "","",
  "What was the point of the Web if all the apathetic tweets and narcissistic posts were always 2D?",

  ].join("\n" );

  this.textChunk4 = [

    "Then, Webby heard a melody more sweet than he could imagine. A color more vibrant than he could comprehend. At first he didn’t understand, was this just another sparkling object, coming to remind him of his loneliness? Another page that seemed like it was 3D but actually only had parallax scrolling?",
    "","",
    "Or was it a creature, like him? A harbinger of the web to come? ",

  ].join("\n" );



  this.position.set(  0 , -3000 , 0 );
  this.cameraPos.set( 2000 , -2000 , 3000 );
  this.cameraPos2 = new THREE.Vector3( 1000 , -2200 , 2000 );
  this.cameraPos3 = new THREE.Vector3( -1000 , -2800 , 2000 );
  this.cameraPos4 = new THREE.Vector3( -3000 , -3000 , 100 );

  this.iPlaneDistance = 1000


  this.lights = [];

  this.lightParamArray = [
      
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
      color: new THREE.Vector3( .4 , .5 , .8 ),
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


  this.params = { 
    
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

  }


  this.treeRenderParams = {

    normalScale:{ type:"f" , value:.3 } ,
    texScale: { type:"f" , value:.01 } ,

  }

}.bind( tree ));
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
  this.text3 = new PhysicsText( this.textChunk3 );
  this.text4 = new PhysicsText( this.textChunk4 );

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

    console.log( this.lights[i].name );
    if( 
      this.lights[i].name === 'snare'       ||
      this.lights[i].name === 'glo'         ||
      this.lights[i].name === 'allRight'    ||
      this.lights[i].name === 'startingOver'  

    ){

      this.lights[i].select();

    }

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


  var offset = G.pageTurnerOffset;

  var callback = function(){

    this.text.kill( 10000 );

    var percentTilEnd = 1 - this.looper.percentOfLoop;
    var timeTilEnd = percentTilEnd * this.looper.loopLength;


    this.tweenCamera( this.cameraPos2 , timeTilEnd * 1000 , function(){

      this.text2.activate();

      var offset =  G.pageTurnerOffset;

      for( var i =0 ; i < this.lights.length; i++ ){

        if( this.lights[i].playing ){
          this.lights[i].select();
        }

        if( 
          this.lights[i].name === 'snare' ||
          //this.lights[i].name === 'startingOver' ||
          this.lights[i].name === 'lup' ||
         // this.lights[i].name === 'glo' ||
          this.lights[i].name === 'allRight' //||
          //this.lights[i].name === 'tongue' //||
          //this.lights[i].name === 'startingOver' ||
        ){
          this.lights[i].select();
        }

      }

      var callback = function(){

        this.text2.kill( 10000 );


        var percentTilEnd = 1 - this.looper.percentOfLoop;
        var timeTilEnd = percentTilEnd * this.looper.loopLength;


        this.tweenCamera( this.cameraPos3 , timeTilEnd * 1000 , function(){

          this.text3.activate();

          for( var i =0 ; i < this.lights.length; i++ ){

            if( this.lights[i].playing ){
              this.lights[i].select();
            }

            if( 
              //this.lights[i].name === 'snare' ||
             // this.lights[i].name === 'startingOver' ||
              this.lights[i].name === 'lup' ||
              this.lights[i].name === 'glo' ||
              this.lights[i].name === 'tongue' //||
              //this.lights[i].name === 'startingOver' ||
            ){
              this.lights[i].select();
            }

          }



          var offset =  G.pageTurnerOffset;

          var callback = function(){

            this.text3.kill( 10000 );

            var percentTilEnd = 1 - this.looper.percentOfLoop;
            var timeTilEnd = percentTilEnd * this.looper.loopLength;

            this.tweenCamera( this.cameraPos4 , timeTilEnd * 1000 , function(){

              G.sol.activate();
              this.text4.activate();
              for( var i =0 ; i < this.lights.length; i++ ){

                if( this.lights[i].playing ){
                  this.lights[i].select();
                }

                if( 
                  this.lights[i].name === 'snare' ||
                  //this.lights[i].name === 'startingOver' ||
                  this.lights[i].name === 'lup' ||
                  this.lights[i].name === 'glo' ||
                  //this.lights[i].name === 'allRight' ||
                  this.lights[i].name === 'game' ||
                  this.lights[i].name === 'tongue' //||
                  
                  //this.lights[i].name === 'startingOver' ||
                ){
                  this.lights[i].select();
                }

              }

              this.endMesh.add( this );


            }.bind( this ) );
          }.bind( this );

          this.transitionMesh3 = this.createTurnerMesh( offset , callback );
          this.scene.add( this.transitionMesh3 );

        }.bind( this ) );
      }.bind( this );

      this.transitionMesh2 = this.createTurnerMesh( offset , callback );
      this.scene.add( this.transitionMesh2 );

    }.bind( this ) );
  }.bind( this );

  this.transitionMesh1 = this.createTurnerMesh( offset , callback );
  this.scene.add( this.transitionMesh1 );


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
  this.text3.update();
  this.text4.update();

}.bind( tree ));


tree.addToDeactivateArray( function(){

  G.mani.iPlaneAttracting = true;
  this.maniAttractionLight = undefined;

  for( var i =0; i < this.lights.length; i++ ){

    G.objectControls.remove( this.lights[i] );

  }

  this.text4.kill();

}.bind( tree) );

tree.addToEndArray( function(){

  this.looper.end();

}.bind( tree) );



