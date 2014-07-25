var forest = new Page( 'forest' );

forest.textChunk = [

  "Once upon a time, many moons ago, a small new creature names 'WebGL' was born.",
  "",
  "",
  "WebGL was a tenacious beast and grew quickly. Although he was at first tender and weak, he knew not what he was truly capable of.",
  "",
  "",
  " But first he had to wait, and bide his time.",


].join("\n" );



forest.position.set(  0 , 0 , -1600 );
forest.cameraPos.set( 0 , 0 , 0 );
forest.iPlaneDistance = 1200


forest.audioArray = [
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

forest.audio = {};
forest.audio.array = [];

forest.monomeMeshes = [];

forest.addToInitArray( function(){
  
  var f = 'audio/pages/forest/'

  for( var i = 0; i < this.audioArray.length; i++ ){
    
    var name = this.audioArray[i];

    this.audio[ name ] = this.loadAudio( name , f + name + '.mp3' );
  
    this.audio.array.push( this.audio[ name ] );

  }

  var f = 'global/';

  this.loadShader( 'furryParticles' , f + 'vs-furryParticles' , 'vs' );
  this.loadShader( 'furryParticles' , f + 'fs-furryParticles' , 'fs' );
  this.loadShader( 'furryTail'      , f + 'vs-furryTail' , 'vs' );
  this.loadShader( 'furryTail'      , f + 'fs-furryTail' , 'fs' );
  this.loadShader( 'furryHead'      , f + 'vs-furryHead' , 'vs' );
  this.loadShader( 'furryHead'      , f + 'fs-furryHead' , 'fs' );
  this.loadShader( 'furryTailSim'   , f + 'furryTailSim' , 'ss' );
  this.loadShader( 'furryHeadSim'   , f + 'furryHeadSim' , 'ss' );

  var f = 'pages/forest/';

  this.loadShader( 'forest' , f + 'ss-forest' , 'simulation' );

  this.loadShader( 'forest' , f + 'vs-forest' , 'vertex' ); 
  this.loadShader( 'forest' , f + 'fs-forest' , 'fragment' ); 

  this.loadShader( 'trunk'  , f + 'vs-trunk'  , 'vertex' ); 
  this.loadShader( 'trunk'  , f + 'fs-trunk'  , 'fragment' );

  this.loadShader( 'monome' , f + 'vs-monome' , 'vertex' );
  this.loadShader( 'monome' , f + 'fs-monome' , 'fragment' );

}.bind( forest ) );


forest.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = 1200;

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
  repelRadii.push( 200 );


  repelPositions.push( G.lHand.relative );
  repelVelocities.push( new THREE.Vector3()  );
  repelRadii.push( 200 );

  repelPositions.push( G.rHand.relative  );
  repelVelocities.push( new THREE.Vector3()  );
  repelRadii.push( 200 );


  this.forest = new Forest(
  this,
  {
    position:new THREE.Vector3(),
    repelPositions: repelPositions,
    repelVelocities: repelVelocities,
    repelRadii: repelRadii,
    width: 1000,
    height: 1000,
    girth: 2,
    headMultiplier: 8,
    repelMultiplier:50,
    flowMultiplier:400,
    floatForce: 100,
    springForce: 20,
    springDist: 5,
    maxVel: 100,
    baseGeo: new THREE.IcosahedronGeometry(50 , 1 )
    //baseGeo: new THREE.CubeGeometry( 50 , 50 , 50, 10 , 10 , 10 )
  });

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 280,
    beatsPerMeasure: 1,
    measuresPerLoop: 16

  });

 /* this.attractor = new THREE.Vector3();

  this.attracting = false;
  this.attractionTimer = 0;
 
  G.mani.addDistanceSquaredForce( this.attractor , 100 );*/


  this.looper.forest = this.forest;
  this.looper.onNewMeasure = function(){
    this.forest.updateBases( this.relativeMeasure );
  }


  this.text = new PhysicsText( this.textChunk );
  
  this.forest.activate();



}.bind( forest ) );

forest.addToActivateArray( function(){

  this.looper.start();
  this.text.activate();

}.bind( forest ));

forest.addToAllUpdateArrays( function(){

  this.forest.update();

}.bind( forest ));


forest.addToAllUpdateArrays( function(){


  this.text.update();

  /*if( this.attracting === true ){

    this.attractor.copy( G.iPoint );

  }

  if( (G.timer.value - this.attractionTimer ) > 2.5 ){
  
    this.attracting = true;

  }

  var d = G.mani.position.clone().sub( G.iPoint ).length();


  if( d < 5 ){

    var randVec = new THREE.Vector3();
    randVec.x = (Math.random() - .5 ) * 10000;
    randVec.y = (Math.random() - .5 ) * 10000;
    randVec.z = (Math.random() - .5 ) * 10000;
    this.attractor.copy( this.position );
    this.attractor.add( randVec );

    this.attracting = false;
    this.attractionTimer = G.timer.value

  }*/



}.bind( forest ));


forest.addToDeactivateArray( function(){

  this.text.kill();

  //G.mani.removeAllForces();

}.bind( forest) );

forest.addToEndArray( function(){

  this.looper.end();

}.bind( forest ));

