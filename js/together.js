var together = new Page( 'together' );

together.addToInitArray( function(){

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3( 0 , 0 , 3000 ),
    transitionTime: 3000,
    textChunk:[
      "Mani now knew joy.",
      "","",
      "He danced with the creature, and that moment flowered into eternity. He watched her chase the dark away her simple radiance. Her presence compelled Mani, and he could feel even the night in his begin to fade.",
      "","",
      "She swayed with him, in the mists of the night, and Mani knew Truth."
    ].join("\n" ),
    
  });

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3( 0 , 0 , 1000 ),
    transitionTime: 3000,
    textChunk:[
      "Sol was her name, Mani knew. The way she shown  told him of a world filled with light, of a land without darkness or fear.",
    "","",
    "They continued circling each other in the twilight, until Sol motioned to Mani, and together they journeyed on."
    ].join("\n" ),
    
  });



  this.position.set(  0 , 4000 , 0 );

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


