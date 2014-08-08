var together = new Page( 'together' );

together.addToInitArray( function(){

  this.textChunk = [

    "Webby now knew joy. There was someone else like him.",
    "","",
    "Webby played with the creature for millions of render cycles. He had not realized how powerfully entertaining it was to experience high end graphics on the web. It felt like it finally gave his life purpose, no matter how simple the venture was.",
    "","",
    "But soon enough,  the other creature motioned to Webby, and together they journeyed on. "

  ].join("\n" );


  this.position.set(  0 , 0 , 0 );
  this.cameraPos.set( 0 , 0 , 1000 );
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

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( together ));


together.addToStartArray( function(){

  this.text = new PhysicsText( this.textChunk );

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


together.addToActivateArray( function(){

  this.endMesh.add( this );
  this.text.activate();

}.bind( together ));


together.addToAllUpdateArrays( function(){

  this.text.update();

}.bind( together ));


together.addToDeactivateArray( function(){

  this.text.kill();

}.bind( together) );

together.addToEndArray( function(){

  this.looper.end();

}.bind( together) );


