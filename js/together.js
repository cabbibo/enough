var together = new Page( 'together' );

together.addToInitArray( function(){

  this.mani = true;
  this.sol  = true;

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3( -1000 , 0 , 400 ),
    
    transitionTime: 5000,
    textChunk:TEXT.TOGETHER[0],
    
  });

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3( -500 , 0 , 400 ),
    lookPosition: new THREE.Vector3(  0 , 0 , 1900 ),
    
    transitionTime: 4000,
    textChunk:TEXT.TOGETHER[1],
    
  });

  this.sectionParams.push({
    
    lookPosition: new THREE.Vector3(  0 , 0 , 1900 ),
    cameraPosition: new THREE.Vector3( -500 , 0 , 1000 ),
    transitionTime: 5000,
    textChunk:TEXT.TOGETHER[2],
    
  });

    this.sectionParams.push({
   
    lookPosition: new THREE.Vector3(  0 , 0 , 900 ), 
    cameraPosition: new THREE.Vector3( -1000 , 0 , 200 ),
    transitionTime: 5000,
    textChunk:TEXT.TOGETHER[3],
    
  });


  this.position.set(  0 , 2000 , 0 );

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


  G.iPlaneDistance = this.iPlaneDistance;

}.bind( together ));


together.addToStartArray( function(){

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


together.addToEndArray( function(){

  this.looper.end();

}.bind( together) );


