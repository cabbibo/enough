var forest = new Page( 'forest' );

forest.addToInitArray( function(){
   this.textChunks = [];
  this.text = []; 
  this.textChunks.push( [
    " After leaving the crystals, Mani swam through the darkness and came upon another beautiful play place. Here he found a soft garden full of metallic tendrils. As he swam through their flowing stalks, he listened to the soft plinks and hums that they created. Powerful as they were, they made way for his slender form, bowing out of his way as if he were royalty."


  ].join("\n" ));

  this.textChunks.push( [
    "Mani was mesmerized by their song. It felt old and wise, full of love and sadness. He tried to comprehend, and by doing so recognized his own loneliness. He loved the forest, and how it proclaimed its hymn to the darkness, but knew it could not fill the void he was beginning to feel in his heart."


  ].join("\n" ));

  this.textChunks.push( [

    "Mani almost envied the stalks that surrounded him.  They could not move like he could, and would never know the delight of the crystals, but still it seemed as though they had found some sort of purpose in they shimmering sanctuary. For them, to sing, no matter if others were listening, was enough.",
    "","",
    "For Mani it was not, so he continued onwards, yearning for more."

  ].join("\n" ));



 // this.position.set(  0 , 0 , -2500 );

  this.position.set(  500 , 2000 , -3900 );
  this.cameraPos.set( 0 , 0 , 1000 );

  this.cameraPositions = [];

  this.cameraPositions.push( new THREE.Vector3(  0 , 0 , 3500 ) );
  this.cameraPositions.push( new THREE.Vector3( 1000 , 1000 , 2500 ) );
  this.cameraPositions.push( new THREE.Vector3( -1000 , -1000 , 2500) );


  this.cameraPos =  this.cameraPositions[0];

  this.cameraPos2 = new THREE.Vector3( 1000 , 1000 , 0 );
  this.cameraPos3 = new THREE.Vector3( -1000 , -1000 , 0 );


  this.iPlaneDistance = 3000


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

/*  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

  G.iPlaneDistance = this.iPlaneDistance;

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

 // this.text = new PhysicsText( this.textChunk );

  

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


  for( var i = 0; i < this.textChunks.length; i++ ){

    console.log( this.textChunks[i] );
    this.text.push( new PhysicsText( this.textChunks[i] )); 

  }


  
}.bind( forest ) );


forest.addToActivateArray( function(){

  var offset = G.pageTurnerOffset;
  
  var callback = function(){

    this.text[0].kill( 5000 );
    this.forest.bases[73].select();
    this.forest.bases[93].select();
    this.forest.bases[2].select();
    this.forest.bases[13].select();




    this.tweenCamera( this.cameraPositions[1] , 3000 , function(){



      this.text[1].activate();

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




        this.text[1].kill( 5000 );

        this.tweenCamera( this.cameraPositions[2] , 3000 , function(){

          this.text[2].activate();

          this.endMesh.add( this );

        }.bind( this ) );

      }.bind( this );

      this.transitionMesh2 = this.createTurnerMesh( offset , callback );
      this.scene.add( this.transitionMesh2 );

    }.bind( this ) );

  }.bind( this );

  this.transitionMesh1 = this.createTurnerMesh( offset , callback );
  this.scene.add( this.transitionMesh1 );





  this.text[0].activate();




  G.iPlane.faceCamera = false;
  
  G.tmpV3.set( 0 , 0 , 450 );

  G.iPlane.position.copy( this.position.clone().add(G.tmpV3 ));
  G.tmpV3.set( 0 , 0 , 450 )
  G.iPlane.lookAt( this.position.clone().add( G.tmpV3 ) );

}.bind( forest ));

forest.addToAllUpdateArrays( function(){

  this.forest.update();
 
  for( var i = 0; i < this.text.length; i++ ){

    this.text[i].update();

  }




}.bind( forest ));


forest.addToDeactivateArray( function(){

  this.text[2].kill();
  G.iPlane.faceCamera = true;

  //G.mani.removeAllForces();

}.bind( forest) );

forest.addToEndArray( function(){

  this.looper.end();

  for( var i = 0; i < this.monomeMeshes.length; i++ ){

    G.objectControls.remove( this.monomeMeshes[i] );

  }

}.bind( forest ));

