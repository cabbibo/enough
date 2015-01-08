var credits = new Page( 'credits' );

credits.addToInitArray( function(){

  this.textChunk = [

    "                 Who could be so lucky?                      ",
    "","",
    "Who comes to a lake for water and sees the reflection of moon.",
  "","",

    "                         - Rumi                                 "

  ].join("\n" );

  this.textChunk2 = [

    "THANKS:","","",
    "Jaume Sanchez     Ricardo Cabello      Eddie Lee ",
    "Reza Ali     Robbie Tilton     Nicole Campos",
    "Julia Sills    Luke Ishmael   Alex Dotter"
  
  ].join("\n" );


  this.position.set(  0 , 1000 , 0 );
  this.cameraPos.set( 0 , 1000 , 1000 );
  this.iPlaneDistance = 1000;

  this.audioArray = [

    'hueBoy',
    'hueSparkles',
    'hueAngel'

  ]

}.bind( credits ) );


// Need to load at least 1 thing
credits.addToInitArray( function(){
  
  var f = 'img/iri/';
  this.loadTexture( 'wetwetwet1' , f + 'comboWet.png');

  var f = 'audio/global/';

  for( var i=0; i< this.audioArray.length; i++ ){

    var a = this.audioArray[i]
    this.loadAudio( a , f + a + '.mp3' );

  }


}.bind( credits ) );


credits.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( credits ));


credits.addToStartArray( function(){

  this.text = new PhysicsText( this.textChunk , { 
   offset: new THREE.Vector3( -200 , 150 , 0 ), 
  });
  this.text2 = new PhysicsText( this.textChunk2 , { 
   offset: new THREE.Vector3( -200 , 150 , 0 ), 
  });

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


}.bind( credits ) );


credits.addToActivateArray( function(){

 // this.endMesh.add( this );
  this.text.activate();

  var offset = new THREE.Vector3( 0 , -100 , 300 );

  var callback = function(){

    this.text.kill();

    this.text2.activate();

    //this.endMesh.add( this );

  }.bind( this );

  this.transitionMesh1 = this.createTurnerMesh( offset , callback );

  this.scene.add( this.transitionMesh1 );

}.bind( credits ));


credits.addToAllUpdateArrays( function(){

  this.text.update();
  this.text2.update();

}.bind( credits ));


credits.addToDeactivateArray( function(){

  this.text.kill();

}.bind( credits) );

credits.addToEndArray( function(){

  this.looper.end();

}.bind( credits) );


