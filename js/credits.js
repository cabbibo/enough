var credits = new Page( 'credits' );

credits.activateTail = function( n ){

  G.v1.copy( G.camera.position.relative );
  G.v2.set(
     Math.random() - .5  * 10,
     Math.random() - .5  * 10,
     -1000
  );
  G.v2.applyQuaternion( G.camera.quaternion );
  G.v1.add( G.v1 ); 
  
  this.furryTails[ n ].activate( G.v1 );
  //this.audio[n].gain.gain.value = .4;

}.bind( credits );

credits.addToInitArray( function(){

  this.mani = true;
  this.sol  = true;

  this.text = [];
  this.textChunks = [];




  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 1000 ),
    textChunk:[
      "Who could be so lucky? ",
      "","",
      "Who comes to a lake for water",
      "and sees the reflection of the moon.",
      "","",
      "                         - Rumi"
      ].join("\n" ),
    start:function(){

  
      for( var i = 0; i < this.page.audio.length; i++){
        if( i== 0 || i == 1 || i== 2 || i == 3 || i == 4 || i == 5 || i == 6 || i == 7 || i== 8 ){
          this.page.audio[i].gain.gain.value = .4
        }
      }

    } 
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 1100 ),
    textChunk:[
      "THANKS:","","",
      "Sally Visher  Joseph Cohen  Abe Cohen   Xochitl Garcia  Jaume Sanchez   Ricardo Cabello  West Langley  Ben Cerveny  Eddie Lee  Jono Brandel   Aki Rodic   Hugh Kennedy  Reza Ali  Robbie Tilton   Nicole Campos  Julia Sills  Luke Lannini  Alexandra Hay  Grant Marr   Erica Gibbons  Geoffery Logan  Leap"

    ].join("\n" ),

    start:function(){
     
      G.iPlaneDistance = 2000;
      
      for( var i = 0; i < this.furryTails.length; i++ ){
      
        this.activateTail( i );

        
        var fT = this.furryTails[i];
        fT.velocity.x = ( Math.random() - .5 ) * 200;
        fT.velocity.y = ( Math.random() - .5 ) * 200;
        fT.velocity.z = ( Math.random() - .5 ) * 200;

        fT.removeAllForces();

        if( i !== 0 ){
          fT.addDistanceForce( this.furryTails[i-1].position , .0004 );
        }else{
          fT.addDistanceForce( G.sol.position.relative, .004 );
        }

     

      }


    }.bind( credits ) 

  });


  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3( 0 , 0 , 1100 ),
    textChunk:[
      "THANKS:","","",
      "Holly Rubek Joan Sarratt  Jeff Belcher  Barb Murray  Andrew West  Malek Moazzam-Doulat   Kristi Upson-Saia  Dale Wright  Janet Scheel  Alec Schramm  Daniel Snowden-Ifft  Dennis Eggleston  Broderick Fox  George Schmiedeschoff "
    ].join("\n" ),
    
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 1200 ),
    textChunk:[
      "Songs Sampled:","","",
      "Susanna And The Magical Orchestra - Hallelujah",
      "Holy Other - We Over",
      "Tielsie - Hueboy ",
      "Susanna And The Magical Orchestra - These Days",
      "Luke Abbot - Modern Driveway",
      "The Rice Twins - For Penny and Alexis",
      "Typhoon - Starting Over",
      "Sigur Ros - All Alright",
      "Sigur Ros - Glosoli", 
    ].join("\n" ),
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 1200 ),
    textChunk:[
      "Infinite thanks to the three.js ,  , community, without which this wouldn't be possible."
    ].join("\n" ),
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 5200 ),
    textChunk:[
      "Thank You."
    ].join("\n" ), 
  });








  this.position.set(  0 , 2000 , 0 );

  this.iPlaneDistance = 1000;

}.bind( credits ) );


// Need to load at least 1 thing
credits.addToInitArray( function(){
  
  var f = 'img/iri/';
  this.loadTexture( 'wetwetwet1' , f + 'comboWet.png');

  var f = 'audio/global/';

   var f = 'audio/pages/friends/';

  // purposefully ordered!

  this.audio = [];
   
  this.friends = [];
  this.furryGroups = [];
  this.furryTails = [];

 
  this.choreography = [ 
    'plipPlop1',
    'plipPlop2',
    'melody3',
    'melody2',
    'melody4',
    'melody1',
    'melody5',
    'tenor',
    'bass',
    'shuffle',
    'atmosphere',
    'heartbeat',
    'burial'
  ];


  for( var i = 0; i < this.choreography.length  ; i++ ){

    var num = i+1;
    var file = f + this.choreography[i] +".mp3"

    this.audio.push( this.loadAudio( this.choreography[i] , file ) ) ;

  }
 
  var f = 'global/';

  this.loadShader( 'furryParticles' , f + 'vs-furryParticles' , 'vs' );
  this.loadShader( 'furryParticles' , f + 'fs-furryParticles' , 'fs' );
  this.loadShader( 'furryTail'      , f + 'vs-furryTail' , 'vs' );
  this.loadShader( 'furryTail'      , f + 'fs-furryTail' , 'fs' );
  this.loadShader( 'furryHead'      , f + 'vs-furryHead' , 'vs' );
  this.loadShader( 'furryHead'      , f + 'fs-furryHead' , 'fs' );
  this.loadShader( 'furryTailSim'   , f + 'furryTailSim' , 'ss' );
  this.loadShader( 'furryHeadSim'   , f + 'furryHeadSim' , 'ss' );

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

    beatsPerMinute: 96,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });

  for( var i = 0; i < this.choreography.length; i++ ){

    var audio = G.AUDIO[ this.choreography[i] ];
    audio.reconnect( this.gain );

    audio.gain.gain.value = 0;
    this.looper.everyLoop( function(){ this.play() }.bind( audio ) );

  }

  this.looper.start();

    this.center = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 10 , 0 ),
    new THREE.MeshNormalMaterial({side:THREE.DoubleSide})
  );


  //this.scene.add( this.center );

  for( var i= 0; i< this.choreography.length; i++ ){

    var bait = this.center.clone();
    bait.scale.multiplyScalar( 5.3 );
    //this.scene.add( bait );

    var col1 = new THREE.Vector3();
    var col2 = new THREE.Vector3();
    var col3 = new THREE.Vector3();
    var col4 = new THREE.Vector3();


    var color = new THREE.Color();

    color.setHSL( Math.pow( i/ this.choreography.length , 3. ) , 1. , .3 );

    var col = new THREE.Vector3( color.r , color.g , color.b );
    var col1 = col.clone().add(
       new THREE.Vector3( Math.random() * .6 , Math.random() * .6 , Math.random() * .6 )
    );

    var col2 = col.clone().add(
       new THREE.Vector3( Math.random() * .6 , Math.random() * .6 , Math.random() * .6 )
    );

    var col3 = col.clone().add(
       new THREE.Vector3( Math.random() * .6 , Math.random() * .6 , Math.random() * .6 )
    );

    var col4 = col.clone().add(
       new THREE.Vector3( Math.random() * .6 , Math.random() * .6 , Math.random() * .6 )
    );

    

    var audio = this.audio[i];
    audio.reconnect( this.gain );



   
    var f = new FurryGroup( this , this.choreography[i] , audio , 1, {
            
      center: this.center,
      bait: bait,
      color1: col1,
      color2: col2,
      color3: col3,
      color4: col4,

    });

    this.furryGroups.push( f );

    this.center.visible = false;
  //G.renderer.render( G.scene , G.camera );
    

  }



  for( var i = 0; i < this.furryGroups.length; i++ ){

    this.furryGroups[i].updateBrethren();

  }




}.bind( credits ) );

credits.addToAllUpdateArrays( function(){
 
  for( var i = 0; i < this.furryTails.length; i++ ){

    var furryTail = this.furryTails[i];
    furryTail.updateTail();

  }


  for( var i = 0; i < this.furryTails.length; i++ ){

    var furryTail = this.furryTails[i];
    furryTail.updatePhysics();

  }



}.bind( credits ) );

credits.addToEndArray( function(){

  this.looper.end();

}.bind( credits) );


