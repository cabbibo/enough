var sparkles = new Page( 'sparkles' );


sparkles.addToInitArray( function(){

  this.text = [];
  this.textChunks = [];

  this.textChunks.push( [

    "How glorious these shapes were. As they stoically drifted past him, Mani examined their infinitely precise textures. How Sol must love these objects! he thought, and turned to see the sense of wonder emanating from her being."

  ].join("\n" ));

  this.textChunks.push([

    "But Sol was not behind him, and his other friends were not behind her. There was just the floating hexagons, him, and the darkness.",
    "","",
    "Mani felt a sense of dread he never before imagined. Where could they have gone. He was sure that they had followed him, but here in the field of stars, they were no where to be scene."

  ].join("\n" ));

  this.textChunks.push([

    "The devastating weight of the abyss returned. Crashing over him like a wave of silence. He could have never comprehended this loneliness. Now that he had seen the beauty of his friends, to have lost them was too much.",
    "","",
    "He had to find them again! No matter what! So he flew onwards, praying that the direction he traveled in would lead him again to the warmth."

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

    var callback = function(){

      this.text[1].kill();
      this.text[2].activate();
    
      this.endMesh.add( this );

    }.bind( this );

    this.transitionMesh2 = this.createTurnerMesh( offset , callback );
    this.scene.add( this.transitionMesh2 );

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

  this.text[2].kill();

}.bind( sparkles) );


sparkles.addToEndArray( function(){

  this.looper.end();
  this.sparkles.deactivate();

}.bind( sparkles) );




