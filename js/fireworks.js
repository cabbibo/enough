var fireworks = new Page( 'fireworks' );


fireworks.addToInitArray( function(){
 
  this.mani = true;
  this.sol  = true;

  this.position.set(  0 , -6000 , 0 )

  this.iPlaneDistance = 1100;


  this.audioArray = [
    'hueBoy',
    'hueSparkles',
    'hueAngel',
    'hueHum',
    'hueMids'
  ];


  
  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 1000 , 2000 ),
    lookPosition: new THREE.Vector3( 500 , 0 , 0 ),
    textChunk:TEXT.FIREWORKS[0],
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 500 , 1000 , 2200 ),
    textChunk:TEXT.FIREWORKS[1],
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( -500 , 2000 , 2200 ),
    textChunk:TEXT.FIREWORKS[2],
  });


}.bind( fireworks ) );





// Need to load at least 1 thing
fireworks.addToInitArray( function(){
 

  var f = 'pages/fireworks/';

  this.loadShader( 'firework' , f + 'ss-firework' , 'simulation' );
  this.loadShader( 'firework' , f + 'vs-firework' , 'vertex'     );
  this.loadShader( 'firework' , f + 'fs-firework' , 'fragment'   );

  this.loadShader( 'fireworkLine' , f + 'vs-fireworkLine' , 'vertex'     );
  this.loadShader( 'fireworkLine' , f + 'fs-fireworkLine' , 'fragment'   );

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





fireworks.addToStartArray( function(){
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
 




  //this.text3.distToCam.value = 400;
  //this.text3.offsetPos.value.set( -9 , 40 , 0 );


  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 122,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });


  this.fireworks = [];

  //console.log('WAS');
  //console.log( G );
  for( var i = 0;i < (this.audioArray.length*2); i++ ){
 

    var audio = G.AUDIO[  this.audioArray[i%this.audioArray.length]  ];
    audio.reconnect( this.gain );

    //console.log( audio );


    var t = (i / (this.audioArray.length*2) ) * 2 * Math.PI ;
   // var x = (((i+.5) / this.audioArray.length) - .5 ) * 200;

    var array = Math.toCart( 600 , t );
    var start = new THREE.Vector3()

    start.x =array[0];//( Math.random() - .7 ) * 1000;
    start.z =array[1];//( Math.random() - .3 ) * 1000;
    start.y = 100;

    var firework = new Firework( this ,{
      looper: this.looper,
      size: 32,
      audio: audio,
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



 
  for( var i = 0; i < this.fireworks.length; i++ ){

    this.fireworks[i].add();
    //this.scene.add( this.fireworks[i].base );
//    this.fireworks[i].randomExplosion();

  }

 // this.fireworks[0].randomExplosion();
  //this.fireworks.activate();
    
  for( var i = 0; i < this.audioArray.length; i++ ){

    //console.log(this.audioArray[i]);
    var audio = G.AUDIO[  this.audioArray[i] ];
    audio.gain.gain.value = 1;

  }

 // this.endMesh.add( this );

}.bind( fireworks ) );


fireworks.addToActivateArray( function(){

 
  G.iPlane.faceCamera = false;
  
  G.tmpV3.set( 0 , 100 , 0 );

  G.iPlane.position.copy( this.position.clone().add(G.tmpV3 ));
  G.tmpV3.set( 0 , 101 , 0 )
  G.iPlane.lookAt( this.position.clone().add( G.tmpV3 ) );

}.bind( fireworks ) );

fireworks.addToActivateArray( function(){


}.bind( fireworks ));


fireworks.addToAllUpdateArrays( function(){

    this.water.render();


}.bind( fireworks ));
fireworks.addToActiveArray( function(){

  for( var i=0; i < this.fireworks.length; i++ ){

    this.fireworks[i].update();

  }
  

  /*(this.position.x += this.movementRate;
  G.camera.position.x += this.movementRate;
  G.position.copy( this.position );
  G.camera.lookAt( this.position );//= 1000;*/


}.bind( fireworks ));


fireworks.addToDeactivateArray( function(){

  G.iPlane.faceCamera = true;
  

}.bind( fireworks) );


fireworks.addToEndArray( function(){

  this.looper.end();
//  this.fireworks.deactivate();

}.bind( fireworks) );




