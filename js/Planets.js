var planets = new Page( 'planets' );

planets.colorSchemes = [

  [ 
    'Loki',
    1,
    new THREE.Color( '#1157ff' ),
    new THREE.Color( '#00a4ff' ),
    new THREE.Color( '#5e2dff' ),
    new THREE.Color( '#00fff0' ),
    
  ],


  [ 
    'Friend1',
    3,
    new THREE.Color( '#fa0202' ),
    new THREE.Color( '#faef42' ),
    new THREE.Color( '#ff0000' ),
    new THREE.Color( '#ff7800' ),
  ],

  [
    'Friend2',
    3,
    new THREE.Color( '#5f5fff' ),
    new THREE.Color( '#61a2ff' ),
    new THREE.Color( '#52fff4' ),
    new THREE.Color( '#78ffc7' ),
  ],

  [ 
    'Friend3',
    4,
    new THREE.Color( '#ffa400' ),
    new THREE.Color( '#ee3700' ),
    new THREE.Color( '#fce05e' ),
    new THREE.Color( '#ff70cc' ),
  ],

]


planets.loadAudio( 'test' , 'audio/planets-test.mp3' );


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
    new THREE.IcosahedronGeometry( 3000 , 0 ),
    new THREE.MeshNormalMaterial({side:THREE.DoubleSide})
  );

  G.scene.add( this.center );

}.bind( planets ));
