var sun = new Page( 'sun' );


sun.addToInitArray( function(){

  this.textChunk = [

    "Webby now knew joy. There was someone else like him.",
    "","",
    "Webby played with the creature for millions of render cycles. He had not realized how powerfully entertaining it was to experience high end graphics on the web. It felt like it finally gave his life purpose, no matter how simple the venture was.",
    "","",
    "But soon enough,  the other creature motioned to Webby, and sun they journeyed on. "

  ].join("\n" );


  this.position.set(  3000 , 5000 , 0 );
  this.cameraPos.set( 3000 , 5000 , 1000 );
  this.iPlaneDistance = 1000;

  this.audioArray = [

    'sun1',
    'sun2',
    'sun3',
    'sun4',
    'sun5',
    'sun6',
    'sun7',
    'sun8',
    'sun9',
    'sun10',

  ]

  this.audio = {};
  this.audio.array = [];
    
}.bind( sun ) );


// Need to load at least 1 thing
sun.addToInitArray( function(){
  
  var f = 'img/iri/';
  this.loadTexture( 'wetwetwet' , f + 'comboWet.png');

  var f = 'audio/pages/sun/'

  for( var i = 0; i < this.audioArray.length; i++ ){
    
    var name = this.audioArray[i];

    console.log( name );
    console.log( this.audio );
    this.audio[ name ] = this.loadAudio( name , f + name + '.mp3' );
 
    this.audio[ name ].updateAnalyser = true;
    this.audio[ name ].updateTexture = true;

    this.audio.array.push( this.audio[ name ] );

  }


}.bind( sun ) );


sun.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( sun ));


sun.addToStartArray( function(){

  this.text = new PhysicsText( this.textChunk );

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


}.bind( sun ) );


sun.addToActivateArray( function(){

  this.endMesh.add( this );
  this.text.activate();

}.bind( sun ));


sun.addToAllUpdateArrays( function(){

  this.text.update();

}.bind( sun ));


sun.addToDeactivateArray( function(){

  this.text.kill();

}.bind( sun) );

sun.addToEndArray( function(){

  this.looper.end();

}.bind( sun) );


