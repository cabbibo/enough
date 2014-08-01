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



sparkles.textChunk2 = [

  "Thank You.",
  "",
  " @Cabbibo"

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
  var f = 'audio/part2/';

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

    if( i == 0 || i == 1 || i == 3 ){
      audio.gain.gain.value = 1;

    }else{

      audio.gain.gain.value = 0;

    }

    this.looper.everyLoop( function(){ this.play() }.bind( audio ) );

  }


 this.looper.start();


}.bind( sparkles ) );


sparkles.addToActivateArray( function(){

  
  var mesh = new THREE.Mesh(
    G.pageTurner.markerGeometry,
    G.pageTurner.markerMaterial
  );

  mesh.hoverOver = function(){

    this.transitionMesh.material.color = G.pageTurner.hoverColor;

  }.bind( this );

   
  mesh.hoverOut = function(){

    this.transitionMesh.material.color = G.pageTurner.neutralColor;

  }.bind( this  );

    
  mesh.select = function(){

    this.text.kill( 3000 );

    var start = { val:1 }
    var end = { val:0 }
    
    this.endingTweenVal = start;

    var tween = new G.tween.Tween( start ).to( end , 10000 );
    
    this.text2 = new PhysicsText( this.textChunk2 );

    this.text2.distToCam.value = 400;
    this.text2.offsetPos.value.set( -10 , 40 , 0 );



    tween.onUpdate( function(t ){

      for( var i = 0;i < this.audioArray.length; i++ ){
 
        var audio = G.AUDIO[  this.audioArray[i] ];
        audio.gain.gain.value = 1 - t;

      }


    }.bind( this ));


    tween.onComplete(function(){

      this.text2.activate();

    }.bind( this));

    tween.start();

    this.scene.remove( this.transitionMesh );


  }.bind( this );
  
  
  mesh.position.copy( G.camera.position.relative );
  
  var forward  = new THREE.Vector3( 0 , 0 , -1 );
  forward.applyQuaternion( G.camera.quaternion );
  forward.normalize();
  forward.multiplyScalar( G.iPlaneDistance );

  //console.log( G.iPlaneDistance );
  mesh.position.add( forward );

  G.tmpV3.set( 150 , -150 , 0 );
  mesh.position.add(  G.tmpV3 );

  G.tmpV3.copy( mesh.position );
  mesh.lookAt( G.tmpV3.sub( forward ) );

  G.objectControls.add( mesh );
  
  
  
  
  this.scene.add( mesh );

  this.transitionMesh = mesh;
  

}.bind( sparkles ) );

sparkles.addToActivateArray( function(){

  this.text.activate();

  this.sparkles.activate();
    
  for( var i = 0;i < this.audioArray.length; i++ ){
 
    var audio = G.AUDIO[  this.audioArray[i] ];
    audio.gain.gain.value = 1;

  }

 // this.endMesh.add( this );

}.bind( sparkles ));


sparkles.addToActiveArray( function(){

  this.sparkles.update();
  this.text.update();

  this.position.x += 1.5;
  G.camera.position.x += 1.5;
  G.position.copy( this.position );
  G.camera.lookAt( this.position );//= 1000;


  if( this.text2 ){

    this.text2.update();

  }
}.bind( sparkles ));


sparkles.addToDeactivateArray( function(){

  this.text.kill();

}.bind( sparkles) );


sparkles.addToEndArray( function(){

  this.looper.end();
  this.sparkles.deactivate();

}.bind( sparkles) );




