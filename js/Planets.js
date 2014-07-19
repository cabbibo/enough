var planets = new Page( 'planets' );

planets.planets = [];

planets.colorSchemes = [

  [ 
    'Loki',
    1,
    new THREE.Color( '#1157ff' ),
    new THREE.Color( '#00a4ff' ),
    new THREE.Color( '#5e2dff' ),
    new THREE.Color( '#00fff0' ),
    'halle',
    
  ],


  [ 
    'Friend1',
    3,
    new THREE.Color( '#fa0202' ),
    new THREE.Color( '#faef42' ),
    new THREE.Color( '#ff0000' ),
    new THREE.Color( '#ff7800' ),
    'main'
  ],

  [
    'Friend2',
    3,
    new THREE.Color( '#5f5fff' ),
    new THREE.Color( '#61a2ff' ),
    new THREE.Color( '#52fff4' ),
    new THREE.Color( '#78ffc7' ),
    'shuffle'
  ],

  [ 
    'Friend3',
    4,
    new THREE.Color( '#ffa400' ),
    new THREE.Color( '#ee3700' ),
    new THREE.Color( '#fce05e' ),
    new THREE.Color( '#ff70cc' ),
    'wood'
  ],

]

planets.audio = {};
var f = 'audio/credits/';
planets.audio.halle = planets.loadAudio( 'halle' , f + 'halle.mp3' );
planets.audio.main = planets.loadAudio( 'main' , f + 'main.mp3' );
planets.audio.water = planets.loadAudio( 'water' , f + 'water.mp3' );
planets.audio.wood = planets.loadAudio( 'wood' , f + 'wood.mp3' );
planets.audio.musik = planets.loadAudio( 'musik' , f + 'musik.mp3' );
planets.audio.shuffle = planets.loadAudio( 'shuffle' , f + 'shuffle.mp3' );

var f = 'pages/planets/';

planets.loadShader( 'spring' , f + 'vs-spring' , 'vs' );
planets.loadShader( 'spring' , f + 'vs-spring' , 'vs' );
planets.loadShader( 'lineRender' , f + 'vs-lineRender' , 'vs' );
planets.loadShader( 'lineRender' , f + 'fs-lineRender' , 'fs' );
planets.loadShader( 'iri' , f + 'vs-iri' , 'vs' );
planets.loadShader( 'iri' , f + 'fs-iri' , 'fs' );
planets.loadShader( 'jelly' , f + 'vs-jelly' , 'vs' );
planets.loadShader( 'jelly' , f + 'fs-jelly' , 'fs' );
planets.loadShader( 'planet' , f + 'vs-planet' , 'vs' );
planets.loadShader( 'planet' , f + 'fs-planet' , 'fs' );
planets.loadShader( 'text' , f + 'vs-text' , 'vs' );
planets.loadShader( 'text' , f + 'fs-text' , 'fs' );
planets.loadShader( 'tailSim'   , f + 'tailSim'   , 'ss' );
planets.loadShader( 'jellySim'  , f + 'jellySim'  , 'ss' );
planets.loadShader( 'textSim'  , f + 'textSim'  , 'ss' );


planets.addToStartArray( function(){

  var newPos = new THREE.Vector3( 0 , 0 , 1000 );
  G.camera.position = this.scene.position.clone().add( newPos );
  G.camera.lookAt( this.scene.position );

}.bind( planets ));

planets.addToStartArray( function(){

  this.center = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 10 , 0 ),
    new THREE.MeshNormalMaterial({side:THREE.DoubleSide})
  );

  G.scene.add( this.center );


  // TODO: MAKE THIS Part of Global
  this.lineGeo = createLineGeo();

  for( var i= 0; i< this.colorSchemes.length; i++ ){

    var bait = this.center.clone();
    bait.scale.multiplyScalar( 5.3 );
    //scene.add( bait );

    var c = this.colorSchemes[i];

    var numOf = c[1]; //+ Math.floor( Math.random() * 10 );

    var col1 = new THREE.Vector3( c[2].r , c[2].g , c[2].b );
    var col2 = new THREE.Vector3( c[3].r , c[3].g , c[3].b );
    var col3 = new THREE.Vector3( c[4].r , c[4].g , c[4].b );
    var col4 = new THREE.Vector3( c[5].r , c[5].g , c[5].b );

    var audio = this.audio[c[6]];
   // var file = '';
   // if( i == 0 ) file =  '../audio/you.mp3' 
    var planet = new Planet( this , c[0] ,  audio , col1 , col2 , col3 , col4 );

    this.planets.push( planet );

  }

}.bind( planets ));

planets.addToStartArray( function(){

  for( var i = 0; i < this.planets.length; i++ ){

    this.planets[i].audio.play();

  }


}.bind( planets ));

