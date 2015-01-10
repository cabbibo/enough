var sparkles = new Page( 'sparkles' );


sparkles.addToInitArray( function(){

  this.text = [];
  this.textChunks = [];

  this.textChunks.push( [



    "In the end, this story is not actually about a small creature named Webby. It is not about trying to prove that the Internet is ready for people in this room to use as a platform. It has been ready for a long time.",

    "","",
 
    "It is about the fact that you, each and every one of you, can make beautiful experiences for others to see with just a URL."

  ].join("\n" ));

  this.textChunks.push([

    "They could be advertisements, they could be client work, but they could also be haikus, short sketches, and playful experiments.",
  "","",
 
  "What is important is not what they are, but what they do. The emotions they evoke, the feelings they create, and the ways in which they help us to fully experience the real time that is now. "

  ].join("\n" ));


  this.position.set(  1000 , 2000 , 1000 );

  this.cameraPositions = [];
  this.cameraPositions.push( new THREE.Vector3(  0 , 0 , 1000 ) );
  this.cameraPos =  this.cameraPositions[0];
  

  this.iPlaneDistance = 1100


  this.audioArray = [
    'hueBoy',
    'hueSparkles',
    'hueAngel',
    'hueHum',
    'hueMids'
  ];


  this.movementRate = 1.5;


}.bind( sparkles ) );





// Need to load at least 1 thing
sparkles.addToInitArray( function(){
  
  var f = 'pages/sparkles/';

  this.loadShader( 'sparkles' , f + 'ss-sparkles' , 'simulation' );
  this.loadShader( 'sparkles' , f + 'vs-sparkles' , 'vertex'     );
  this.loadShader( 'sparkles' , f + 'fs-sparkles' , 'fragment'   );


  var f = 'audio/global/';

  for( var i = 0; i < this.audioArray.length; i++ ){
  
    this.loadAudio( this.audioArray[i] , f + this.audioArray[i] + '.mp3' );

  }

}.bind( sparkles ) );


sparkles.addToStartArray( function(){

  /*G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( sparkles ));


sparkles.addToStartArray( function(){
  //G.mani.deactivate();

   for( var i = 0; i < this.textChunks.length; i++ ){

    this.text.push( new PhysicsText( this.textChunks[i] )); 

  }


  this.sparkles = new Sparkles( this , 64 );

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 122,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });



  for( var i = 0;i < this.audioArray.length; i++ ){
 

    var audio = G.AUDIO[  this.audioArray[i] ];
    audio.reconnect( this.gain );

    if( i == 0 || i == 1 ){
      
      audio.gain.gain.value = 1;

    }else{

      audio.gain.gain.value = 0;

    }

    this.looper.everyLoop( function(){ this.play() }.bind( audio ) );

  }


 this.looper.start();


}.bind( sparkles ) );


sparkles.addToActivateArray( function(){


  this.text[0].activate();
  var offset =  G.pageTurnerOffset;

  var callback = function(){

    this.text[0].kill();

    this.text[1].activate();

    this.endMesh.add( this );

  }.bind( this );

  this.transitionMesh1 = this.createTurnerMesh( offset , callback );

  this.scene.add( this.transitionMesh1 );
  

}.bind( sparkles ) );

sparkles.addToActivateArray( function(){


  this.sparkles.activate();
    
  for( var i = 0;i < this.audioArray.length; i++ ){

    console.log(this.audioArray[i]);
    var audio = G.AUDIO[  this.audioArray[i] ];
    audio.gain.gain.value = 1;

  }

 // this.endMesh.add( this );

}.bind( sparkles ));



sparkles.addToAllUpdateArrays( function(){


 
  this.sparkles.update();

  for( var i = 0; i < this.text.length; i++ ){

    this.text[i].update();

  }


}.bind( sparkles));

sparkles.addToActiveArray( function(){

  

  this.position.x += this.movementRate;
  G.camera.position.x += this.movementRate;
  G.position.copy( this.position );
  G.camera.lookAt( this.position );//= 1000;


}.bind( sparkles ));


sparkles.addToDeactivateArray( function(){

  this.text[1].kill();

}.bind( sparkles) );


sparkles.addToEndArray( function(){

  this.looper.end();
  this.sparkles.deactivate();

}.bind( sparkles) );




