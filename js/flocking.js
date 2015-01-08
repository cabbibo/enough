var flocking = new Page( 'flocking' );

flocking.addToInitArray( function(){

  this.textChunk = [

    "Webby now knew joy. There was someone else like him.",
    "","",
    "Webby played with the creature for millions of render cycles. He had not realized how powerfully entertaining it was to experience high end graphics on the web. It felt like it finally gave his life purpose, no matter how simple the venture was.",
    "","",
    "But soon enough,  the other creature motioned to Webby, and flocking they journeyed on. "

  ].join("\n" );


  this.position.set(  0 , 2000 , 0 );
  this.cameraPos.set( 0 , 2000 , 300 );
  this.iPlaneDistance = 1000;

  this.audioArray = [

    'hueBoy',
    'hueSparkles',
    'hueAngel'

  ]

}.bind( flocking ) );


// Need to load at least 1 thing
flocking.addToInitArray( function(){
  
  var f = 'img/matcap/';
  this.loadTexture( 'matcapBlood' , f + 'metal.jpg');




  var f = 'audio/global/';

  for( var i=0; i< this.audioArray.length; i++ ){

    var a = this.audioArray[i]
    this.loadAudio( a , f + a + '.mp3' );


  }


  var f = 'pages/flocking/';

  this.loadShader( 'flocking' , f + 'ss-flocking' , 'simulation' );
  this.loadShader( 'fish' , f + 'fs-fish'  , 'fragment' );
  this.loadShader( 'fish' , f + 'vs-fish'  , 'vertex' );
  this.loadShader( 'predatorDebug' , f + 'fs-predatorDebug' , 'fragment' );
  this.loadShader( 'predatorDebug' , f + 'vs-predatorDebug' , 'vertex' );
  this.loadShader( 'fishDebug' , f + 'fs-fishDebug'  , 'fragment' );
  this.loadShader( 'fishDebug' , f + 'vs-fishDebug'  , 'vertex' );
  this.loadShader( 'eel' , f + 'fs-eel' , 'fragment' );
  this.loadShader( 'eel' , f + 'vs-eel' , 'vertex' );
  this.loadShader( 'ribbon' , f + 'fs-ribbon'  , 'fragment' );
  this.loadShader( 'ribbon' , f + 'vs-ribbon'  , 'vertex' );
  this.loadShader( 'tube' , f + 'fs-tube' , 'fragment' );
  this.loadShader( 'tube' , f + 'vs-tube' , 'vertex' );




}.bind( flocking ) );


flocking.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( flocking ));


flocking.addToStartArray( function(){

  this.text = new PhysicsText( this.textChunk );

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 122,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });

  for( var i = 0; i < this.audioArray.length; i++ ){

    var audio = G.AUDIO[ this.audioArray[i] ];
    audio.reconnect( this.gain );

    this.looper.everyLoop( function(){ this.play() }.bind( audio ) );

  }

  this.looper.start();


}.bind( flocking ) );


flocking.addToStartArray( function(){

  var coralPositions = [];

  for( var i = 0; i < 30; i++ ){

    coralPositions[ i ] = [
      ( Math.random() - .5 )* 100,
      ( Math.random() - .5 )* 100,
      ( Math.random() - .5 )* 100
    ]


  }
  this.coral = [];


  for( var i = 0; i < coralPositions.length; i++ ){

  // TODO: pull out into Coral.js
    var m = new THREE.Mesh( G.GEOS.icosahedron , G.MATS.normal );

    var p = coralPositions[i];
    m.position.x = p[0] * 10; 
    m.position.y = p[1] * 10; 
    m.position.z = p[2] * 10; 

    this.scene.add( m );

    this.coral.push( m );


  }


  this.flock = new Flock( this.coral );

  this.flock.activate( this.scene );

  var debugScene = this.flock.soul.createDebugScene();
  debugScene.scale.multiplyScalar( 20. );
  this.scene.add( debugScene );

}.bind( flocking ) );

flocking.addToActivateArray( function(){

  this.endMesh.add( this );
  this.text.activate();

}.bind( flocking ));


flocking.addToAllUpdateArrays( function(){

  this.flock.update();
  this.text.update();

}.bind( flocking ));


flocking.addToDeactivateArray( function(){

  this.text.kill();

}.bind( flocking) );

flocking.addToEndArray( function(){

  this.looper.end();

}.bind( flocking) );


