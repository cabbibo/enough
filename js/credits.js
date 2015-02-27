var credits = new Page( 'credits' );

credits.addToInitArray( function(){

  this.mani = true;
  this.sol  = false;

  this.text = [];
  this.textChunks = [];




  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 1000 ),
    textChunk:[
      "                 Who could be so lucky?                      ",
    "","",
    "Who comes to a lake for water and sees the reflection of moon.",
  "","",

    "                         - Rumi                                 "
    ].join("\n" ), 
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 1100 ),
    textChunk:[
      "THANKS:","","",
      "Jaume Sanchez   Ricardo Cabello   Eddie Lee  Reza Ali  Robbie Tilton  Nicole Campos  Julia Sills    Luke Ishmael   Alex Dotter   Andrew Benson   Grant Marr   Erica Gibbons  Andrew West   Kristi Upson-Saia   Malek   Dale Wright   George Schmiedeschoff  Sally Visher  Joseph Cohen    Abe Cohen   Xochitl Garcia   Luke Abbott   Holy Other   Tielsie  Susanna and the Magical Orchestra    Pantha Du Prince"
    ].join("\n" ), 
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 1200 ),
    textChunk:[
     "Extra Thanks goes to:"
    ].join("\n" ), 
  });






  this.position.set(  0 , 2000 , 0 );

  this.iPlaneDistance = 1000;

  this.audioArray = [

    'hueBoy',
    'hueSparkles',
    'hueAngel'

  ]

}.bind( credits ) );


// Need to load at least 1 thing
credits.addToInitArray( function(){
  
  var f = 'img/iri/';
  this.loadTexture( 'wetwetwet1' , f + 'comboWet.png');

  var f = 'audio/global/';

  for( var i=0; i< this.audioArray.length; i++ ){

    var a = this.audioArray[i]
    this.loadAudio( a , f + a + '.mp3' );

  }


}.bind( credits ) );


credits.addToStartArray( function(){

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( credits ));


credits.addToStartArray( function(){

  /*
  
     TODO make passable in section

  for( var i = 0; i < this.textChunks.length; i++ ){

    this.text.push( new PhysicsText( this.textChunks[i] , { 
      offset: new THREE.Vector3( -200 , 150 , 0 ), 
    } )); 

  }

  */

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


}.bind( credits ) );


credits.addToEndArray( function(){

  this.looper.end();

}.bind( credits) );


