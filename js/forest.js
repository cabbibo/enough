var forest = new Page( 'forest' );

forest.addToInitArray( function(){
  
  this.textChunk = [

    "After leaving the crystals, Webby swam through the darkness and came upon another beautiful play place. Here he found a soft garden full of metallic tendrils. As he swam through their flowing stalks, he listened to the soft plinks and hums that they created. He wondered how he could hear them, partially because it seemed like an impossible technological feat, but mostly because he still had no ears. "


  ].join("\n" );

  this.textChunk2 = [

    "Through his wondering, Webby remembered the brilliant work done by the W3C to create an API that allowed people to not only play sounds on the web, but also analyze their every movement. It didn’t really bother Webby that he couldn’t use an API because he didn’t have fingers, all that mattered was that he learned a bit more about what made him. "


  ].join("\n" );

  this.textChunk3 = [

    "But Webby craved more, and had a feeling that his time in this world was limited. He was right to think so, because there were only so many minutes until the presentation ended.",
  "","",
  "So Webby continued onwards, still searching. "

  ].join("\n" );




  this.position.set(  0 , 0 , -2500 );
  this.cameraPos.set( 0 , 0 , 1000 );

  this.cameraPos2 = new THREE.Vector3( 1000 , 1000 , 0 );
  this.cameraPos3 = new THREE.Vector3( -1000 , -1000 , 0 );


  this.iPlaneDistance = 1200


  this.audioArray = [
    'bolloning1',
    'bolloning2',
    'bolloning3',
    
    'wait1',
    'wait2',
    'wait3',
    'wait4',
    
    'drumz1',
    //'drumz2',
    //'drumz3',
    'drumz4',
    //'drumz5',
    //'drumz6',
    //'drumz7',
    //'drumz8',
    'drumz9',
    'drumz10',
    'synth1',
    'synth2',
    'synth3',
    'synth4',
    'synth5'
    //'weStand5',
  ]

  this.audio = {};
  this.audio.array = [];
  this.monomeMeshes = [];

}.bind( forest ) );

forest.addToInitArray( function(){
  
  var f = 'audio/pages/forest/'

  for( var i = 0; i < this.audioArray.length; i++ ){
    
    var name = this.audioArray[i];

    this.audio[ name ] = this.loadAudio( name , f + name + '.mp3' );
 
    this.audio[ name ].updateAnalyser = true;
    this.audio[ name ].updateTexture = true;

    this.audio.array.push( this.audio[ name ] );

  }


  var f = 'pages/forest/';

  this.loadShader( 'forest' , f + 'ss-forest' , 'simulation' );

  this.loadShader( 'forest' , f + 'vs-forest' , 'vertex' ); 
  this.loadShader( 'forest' , f + 'fs-forest' , 'fragment' ); 

  this.loadShader( 'forestFloor' , f + 'vs-forestFloor' , 'vertex' ); 
  this.loadShader( 'forestFloor' , f + 'fs-forestFloor' , 'fragment' ); 

  this.loadShader( 'trunk'  , f + 'vs-trunk'  , 'vertex' ); 
  this.loadShader( 'trunk'  , f + 'fs-trunk'  , 'fragment' );

  this.loadShader( 'monome' , f + 'vs-monome' , 'vertex' );
  this.loadShader( 'monome' , f + 'fs-monome' , 'fragment' );


  this.loadTexture( 'iri_comboWet' , 'img/iri/comboWet.png' );
  this.loadTexture( 'normal_moss' , 'img/normals/moss_normal_map.jpg' );

}.bind( forest ) );


forest.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = 1200;

}.bind( forest ));

forest.addToStartArray( function(){

  for( var i = 0; i < this.audio.array.length; i++ ){

    var audio = this.audio.array[i];
    audio.reconnect( this.gain );

  }

}.bind( forest) );

forest.addToStartArray( function(){

  var repelObjects    = [];
  var repelPositions  = [];
  var repelVelocities = [];
  var repelRadii      = [];
      
  for( var i = 0; i < 6; i++ ){

    var l = 10000000;
    repelPositions.push( new THREE.Vector3( l, l , l ) );
    repelVelocities.push( new THREE.Vector3( 0 , 0 , 0 ) );
    repelRadii.push( 0 );

  }

  repelPositions.push( G.mani.position.relative );
  repelVelocities.push( G.mani.velocity );
  repelRadii.push( 300 );


  repelPositions.push( G.iPoint.relative );
  repelVelocities.push( new THREE.Vector3() );
  repelRadii.push( 500 );


  repelPositions.push( G.lHand.relative );
  repelVelocities.push( new THREE.Vector3()  );
  repelRadii.push( 500 );

  repelPositions.push( G.rHand.relative  );
  repelVelocities.push( new THREE.Vector3()  );
  repelRadii.push( 500 );


  this.forest = new Forest(
  this,
  {
    position:new THREE.Vector3(),
    repelPositions: repelPositions,
    repelVelocities: repelVelocities,
    repelRadii: repelRadii,
    width: 2000,
    height: 2000,
    girth: 12.9,
    headMultiplier: 6.6,
    repelMultiplier:50,
    flowMultiplier:280,
    floatForce: 2000,
    springForce: 40,
    springDist: 10,
    maxVel: 1000,
    baseGeo: new THREE.IcosahedronGeometry(100 , 1 )
    //baseGeo: new THREE.CubeGeometry( 50 , 50 , 50, 10 , 10 , 10 )
  });

}.bind( forest ) );


forest.addToStartArray( function(){

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 280,
    beatsPerMeasure: 1,
    measuresPerLoop: 16

  });


  this.looper.forest = this.forest;
  this.looper.onNewMeasure = function(){
    this.forest.updateBases( this.relativeMeasure );
  };


  this.looper.start();

  this.text = new PhysicsText( this.textChunk );

  

  this.forest.bases[144].select();
  this.forest.bases[154].select();
  this.forest.bases[147].select();
 
  this.forest.bases[123].select();
  this.forest.bases[119].select();
  this.forest.bases[116].select();
  this.forest.bases[112].select();
  this.forest.bases[127].select();
  
  this.forest.bases[128].select();
  this.forest.bases[130].select();
  this.forest.bases[133].select();
  this.forest.bases[138].select();
  this.forest.bases[142].select();
  
  
  /*this.forest.bases[179].select();
  this.forest.bases[201].select();
  this.forest.bases[249].select();
  this.forest.bases[236].select();
  this.forest.bases[255].select();
  this.forest.bases[208].select();

  this.forest.bases[73].select();
  this.forest.bases[93].select();
  this.forest.bases[2].select();
  this.forest.bases[13].select();
  this.forest.bases[84].select();
  this.forest.bases[98].select();
  this.forest.bases[106].select();*/



  this.forest.activate();


  this.text = new PhysicsText( this.textChunk );
  this.text2 = new PhysicsText( this.textChunk2 );
  this.text3 = new PhysicsText( this.textChunk3 );

  
}.bind( forest ) );


forest.addToActivateArray( function(){

  var offset = G.pageTurnerOffset;
  
  var callback = function(){

    this.text.kill( 5000 );
    this.forest.bases[73].select();
    this.forest.bases[93].select();
    this.forest.bases[2].select();
    this.forest.bases[13].select();




    this.tweenCamera( this.cameraPos2 , 3000 , function(){



      this.text2.activate();

      var offset = G.pageTurnerOffset;
  
      var callback = function(){

        this.forest.bases[179].select();
        this.forest.bases[201].select();
        this.forest.bases[249].select();
        this.forest.bases[236].select();
        this.forest.bases[255].select();
        this.forest.bases[208].select();

        this.forest.bases[32].select();
        this.forest.bases[59].select();

        this.forest.bases[84].select();
        this.forest.bases[98].select();
        this.forest.bases[106].select();




        this.text2.kill( 5000 );

        this.tweenCamera( this.cameraPos3 , 3000 , function(){

          this.text3.activate();

          this.endMesh.add( this );

        }.bind( this ) );

      }.bind( this );

      this.transitionMesh2 = this.createTurnerMesh( offset , callback );
      this.scene.add( this.transitionMesh2 );

    }.bind( this ) );

  }.bind( this );

  this.transitionMesh1 = this.createTurnerMesh( offset , callback );
  this.scene.add( this.transitionMesh1 );





  this.text.activate();

}.bind( forest ));

forest.addToAllUpdateArrays( function(){

  this.forest.update();


  this.text.update();
  this.text2.update();
  this.text3.update();


}.bind( forest ));


forest.addToDeactivateArray( function(){

  this.text3.kill();

  //G.mani.removeAllForces();

}.bind( forest) );

forest.addToEndArray( function(){

  this.looper.end();

  for( var i = 0; i < this.monomeMeshes.length; i++ ){

    G.objectControls.remove( this.monomeMeshes[i] );

  }

}.bind( forest ));

