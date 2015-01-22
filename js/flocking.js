var flocking = new Page( 'flocking' );

flocking.addToInitArray( function(){

  this.text = [];
  this.textChunks = [];
  this.textChunks.push([

    "Mani could not believe that he had been distracted by the sparkles. It was too much to bear. Too much to remember the love that he felt for his friends, that he felt for Sol. Around him the cold ribbons flocked, and thought there movement was soothing, he still felt despair he couldn't have before imagined."

  ].join("\n" ));

  this.textChunks.push([ 
    "Mani could not believe that he had been distracted by the sparkles. It was too much to bear. Too much to remember the love that he felt for his friends, that he felt for Sol. Around him the cold ribbons flocked, and though he found movement was soothing, he still felt an ultimate dispair."
  ].join("\n"));

  this.textChunks.push([ 
    "The small ribbons of light moved gently around Mani, but he could only imagine them as ghosts of his golden friends. As angelic as their song seemed, it was not enough, and Mani resigned himself to a well of sorrow",
    "","",
    "As Mani came to the realization that he would never find what he was missing, would never fill that void in his soul, he settled down on the floor beneath the fish, ready for the quiet to come, and waited."
  ].join("\n"));


  this.textChunks.push([ 
    "Mani could feel the darkness inch in around him, winding its icy grip around the deepest part of his being, and he lay, paralyzed with heartache.",
    "","",
    "In his final moments, Mani remembered fondly the crystals , tendrils and tree. He thought of Sol and her compassionate movements and  of his friends circling the glowing planets.  The ground found him and he sank slowly into a dreamless sleep."
  ].join("\n"));

 this.textChunks.push([ 
    "Then, as he began his descent into nothingness, Mani saw a sparkle.",
    "","",
    "At first he thought of it with disdain. It was sparkles distracted him, that had made him lose his first and only friends, but as more and more fell upon his melancholy form, he felt compelled to rise and follow."
  ].join("\n"));

  // Position relative to previous page
  this.position.set(  2000 , -2000 , 0 );
  
  
  this.cameraPositions = [];
  this.cameraPositions.push( new THREE.Vector3(  0 , 0 , 300 ) );
  this.cameraPositions.push( new THREE.Vector3(  0 , 200 , 300 ) );
  this.cameraPositions.push( new THREE.Vector3(  0 , 0 , 300 ) );
  this.cameraPos =  this.cameraPositions[0];



  this.iPlaneDistance = 1000;

  this.audioArray = [
  
    'flocking1',
    'flocking2',
    'flocking3',
    'flocking4',
    'flocking5',
    'flocking6',
    'flocking7',
    'flocking8',
    'flocking9',
    'flocking10',

  ]

}.bind( flocking ) );


// Need to load at least 1 thing
flocking.addToInitArray( function(){
  
  var f = 'img/extras/';
  this.loadTexture( 'ribbon' , f + 'ribbon.png');
  var f = 'img/normals/';
  this.loadTexture( 'ribbonNorm' , f + 'ribbon.jpg');

var f = 'img/matcap/';
  this.loadTexture( 'matcapMetal' , f + 'metal.jpg');


  var f = 'audio/pages/flocking/';

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

  //this.loadShader( 'tube' , f + 'fs-tube' , 'fragment' );
  //this.loadShader( 'tube' , f + 'vs-tube' , 'vertex' );

  this.loadShader( 'coralEmanator' , f + 'fs-coralEmanator' , 'fragment' );
  this.loadShader( 'coralEmanator' , f + 'vs-coralEmanator' , 'vertex' );




}.bind( flocking ) );


flocking.addToStartArray( function(){

  /*G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

  G.iPlaneDistance = this.iPlaneDistance;

  G.mani.activate();

}.bind( flocking ));


flocking.addToStartArray( function(){

   for( var i = 0; i < this.textChunks.length; i++ ){

    this.text.push( new PhysicsText( this.textChunks[i] )); 

  }

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 77,
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

  for( var i = 0; i < this.audioArray.length; i++ ){

    coralPositions[ i ] = [
      ( Math.random() - .5 )* 10,
      ( Math.random() - .5 )* 10,
      ( Math.random() - .5 )* 10
    ]


  }
  this.coral = [];


  for( var i = 0; i < coralPositions.length; i++ ){

  // TODO: pull out into Coral.js
    var cp = coralPositions[i]
    var p = new THREE.Vector3( cp[0] , cp[1] , cp[2] );
    p.multiplyScalar( 10 );

    console.log( p );
    var audio = G.AUDIO[ this.audioArray[i] ];
    var coral = new Coral( this , audio , p );  
    
    this.scene.add( coral.body );
    this.coral.push( coral );

    coral.deactivate();
  }


  this.flock = new Flock( this.coral , {
    size: 16
  });

  this.flock.activate( this.scene );

  /*var debugScene = this.flock.soul.createDebugScene();
  debugScene.scale.multiplyScalar( 20. );
  this.scene.add( debugScene );*/

}.bind( flocking ) );

flocking.addToActivateArray( function(){

  this.endMesh.add( this );
  this.text[0].activate();

}.bind( flocking ));


flocking.addToAllUpdateArrays( function(){

  this.flock.update();
    
  for( var i = 0; i < this.text.length; i++ ){

    this.text[i].update();

  }

  for( var i = 0; i < this.coral.length; i++ ){
    this.coral[i].update();
  }


}.bind( flocking ));


flocking.addToDeactivateArray( function(){

  this.text[0].kill();

}.bind( flocking) );

flocking.addToEndArray( function(){

  this.looper.end();

}.bind( flocking) );


