var fireworks = new Page( 'fireworks' );


fireworks.addToInitArray( function(){

  this.textChunk = [

    "Mani and Sol slowly swam away from the creature. It sang to them as they retreated again into the darkness, lamenting its loss.",
  "","",
    "Like a small fire in the distance, whispered its goodbuys, leaving Sol and Mani to circle a seemingly lonesome lake. They're reflections kept them company, as they danced in the darkness, as they had danced in the light."

  ].join("\n" );

  this.textChunk2 = [

    "In front of them glorious fireworks rose above the shimmering surface. They're golden sparkles reminded Mani of the first sparkles he had seen, coming from the crystals.",    "","",
    "He remembered his lonliness, his confusion, as well as each wonder he had discovered. Even the lonely tree he circled was now firmly etched into his memory."

  ].join("\n" );



  this.textChunk3 = [

    "Even as the two spiraled together, Mani remembered the Golden Diety that had invited him towards the light. He thought, heart filled with meloncholy, that maybe he was mistaken. That maybe he should have learned what was True, and become one with life.",
    "","",
    "But next to him, Sol swam. In the distance the sparkles shimmered. The water glistened below then, and Mani realized, this was Enough."
    
  ].join("\n" );



  this.position.set(  00 , -3000 , 0 )
  this.cameraPos.set( 00 , -2010 , 2000 );
  this.cameraPos2 = new THREE.Vector3( 500 , -2010 , 2200 );
  this.cameraPos3 = new THREE.Vector3( -500 , 010 , 2200 );

  this.iPlaneDistance = 1100;


  this.audioArray = [
    'hueBoy',
    'hueSparkles',
    'hueAngel',
    'hueHum',
    'hueMids'
  ];


}.bind( fireworks ) );





// Need to load at least 1 thing
fireworks.addToInitArray( function(){
 

  var f = 'pages/fireworks/';

  this.loadShader( 'firework' , f + 'ss-firework' , 'simulation' );
  this.loadShader( 'firework' , f + 'vs-firework' , 'vertex'     );
  this.loadShader( 'firework' , f + 'fs-firework' , 'fragment'   );

  this.loadShader( 'water' , f + 'vs-water' , 'vertex'     );
  this.loadShader( 'water' , f + 'fs-water' , 'fragment'   );
  this.loadShader( 'mirror' , f + 'vs-mirror' , 'vertex'     );
  this.loadShader( 'mirror' , f + 'fs-mirror' , 'fragment'   );

  this.loadShader( 'fireworkBase' , f + 'vs-fireworkBase' , 'vertex'     );
  this.loadShader( 'fireworkBase' , f + 'fs-fireworkBase' , 'fragment'   );


  var f = 'audio/global/';

  for( var i = 0; i < this.audioArray.length; i++ ){
  
    this.loadAudio( this.audioArray[i] , f + this.audioArray[i] + '.mp3' );

  }


  this.loadTexture( 'normal_water' , 'img/normals/waternormals.jpg' );
  
}.bind( fireworks ) );


/*fireworks.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( fireworks ));*/


fireworks.addToStartArray( function(){

 // G.position.copy( this.position );
 // G.camera.position.copy( this.cameraPos );
 // G.camera.lookAt( this.position );//= 1000;*/

 // G.iPlaneDistance = this.iPlaneDistance;

  G.iPlane.faceCamera = false;
  
  G.tmpV3.set( 0 , 100 , 0 );

  G.iPlane.position.copy( this.position.clone().add(G.tmpV3 ));
  G.tmpV3.set( 0 , 101 , 0 )
  G.iPlane.lookAt( this.position.clone().add( G.tmpV3 ) );

}.bind( fireworks ));


fireworks.addToStartArray( function(){
  //G.mani.deactivate();

  G.mani.activate();
  G.sol.activate();

 // var h = 
  /*this.water  = new Water(this , 0);
  this.water.body.rotation.x = -Math.PI / 2;*/
  this.water  = new THREE.Mirror( G.renderer, G.camera, { clipBias: 0.3, textureWidth: G.windowSize.x * G.dpr.value, textureHeight:G.windowSize.y* G.dpr.value , color: 0x777777 } ); 
//console.log( this.water );
//  this.water.rotation.x = -Math.PI / 2;

  var g = new THREE.PlaneGeometry( 8000 , 5000 , 100 , 100 );
  this.mirrorMesh = new THREE.Mesh( g , this.water.material );
  this.mirrorMesh.add( this.water );
  this.mirrorMesh.rotateX( - Math.PI / 2 );
  this.mirrorMesh.position.y = -100;
 
  this.scene.add( this.mirrorMesh );

 // this.water.body.position.y = -320;
  //console.log( this.water.body );
 // this.scene.add( this.water );

  this.text   = new PhysicsText( this.textChunk );
  this.text2  = new PhysicsText( this.textChunk2 );
  this.text3  = new PhysicsText( this.textChunk3 );

  //this.text3.distToCam.value = 400;
  //this.text3.offsetPos.value.set( -9 , 40 , 0 );


  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 122,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });


  this.fireworks = [];

  console.log('WAS');
  console.log( G );
  for( var i = 0;i < (this.audioArray.length*2); i++ ){
 

    var audio = G.AUDIO[  this.audioArray[i%this.audioArray.length]  ];
    audio.reconnect( this.gain );

    console.log( audio );


    var t = (i / (this.audioArray.length*2) ) * 2 * Math.PI ;
   // var x = (((i+.5) / this.audioArray.length) - .5 ) * 200;

    var array = Math.toCart( 600 , t );
    var start = new THREE.Vector3()

    start.x =array[0];//( Math.random() - .7 ) * 1000;
    start.z =array[1];//( Math.random() - .3 ) * 1000;
    start.y = 100;

    var firework = new Firework( this ,{
      looper: this.looper,
      size: 64,
      audio: audio,
      vs: G.shaders.vs.firework,
      fs: G.shaders.fs.firework,
      ss: G.shaders.ss.firework,
      start: start,
    });

    audio.updateAnalyser = true;
    audio.updateTexture = true;
    this.fireworks.push( firework );
    /*if( i == 0 || i == 1 ){
      
      audio.gain.gain.value = 1;

    }else{

      audio.gain.gain.value = 0;

    }*/

    audio.gain.gain.value = 1;

    this.looper.everyLoop( function(){ this.play() }.bind( audio ) );

  }


 this.looper.start();




}.bind( fireworks ) );


fireworks.addToActivateArray( function(){

  
   var offset = new THREE.Vector3( 300 , -150 , -200 );
   var offset = G.pageTurnerOffset;
  
  var callback = function(){

    this.text.kill( 5000 );

    this.tweenCamera( this.cameraPos2 , 3000 , function(){

      this.text2.activate();

      var offset = new THREE.Vector3( 300 , -150 , -200 );
  
      var callback = function(){

        this.text2.kill( 5000 );

        this.tweenCamera( this.cameraPos3 , 3000 , function(){

          this.text3.activate();
          this.endMesh.add( this );

        }.bind( this ) );

      }.bind( this );

      this.transitionMesh2 = this.createTurnerMesh( offset , callback );
      this.scene.add( this.transitionMesh2 );

    }.bind( this ) );

  }.bind( this );

  this.transitionMesh1 = this.createTurnerMesh( offset , callback );
  this.scene.add( this.transitionMesh1 );


  this.text.activate();


    

}.bind( fireworks ) );

fireworks.addToActivateArray( function(){

  this.text.activate();

  for( var i = 0; i < this.fireworks.length; i++ ){

    this.fireworks[i].add();
    //this.scene.add( this.fireworks[i].base );
//    this.fireworks[i].randomExplosion();

  }

  this.fireworks[0].randomExplosion();
  //this.fireworks.activate();
    
  for( var i = 0; i < this.audioArray.length; i++ ){

    //console.log(this.audioArray[i]);
    var audio = G.AUDIO[  this.audioArray[i] ];
    audio.gain.gain.value = 1;

  }

 // this.endMesh.add( this );

}.bind( fireworks ));


fireworks.addToActiveArray( function(){

  //this.fireworks.update();
  this.text.update();
  this.text2.update();
  this.text3.update();
 
  for( var i=0; i < this.fireworks.length; i++ ){

    this.fireworks[i].update();

  }
  
  this.water.render();

  /*(this.position.x += this.movementRate;
  G.camera.position.x += this.movementRate;
  G.position.copy( this.position );
  G.camera.lookAt( this.position );//= 1000;*/


}.bind( fireworks ));


fireworks.addToDeactivateArray( function(){

  this.text.kill();
  G.iPlane.faceCamera = true;
  

}.bind( fireworks) );


fireworks.addToEndArray( function(){

  this.looper.end();
//  this.fireworks.deactivate();

}.bind( fireworks) );




