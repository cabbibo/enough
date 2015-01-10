var sun = new Page( 'sun' );


sun.addToInitArray( function(){

  this.textChunk = [

    "Within a single moment, all of Mani's sorrow evaporated. The pulsing orb that lay before him was the thing that was missing. It sang, so full of light that even the, darkness which lay unyielding , seemed to dance.",
  "","",
  "Drawn by its sheer holiness, Mani began to approach the diety, examining every inch of its movement." 

  ].join("\n" );


  this.textChunk2 = [
    
    "He could not understand the beings size. Every wonder he had found, he had loved. But this was more than wonder. It was more than even reverence.",
  "","",
  "Mani felt for a gentle moment, that he had finally found Truth. The abyss ran from the light, and Mani towards it."

  ].join("\n" );

  this.textChunk3 = [
    
    "Further and further Mani swam, approaching the loving behemoth.",
    "","",
    "Its song now sang just for him, beckoning him inwards, welcoming him into its loving arms. Its voice told of understanding without bounds, of infinite compassion, and warmth that could not be extinguished."

  ].join("\n" );

  this.textChunk4 = [
    
     "Its song now sang just for him, beckoning him inwards, welcoming him into its loving arms. Its voice told of understanding without bounds, of infinite compassion, and warmth that could not be extinguished.",
    "","",
    "And with a nobility of intent Mani ascended."

  ].join("\n" );



  // Inside
  this.textChunk5 = [
     "The shell of the being was only"
  ].join("\n" );




  this.position.set(  10000 , 0 , 0 );
  
 // this.cameraPos.set( 10000 , 10100 , 000 );
  //this.cameraPos2 = new THREE.Vector3( 10000 , 10000 , 100 );
  this.cameraPos.set( -10000 , 0 , 0 );

  this.cameraPos2 = new THREE.Vector3( -6000 , 0 , 0 );
  this.cameraPos3 = new THREE.Vector3( -4000 , 0 , 0 );
  this.cameraPos4 = new THREE.Vector3( 10000 , 10000 , 6000 );
  
  this.iPlaneDistance = 1000;

  this.audioArray = [

    'sun1',
    'sun2',
    'sun3',
    'sun4',
    'sun5',
    'sun6',
    'sun7',

  ]

  this.audio = {};
  this.audio.array = [];


   var f = 'pages/sun/';

  this.loadShader( 'sun' , f + 'ss-sun' , 'simulation' );

  this.loadShader( 'sun' , f + 'vs-sun' , 'vertex' ); 
  this.loadShader( 'sun' , f + 'fs-sun' , 'fragment' ); 

    
}.bind( sun ) );


// Need to load at least 1 thing
sun.addToInitArray( function(){
  
  var f = 'img/matcap/';
  this.loadTexture( 'matcapMetal' , f + 'metal.jpg');

  var f = 'audio/pages/sun/'

  for( var i = 0; i < this.audioArray.length; i++ ){
    
    var name = this.audioArray[i];

    this.audio[ name ] = this.loadAudio( name , f + name + '.mp3' );
 
    this.audio[ name ].updateAnalyser = true;
    this.audio[ name ].updateTexture = true;

    this.audio.array.push( this.audio[ name ] );

  }


}.bind( sun ) );


sun.addToStartArray( function(){

  //G.position.copy( this.position );
  //G.camera.position.copy( this.cameraPos );
  //G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

  G.mani.activate();
  G.sol.activate();

}.bind( sun ));


sun.addToStartArray( function(){

  this.text = new PhysicsText( this.textChunk );
  this.text2 = new PhysicsText( this.textChunk2 );
  this.text3 = new PhysicsText( this.textChunk3 );
  this.text4 = new PhysicsText( this.textChunk4 );
  
  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 78,
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

sun.addToStartArray( function(){


  this.repelers = [];

   for(var i = 0; i < 50; i++ ){

      var mesh = new THREE.Mesh( G.GEOS.icosahedron, G.MATS.normal  );
      mesh.target   = new THREE.Vector3();//toCart( 12 , t , p );
      mesh.velocity = new THREE.Vector3();
      mesh.power    = new THREE.Vector3( 1 , 1 , 1);
      mesh.radius   = new THREE.Vector3( 1 , 1 , 1);
      mesh.scale.multiplyScalar( 10 );
      this.repelers.push( mesh );

      this.scene.add( mesh );

      mesh.position.x = (Math.random() - .5 ) * 2000;
      mesh.position.z = (Math.random() - .5 ) * 2000;
      mesh.position.y = (Math.random() - .5 ) * 2000;
      mesh.position.normalize();
      mesh.position.multiplyScalar( 4000 );

    }


  var mesh = new THREE.IcosahedronGeometry( 3000 , 6 ); 
  this.gem = new RepelerMesh( 'Parameters' , mesh , this.repelers , {

        
    vs: G.shaders.vs.sun,

    fs: G.shaders.fs.sun,

    soul:{

      repulsionPower:     { type:"f" , value: 1000000, constraints:[-300  , 0] },
      repulsionRadius:     { type:"f" , value:10000 , constraints:[ 0  , 1000] },
    },

    body:{
      //t_refl:{type:"t" , value:reflectionCube},
      //t_refr:{type:"t" , value:reflectionCube },
      custom1:{type:"f" , value:.9 , constraints:[ .8 , 1 ]},
      t_sem:{type:"t" , value: G.TEXTURES.matcapMetal }

    }

  }); 

  this.gem.soul.reset( this.gem.t_og.value );
  this.gem.toggle( this.scene );

  this.gem.debug( this.scene , 1 , 100 );

}.bind( sun ));



sun.addToActivateArray( function(){

  this.text.activate();
  
  
  // First section end
  var callback = function(){
    
    this.text.kill( 10000 );

    var percentTilEnd = 1 - this.looper.percentOfLoop;
    var timeTilEnd = percentTilEnd * this.looper.loopLength;

    // 1 --> 2 Transition
    this.tweenCamera( this.cameraPos2 , timeTilEnd * 1000 , function(){

      // Second section start
      this.text2.activate();
      
      // Second section end
      var callback = function(){

        this.text2.kill( 10000 );

        var percentTilEnd = 1 - this.looper.percentOfLoop;
        var timeTilEnd = percentTilEnd * this.looper.loopLength;


        // 2 --> 3 Transition
        this.tweenCamera( this.cameraPos3 , timeTilEnd * 1000 , function(){

          // Third Section start
          this.text3.activate();

          // third section end
          var callback = function(){
        
            this.text3.kill( 10000 );

            var percentTilEnd = 1 - this.looper.percentOfLoop;
            var timeTilEnd = percentTilEnd * this.looper.loopLength;

            this.tweenCamera( this.cameraPos4 , timeTilEnd * 1000 , function(){

              this.text4.activate();
              this.endMesh.add( this );

            }.bind( this ) );
          }.bind( this );


          var offset =  G.pageTurnerOffset;
          this.transitionMesh3 = this.createTurnerMesh( offset , callback );
          this.scene.add( this.transitionMesh3 );

        }.bind( this ) );
      }.bind( this );

      var offset =  G.pageTurnerOffset;
      this.transitionMesh2 = this.createTurnerMesh( offset , callback );
      this.scene.add( this.transitionMesh2 );

    }.bind( this ) );
  }.bind( this );

  var offset =  G.pageTurnerOffset;
  this.transitionMesh1 = this.createTurnerMesh( offset , callback );
  this.scene.add( this.transitionMesh1 );

}.bind( sun ));


sun.addToAllUpdateArrays( function(){

  this.text.update();
  this.text2.update();
  this.text3.update();
  this.text4.update();
  
  this.gem.update();

  for( var i = 0; i < this.repelers.length; i++ ){

    var a = G.audio.analyzer.array;
    
    var ind = i / ( 4 * this.repelers.length); 
    var fI = Math.floor( ind * G.audio.analyzer.array.length );
    var p = G.audio.analyzer.array[ fI ];

    //PARAMS.soul.aPower.value[i].x = p / 256;
    //var l = a.varlu

    this.repelers[i].power.x = p / 256; 

  }

}.bind( sun ));


sun.addToDeactivateArray( function(){

  this.text.kill();

}.bind( sun) );

sun.addToEndArray( function(){

  this.looper.end();

}.bind( sun) );


