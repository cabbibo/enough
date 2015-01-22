var together = new Page( 'together' );

together.addToInitArray( function(){

  this.text = [];
  this.textChunks = [];
  this.textChunks.push([

    "Mani now knew joy.",
    "","",
    "He danced with the creature, and that moment flowered into eternity. He watched her chase the dark away her simple radiance. Her presence compelled Mani, and he could feel even the night in his begin to fade.",
    "","",
    "She swayed with him, in the mists of the night, and Mani knew Truth."

  ].join("\n" ));

  this.textChunks.push([

    "Sol was her name, Mani knew. The way she shown  told him of a world filled with light, of a land without darkness or fear.",
    "","",
    "They continued circling each other in the twilight, until Sol motioned to Mani, and together they journeyed on."

  ].join("\n" ));


  this.position.set(  0 , 4000 , 0 );
  //this.cameraPos.set( 0 , 0 , 1000 );

  this.cameraPositions = [];

  this.cameraPositions.push( new THREE.Vector3(  0 , 0 , 3000 ) );
  this.cameraPositions.push( new THREE.Vector3(  0 , 0 , 1000 ) );

  this.cameraPos =  this.cameraPositions[0];


  this.iPlaneDistance = 1000;

  this.audioArray = [

    'hueBoy',
    'hueSparkles',
    'hueAngel'

  ]

}.bind( together ) );


// Need to load at least 1 thing
together.addToInitArray( function(){
  
  var f = 'img/iri/';
  this.loadTexture( 'wetwetwet' , f + 'comboWet.png');

  var f = 'audio/global/';

  for( var i=0; i< this.audioArray.length; i++ ){

    var a = this.audioArray[i]
    this.loadAudio( a , f + a + '.mp3' );


  }


}.bind( together ) );


together.addToStartArray( function(){

 /* G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( together ));


together.addToStartArray( function(){

  for( var i = 0; i < this.textChunks.length; i++ ){

    this.text.push( new PhysicsText( this.textChunks[i] )); 

  }

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


}.bind( together ) );


together.addToActivateArray( function(){


  //this.endMesh.add( this );
  this.text[0].activate();

  var offset = G.pageTurnerOffset;


  var callback = function(){

    this.text[0].kill( 10000 );

    var percentTilEnd = 1 - this.looper.percentOfLoop;
    var timeTilEnd = percentTilEnd * this.looper.loopLength;

    this.tweenCamera( this.cameraPositions[1] , timeTilEnd * 1000 , function(){

      this.text[1].activate();

      this.endMesh.add( this );


     }.bind( this ) );
  }.bind( this );

  this.transitionMesh1 = this.createTurnerMesh( offset , callback );
  this.scene.add( this.transitionMesh1 );

}.bind( together ));


together.addToAllUpdateArrays( function(){

  for( var i = 0; i < this.text.length; i++ ){
    this.text[i].update();
  }


}.bind( together ));


together.addToDeactivateArray( function(){
  this.text[1].kill();

}.bind( together) );

together.addToEndArray( function(){

  this.looper.end();

}.bind( together) );


