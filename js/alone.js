var alone = new Page( 'alone' );

alone.addToInitArray( function(){
  
  this.textChunk = [

  "When Webby awoke, he had no idea where he was, or what he was for that matter.",
  "","",

  "For some reason though, he could remember the name ‘Khronos’. But that was just the beggning of the questions he had forthe strange new place he inhabited. Why was he here? Was there anything else like him?",
  "","",

  "Webby was worried he would never know the answers to these question , but was determined to find out more."

  ].join("\n" );


  this.textChunk2 = [

  "Webby was, after all, a poorly veiled reference to ‘The Web’ created for a SIGGRAPH presentation.",
   
    "","",

    "He had no idea of this, of course, considering that he just a bunch of pixels, but for some reason he still wanted to know where he came from, and what it took to get him here today."

  ].join("\n" );


  this.position.set(  0 , 0 , 0 );
  this.cameraPos.set( 0 , 0 , 1000 );
  this.cameraPos2 = new THREE.Vector3( 0 , 0 , 1500 );
  this.iPlaneDistance = 1000

}.bind( alone ) );

// Need to load at least 1 thing
alone.addToInitArray( function(){
  
  var f = 'audio/global/';

  this.audio =  this.loadAudio( 'hueSparkles' , f + 'hueSparkles.mp3' );

}.bind( alone ) );


alone.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( alone ));


alone.addToStartArray( function(){

  this.text = new PhysicsText( this.textChunk );
  this.text2 = new PhysicsText( this.textChunk2 );


  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 122,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });

  this.looper.everyLoop( function(){ this.play() }.bind( this.audio ) );

  this.audio.reconnect( this.gain );

  this.looper.start();


}.bind( alone ) );


alone.addToActivateArray( function(){

  this.text.activate();

  
  var offset = G.pageTurnerOffset;
  
  var callback = function(){

    this.text.kill( 5000 );

    this.tweenCamera( this.cameraPos2 , 1000 , function(){

      this.text2.activate();

      this.endMesh.add( this , G.pageTurnerOffset );

    }.bind( this ) );

  }.bind( this );

  this.transitionMesh1 = this.createTurnerMesh( offset , callback );
  this.scene.add( this.transitionMesh1 );


}.bind( alone ));


alone.addToAllUpdateArrays( function(){

  this.text.update();
  this.text2.update();

}.bind( alone ));


alone.addToDeactivateArray( function(){

  this.text2.kill();

}.bind( alone) );


alone.addToEndArray( function(){

  this.looper.end();

}.bind( alone ) );
