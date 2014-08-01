var planets = new Page( 'planets' );


planets.textChunk = [

  "   The joy Mani felt could not be described with mortal words. There was not just one more of him. There were Hundreds. The Lonliness that he had felt earlier in his journey had vanished, and the only thing left was comfort. Ecstasy.",
  "",
  "",
  "He watched the way they swam, following their iridescent wanderings. Although he had been to this place before, it somehow felt different. Each color a bit more defined, each star that much more bright.",
  "",
  "",
  "He still did not know why he had risen. Where his new found friends were going to. The darkness surrounding them was still overbearing, and stars did not do enough to make him forget it. But there, in that moment. They swam together, and that was enough."

].join("\n");


planets.position.set(  -1000 ,  2000 ,  -1000 );
planets.cameraPos.set( -1000 , 1000 , 0 );
planets.iPlaneDistance = Math.sqrt( 2000000 );

planets.planets = [];
planets.furryGroups = [];
planets.furryTails = [];

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

planets.addToInitArray( function(){
  
  var f = 'audio/pages/planets/';
  this.audio.halle   = this.loadAudio( 'halle' , f + 'halle.mp3' );
  this.audio.main    = this.loadAudio( 'main' , f + 'main.mp3' );
  this.audio.water   = this.loadAudio( 'water' , f + 'water.mp3' );
  this.audio.wood    = this.loadAudio( 'wood' , f + 'wood.mp3' );
  this.audio.musik   = this.loadAudio( 'musik' , f + 'musik.mp3' );
  this.audio.shuffle = this.loadAudio( 'shuffle' , f + 'shuffle.mp3' );

  var f = 'global/';

  this.loadShader( 'furryParticles' , f + 'vs-furryParticles' , 'vs' );
  this.loadShader( 'furryParticles' , f + 'fs-furryParticles' , 'fs' );
  this.loadShader( 'furryTail'      , f + 'vs-furryTail' , 'vs' );
  this.loadShader( 'furryTail'      , f + 'fs-furryTail' , 'fs' );
  this.loadShader( 'furryHead'      , f + 'vs-furryHead' , 'vs' );
  this.loadShader( 'furryHead'      , f + 'fs-furryHead' , 'fs' );
  this.loadShader( 'furryTailSim'   , f + 'furryTailSim' , 'ss' );
  this.loadShader( 'furryHeadSim'   , f + 'furryHeadSim' , 'ss' );

  var f = 'pages/planets/';
  
  this.loadShader( 'planet' , f + 'vs-planet' , 'vs' );
  this.loadShader( 'planet' , f + 'fs-planet' , 'fs' );

}.bind( planets) );


planets.addToStartArray( function(){

  
  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( planets ));

/*

   Creating Planets and Tails

*/

planets.addToStartArray( function(){


  this.center = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 10 , 0 ),
    new THREE.MeshNormalMaterial({side:THREE.DoubleSide})
  );


  this.scene.add( this.center );

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
    audio.reconnect( this.gain );

    var planet = new Planet( this , c[0] ,  audio , col1 , col2 , col3 , col4 );

    planet.position.x = (Math.random() - .5 ) * 1000;
    planet.position.z = (Math.random() - .5 ) * 1000;
    planet.position.y = 0;//G.iPlaneDis//(Math.random() - .5 ) * 1000;


    this.planets.push( planet );

    var f = new FurryGroup( this , c[0], audio , numOf, {
            
      center: this.center,
      bait: bait,
      color1: col1,
      color2: col2,
      color3: col3,
      color4: col4,

    });

    this.furryGroups.push( f );

    this.center.visible = false;

  }


  for( var i = 0; i < this.furryGroups.length; i++ ){

    this.furryGroups[i].updateBrethren();

  }

  for( var i = 0; i < this.furryTails.length; i++ ){

    var fT = this.furryTails[i];

    for( var j = 0; j < this.planets.length; j++ ){

      fT.addCollisionForce( this.planets[j].position , 100 );
      if( fT.type == this.planets[j].type ){
        fT.addDistanceForce( this.planets[j].position , .00004 );  
      }else{
        fT.addDistanceForce( this.planets[j].position , .00001 );
      }

    }
  
  }

}.bind( planets ));




/*

  Setting up audio
  TODO: Make into looper

*/
planets.addToStartArray( function(){

  this.looper = new Looper( G.audio , G.timer , {
  
    beatsPerMinute: 122,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });


  this.looper.everyLoop( function(){
    for( var i = 0; i < this.planets.length; i++ ){
      this.planets[i].audio.play();
    }
  }.bind( this ) );

   
  for( var i = 0; i < this.planets.length; i++ ){
    this.planets[i].updateAudio();
   }

  this.looper.start();
  


}.bind( planets ));


/*
 
   Text

*/
planets.addToStartArray( function(){

  
  var repelPosArray = [];
  
  for( var i =0; i < this.furryTails.length; i++ ){

    repelPosArray.push( this.furryTails[i].position );

  }

  for( var i = 0; i < this.planets.length; i++ ){

    repelPosArray.push( this.planets[i].position );

  }

  this.text = new PhysicsText( this.textChunk , {
    repelPositions:repelPosArray,
    distToCam: this.iPlaneDist 
  });

}.bind( planets ));


planets.addToStartArray( function(){


  for( var i = 0; i < this.furryTails.length; i++ ){

    var furryTail = this.furryTails[i];

    furryTail.position.x = ( Math.random() - .5 ) * 1000;
    furryTail.position.y = ( Math.random() - .5 ) * 1000;
    furryTail.position.z = ( Math.random() - .5 ) * 1000;
    
    furryTail.velocity.x = ( Math.random() - .5 ) * 1000;
    furryTail.velocity.y = ( Math.random() - .5 ) * 1000;
    furryTail.velocity.z = ( Math.random() - .5 ) * 1000;

    furryTail.activate();

  }

}.bind( planets ));


planets.addToAllUpdateArrays( function(){


  this.text.update();

  for( var i = 0; i < this.furryTails.length; i++ ){

    var furryTail = this.furryTails[i];
    furryTail.updateTail();

  }


  for( var i = 0; i < this.furryTails.length; i++ ){

    var furryTail = this.furryTails[i];
    furryTail.updatePhysics();

  }


}.bind( planets ) );


/*

   END BUTTON

*/

planets.addToActivateArray( function(){

  this.text.activate();
 
  this.endMesh.add( this );
 
}.bind( planets ));

planets.addToDeactivateArray( function(){

  this.text.kill();

}.bind( planets ));


planets.addToEndArray( function(){


  this.looper.end();

}.bind( planets ));

