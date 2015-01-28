var planets = new Page( 'planets' );

planets.addToInitArray( function(){

  this.mani = true;
  this.sol  = true;

  this.planetGeo = new THREE.IcosahedronGeometry( 100 , 5 );
  
  this.position.set(  -1000 ,  2000 ,  -1000 );
 
  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  0 , 0 , 1000 ) ,
    textChunk:[
      "There wasn’t just one more of him. There was a myriad.",
      "","",
      "Mani had never felt so right for being so wrong. He would never be lonely again."
    ].join("\n" ), 
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 1000 , 0 , 500 ) ,
    textChunk:[
      "The creatures swam through the infinity together. It no longer mattered to Mani that he didn’t have the answers. It didn’t matter that he still surrounded by darkness. All that mattered was that he was here now, with the rest of his new found friends, finding pleasure in mysterious Eden they inhabited."
    ].join("\n" ), 
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( -1000 , 0 , 500 ),
    textChunk:[
      "Overjoyed Mani continued swimming. The chirps of his brethren were more satisfying than any he had know. He wanted to show them the forest, the crystals and the tree. He wanted to explore the unknown with his golden community.",
      "","",
      "In the distance he saw soft sparkles and motioned for his companions to follow him, triumphantly, to their next destination." 
    ].join("\n" ), 
  });






  this.iPlaneDistance = 1200;

  this.planets = [];
  this.furryGroups = [];
  this.furryTails = [];

  this.colorSchemes = [

    
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
      'Friend3',
        3,
      new THREE.Color( '#ff0000' ),
      new THREE.Color( '#ffd100' ),
      new THREE.Color( '#ffa400' ),
      new THREE.Color( '#ffc818' ),
      'wood'
    ],

    [ 
      'Loki',
      2,
      new THREE.Color( '#ff0000' ),
      new THREE.Color( '#f7b5b5' ),
      new THREE.Color( '#de0808' ),
      new THREE.Color( '#f78585' ),
      'halle',
      
    ],

    [
      'Friend2',
       3,
      new THREE.Color( '#ffa400' ),
      new THREE.Color( '#fff000' ),
      new THREE.Color( '#de9f07' ),
      new THREE.Color( '#ff8700' ),
      'shuffle'
    ],

  ]

  this.audio = {};

}.bind( planets ));


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

  
  /*G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

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


    planet.position.x =  -200 * ( this.colorSchemes.length - i );
    planet.position.z = 0;
    planet.position.y = (((i+.5)/this.colorSchemes.length) -.5) * 500;
//G.iPlaneDis//(Math.random() - .5 ) * 1000;


    this.planets.push( planet );
  G.renderer.render( G.scene , G.camera );

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
  G.renderer.render( G.scene , G.camera );
    

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

  /*
   
     TODO: PASS IN THIS TO TEXT CREATION

  for( var i = 0; i < this.textChunks.length; i++ ){

    this.text.push( new PhysicsText( this.textChunks[i],{
      repelPositions:repelPosArray,
      distToCam: this.iPlaneDist 
    })); 

  }

  */

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

  
  for( var i = 0; i < this.furryTails.length; i++ ){

    var furryTail = this.furryTails[i];
    furryTail.updateTail();

  }


  for( var i = 0; i < this.furryTails.length; i++ ){

    var furryTail = this.furryTails[i];
    furryTail.updatePhysics();

  }


}.bind( planets ) );

planets.addToDeactivateArray( function(){

  G.v1.set( -100000 , 0 , 0 );
  G.solAttractor.add( G.v1 );

}.bind( planets ));

planets.addToEndArray( function(){

  this.looper.end();
  G.sol.deactivate();

}.bind( planets ));

