var together = new Page( 'together' );

together.addToInitArray( function(){

  this.mani = true;
  this.sol  = true;

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3( -1000 , 0 , 400 ),
    
    transitionTime: 5000,
    textChunk:[
      "He danced with the creature, and that moment flowered into eternity. He watched her chase the dark away with her simple radiance.",
      "","",
      "Her presence compelled Mani, and he could feel the sadness in his soul begin to fade.",

    ].join("\n" ),
    
  });

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3( -500 , 0 , 400 ),
    lookPosition: new THREE.Vector3(  0 , 0 , 1900 ),
    
    transitionTime: 4000,
    textChunk:[
      "She swayed with him, in the mists of the night, and Mani felt joy.",
      "","",
      "There was so much to show her, and so much to learn."
    ].join("\n" ),
    
  });

  this.sectionParams.push({
    
    lookPosition: new THREE.Vector3(  0 , 0 , 1900 ),
    cameraPosition: new THREE.Vector3( -500 , 0 , 1000 ),
    transitionTime: 5000,
    textChunk:[
      "Sol was her name, Mani knew.",
      "","",
      "The way she shown told him of a world filled with light, a land without darkness or fear.",
    ].join("\n" ),
    
  });

    this.sectionParams.push({
   
    lookPosition: new THREE.Vector3(  0 , 0 , 900 ), 
    cameraPosition: new THREE.Vector3( -1000 , 0 , 200 ),
    transitionTime: 5000,
    textChunk:[
      "They continued circling each other in the twilight, until Sol motioned to Mani and together they journeyed on."
    ].join("\n" ),
    
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


