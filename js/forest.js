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


forest.position.set(  0 , 0 , 0 );
forest.cameraPos.set( 0 , 0 , 1000 );


forest.audioArray = [
  'bolloning1',
  'bolloning2',
  'bolloning3',
  
  'wait1',
  'wait2',
  'wait3',
  'wait4',
  
  'drumz1',
  'drumz2',
  'drumz3',
  'drumz4',
  'drumz5',
  'drumz6',
  'drumz7',
  'drumz8',
  'drumz9',
  'drumz10',
]

forest.audio = {};
forest.audio.array = [];


forest.shaderArray = [



]

forest.addToInitArray( function(){
  
  var f = 'audio/pages/forest/'

  for( var i = 0; i < this.audioArray.length; i++ ){
    
    var name = this.audioArray[i];

    this.audio[ name ] = this.loadedAudio( name , f + '.mp3' );

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

  var f = 'pages/forest';

  this.loadShader( 'forest' , f + 'ss-forest' , 'simulation' );

  this.loadShader( 'forest' , f + 'vs-forest' , 'vertex' ); 
  this.loadShader( 'forest' , f + 'fs-forest' , 'fragment' ); 

  this.loadShader( 'trunk'  , f + 'vs-trunk'  , 'vertex' ); 
  this.loadShader( 'trunk'  , f + 'fs-trunk'  , 'fragment' );

  this.loadShader( 'monome' , f + 'vs-monome' , 'vertex' );
  this.loadShader( 'monome' , f + 'fs-monome' , 'fragment' );

}.bind( forest ) );


forest.addToStartArray( function(){

  this.forest = new Forest(
  page
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



}.bind( forest ) );


