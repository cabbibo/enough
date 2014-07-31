var sparkles = new Page( 'sparkles' );

sparkles.textChunk = [

  "Because, in the end, what we do is create. We dream the wildest dreams, and try to make them a reality.",
  "","",
  "It doesn't matter what we use, all that matters is what we make.",
  "","",
  "The stories we tell. The myths we weave. The emotions we evoke.",
  "","",
  " All to help us be more present in the Real Time that is NOW."
].join("\n" );




sparkles.position.set(  0 , 0 , 0 );
sparkles.cameraPos.set( 0 , 0 , 1000 );
sparkles.iPlaneDistance = 1100


sparkles.audioArray = [
  'drums', 
  'perc', 
  'highs', 
  'synth1', 
  'synth2'
];

sparkles.audioArray = [
  'drums', 
  'hats', 
  'highSynth', 
  'lowSynth', 
  'vox'
];



// Need to load at least 1 thing
sparkles.addToInitArray( function(){
  
  var f = 'pages/sparkles/';

  this.loadShader( 'sparkles' , f + 'ss-sparkles' , 'simulation' );
  this.loadShader( 'sparkles' , f + 'vs-sparkles' , 'vertex'     );
  this.loadShader( 'sparkles' , f + 'fs-sparkles' , 'fragment'   );


  var f = 'audio/pages/sparkles/part2/';
  var f = 'audio/part1/';

  for( var i = 0; i < this.audioArray.length; i++ ){
  
    this.loadAudio( this.audioArray[i] , f + this.audioArray[i] + '.mp3' );

  }

}.bind( sparkles ) );


sparkles.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( sparkles ));


sparkles.addToStartArray( function(){
  //G.mani.deactivate();

  this.text = new PhysicsText( this.textChunk );

  this.sparkles = new Sparkles( this , 64 );

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 120,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });



  for( var i = 0;i < this.audioArray.length; i++ ){
 

    var audio = G.AUDIO[  this.audioArray[i] ];
    audio.reconnect( this.gain );

    this.looper.everyLoop( function(){ this.play() }.bind( audio ) );

  }

  this.looper.start();

}.bind( sparkles ) );


sparkles.addToActivateArray( function(){

  this.text.activate();

  this.sparkles.activate();


 // this.endMesh.add( this );

}.bind( sparkles ));


sparkles.addToActiveArray( function(){

  this.sparkles.update();
  this.text.update();

  this.position.x += 1.5;
  G.camera.position.x += 1.5;
  G.position.copy( this.position );
  G.camera.lookAt( this.position );//= 1000;



}.bind( sparkles ));


sparkles.addToDeactivateArray( function(){

  this.text.kill();

}.bind( sparkles) );


sparkles.addToEndArray( function(){

  this.looper.end();

}.bind( sparkles) );




