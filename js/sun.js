var sun = new Page( 'sun' );


sun.addToInitArray( function(){

  this.text = [];
  this.textChunks = [];

  this.textChunks.push([

    "Within a single moment, all of Mani's sorrow evaporated. The pulsing orb that lay before him was the thing that was missing. It sang, so full of light that even the, darkness which lay unyielding , seemed to dance.",
  "","",
  "Drawn by its sheer holiness, Mani began to approach the diety, examining every inch of its movement." 

  ].join("\n" ));


  this.textChunks.push([
    
    "He could not understand the beings size. Every wonder he had found, he had loved. But this was more than wonder. It was more than even reverence.",
  "","",
  "Mani felt for a gentle moment, that he had finally found Truth. The abyss ran from the light, and Mani towards it."

  ].join("\n" ));

  this.textChunks.push([
    
    "Further and further Mani swam, approaching the loving behemoth.",
    "","",
    "Its song now sang just for him, beckoning him inwards, welcoming him into its loving arms. Its voice told of understanding without bounds, of infinite compassion, and warmth that could not be extinguished.",
    "","",
    "So inwards Mani went."

  ].join("\n" ));

  this.textChunks.push([
    
     "The inside of the beast was even more magnificent than its exterior. Finally Mani knew a world without darkness, and examined every inch of the shell that shielded him from the unknown.",
     "","",
     "The song continued and urged Mani towards its center. The shining essence of life lay before him and he yearned to be one with it, experience the world and the truths that lay beyond."

  ].join("\n" ));

    this.textChunks.push([
    
     "The soul of the creature reached out to embrace Mani, its loving tendrils moving with greatness and purpose.",
     "","",
     "They told him of a field, golden waves undulating in a sweet breeze, a blue sky. It told him of the wonders of taste and smell. The unadultered bliss of youth, and tender grace of aging. It sang of the overwhelming loss of heartbreak, and the sublime surrender of love.",
     "","",
      "Then, at that moment, of estatic epiphany, of Light Infinite, Mani saw a movement."

  ].join("\n" ));


  this.textChunks.push([
    
    "It was Sol!",
    "","",
    "She swam to him. And he towards her.",
    "","",
    "The being sang in the background of the world Beyond, urging Mani to return towards its arms. But there was Sol, so sweetly she swam, and Mani realized in that moment, that no golden fields of grass, no immaculate taste, could ever compare to sight of seeing her."

  ].join("\n" ));


  this.textChunks.push([

    "The two circled each other, as the deity calmly continued its chorus. It knew of their choice before they had even made it, and could tell that neither would choose to leave the other for the sake of the infinite.",
    "","",
    "They soon realized this too, and choose to turn away from the elegant essence of the creature and journey outwards."

  ].join("\n" ));







  this.position.set(  9000 , 0 , 0 );
  
 // this.cameraPos.set( 10000 , 10100 , 000 );
  //this.cameraPos2 = new THREE.Vector3( 10000 , 10000 , 100 );
 /* this.cameraPos.set( -10000 , 0 , 0 );

  this.cameraPos2 = new THREE.Vector3( -6000 , 0 , 0 );
  this.cameraPos3 = new THREE.Vector3( -4000 , 0 , 0 );
  this.cameraPos4 = new THREE.Vector3( 10000 , 10000 , 6000 );*/
 
  this.cameraPositions = [];

  this.cameraPositions.push( new THREE.Vector3(  0 , 0 , 1000 ) );
  this.cameraPositions.push( new THREE.Vector3(  -6000 , 0 , 0 ) );
  this.cameraPositions.push( new THREE.Vector3(  -4000 , 0 , 1000 ) );
  this.cameraPositions.push( new THREE.Vector3(   0 , 4000 , 4000 ) );

  this.cameraPos =  this.cameraPositions[0];

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

  this.loadShader( 'akira' , f + 'vs-akira' , 'vertex' ); 
  this.loadShader( 'akira' , f + 'fs-akira' , 'fragment' ); 

    
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

  for( var i = 0; i < this.textChunks.length; i++ ){
    this.text.push( new PhysicsText( this.textChunks[i] )); 
  }
  
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


  var mesh = new THREE.Mesh( new THREE.IcosahedronGeometry( 3000 , 6 )); 
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

  //this.gem.debug( this.scene , 1 , 100 );

  
  
  var mesh = new THREE.Mesh( new THREE.CubeGeometry( 3000 , 3000 , 3000 , 10,10,10 ));
  console.log( mesh );
  mesh.rotation.x = Math.PI / 2;
  mesh.rotation.y = -Math.PI / 4;
  mesh.rotation.z = Math.PI / 1.6;
  mesh.updateMatrix();
  this.akira = new RepelerMesh( 'Parameters' , mesh , this.repelers , {

        
    vs: G.shaders.vs.akira,
    fs: G.shaders.fs.akira,

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

  this.akira.soul.reset( this.akira.t_og.value );
  this.akira.toggle( this.scene );

  this.akira.body.scale.multiplyScalar( .05 );
  this.akira.debug( this.scene , 1 , 100 );

}.bind( sun ));



sun.addToActivateArray( function(){

  G.mani.transport( G.position );
  G.sol.transport( G.position );
  this.text[0].activate();
  
 
  console.log( 'text arctivarts' );
  // First section end
  var callback = function(){
    
    this.text[0].kill( 10000 );

    var percentTilEnd = 1 - this.looper.percentOfLoop;
    var timeTilEnd = percentTilEnd * this.looper.loopLength;

    // 1 --> 2 Transition
    this.tweenCamera( this.cameraPositions[1] , timeTilEnd * 1000 , function(){

      // Second section start
      this.text[1].activate();
      
      // Second section end
      var callback = function(){

        this.text[1].kill( 10000 );

        var percentTilEnd = 1 - this.looper.percentOfLoop;
        var timeTilEnd = percentTilEnd * this.looper.loopLength;


        // 2 --> 3 Transition
        this.tweenCamera( this.cameraPositions[2] , timeTilEnd * 1000 , function(){

          // Third Section start
          this.text[2].activate();

          // third section end
          var callback = function(){
        
            this.text[2].kill( 10000 );

            var percentTilEnd = 1 - this.looper.percentOfLoop;
            var timeTilEnd = percentTilEnd * this.looper.loopLength;

            this.tweenCamera( this.cameraPositions[3], timeTilEnd * 1000 , function(){

              this.text[3].activate();
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

  for( var i = 0; i < this.text.length; i++ ){
    this.text[i].update();
  }
  
  this.gem.update();
  this.akira.update();

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

  this.text[3].kill();

}.bind( sun) );

sun.addToEndArray( function(){

  this.looper.end();

}.bind( sun) );


