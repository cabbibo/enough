var flocking = new Page( 'flocking' );

flocking.addToInitArray( function(){

  this.mani = true;
  this.sol  = false;
  
  // Position relative to previous page
  this.position.set(  2000 , -2000 , 0 );


  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  2000  , 2000 , 500 ) ,
    textChunk:TEXT.FLOCKING[0],
    
   fish: true 
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( -200 , 800 ,1400 )  ,
    textChunk:TEXT.FLOCKING[1],
    start:function(){

      for( var  i = 0; i < this.coral.length; i++ ){

        if( i == 1 ||  i == 3 ){
          this.coral[i].deactivate();
        }else{
          this.coral[i].activate();
        }

      }

    }.bind(this),
   fish: true 

  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  0 , 400 , 1000 ) ,
    textChunk:TEXT.FLOCKING[2],
    start:function(){
      G.tmpV3.set( 0 , 100 , 0 );
      G.iPlane.position.copy( this.page.position.clone().add(G.tmpV3 ));
      G.tmpV3.set( 0 , 101 , 0 )
      G.iPlane.lookAt( this.page.position.clone().add( G.tmpV3 ) );
    },
    transitionOut:function(){
      G.tmpV3.set( 0 ,  200 , 0 );
      G.iPlane.position.copy( this.page.position.clone().add(G.tmpV3 ));
      G.tmpV3.set( 0 , 209 , 0 )
      G.iPlane.lookAt( this.page.position.clone().add( G.tmpV3 ) )
    },
    start:function(){

      for( var  i = 0; i < this.coral.length; i++ ){

        if( i == 0 || i == 1 || i == 2 || i == 3 ){
          this.coral[i].activate();
        }else{
          this.coral[i].deactivate();
        }

      }

    }.bind(this),

   fish: true 
    
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(   500 , 1000 , 1000 ) ,
    textChunk:TEXT.FLOCKING[3], 
    start:function(){

      for( var  i = 0; i < this.coral.length; i++ ){

        this.coral[i].deactivate();
      }

    }.bind(this),

   fish: true 
    
  });
  
  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(   1000 , 2000 , 1000 ) ,
    textChunk:TEXT.FLOCKING[4], 
    start:function(){

      for( var  i = 0; i < this.coral.length; i++ ){

        
        if( i == 0 || i == 1 || i == 2 || i == 3 || i == 4 ){
          this.coral[i].activate();
        }else{
          this.coral[i].deactivate();
        }
      }

    }.bind(this),

   fish: true 
    
  });


  this.iPlaneDistance = 2000;

  this.audioArray = [
  
    'flocking1',
    'flocking2',
    'flocking3',
    'flocking4',
    'flocking5',
    'flocking6',
    'flocking7',
    'flocking8',
    'flocking9',
    'flocking10',

  ]

}.bind( flocking ) );


// Need to load at least 1 thing
flocking.addToInitArray( function(){
  
  var f = 'img/extras/';
  this.loadTexture( 'ribbon' , f + 'ribbon.png');
  var f = 'img/normals/';
  this.loadTexture( 'ribbonNorm' , f + 'ribbon.jpg');

var f = 'img/matcap/';
  this.loadTexture( 'matcapMetal' , f + 'metal.jpg');


  var f = 'audio/pages/flocking/';

  for( var i=0; i< this.audioArray.length; i++ ){

    var a = this.audioArray[i]
    this.loadAudio( a , f + a + '.mp3' );


  }


  var f = 'pages/flocking/';

  this.loadShader( 'flocking' , f + 'ss-flocking' , 'simulation' );
  this.loadShader( 'fish' , f + 'fs-fish'  , 'fragment' );
  this.loadShader( 'fish' , f + 'vs-fish'  , 'vertex' );
  this.loadShader( 'predatorDebug' , f + 'fs-predatorDebug' , 'fragment' );
  this.loadShader( 'predatorDebug' , f + 'vs-predatorDebug' , 'vertex' );
  this.loadShader( 'fishDebug' , f + 'fs-fishDebug'  , 'fragment' );
  this.loadShader( 'fishDebug' , f + 'vs-fishDebug'  , 'vertex' );
  this.loadShader( 'eel' , f + 'fs-eel' , 'fragment' );
  this.loadShader( 'eel' , f + 'vs-eel' , 'vertex' );
  this.loadShader( 'ribbon' , f + 'fs-ribbon'  , 'fragment' );
  this.loadShader( 'ribbon' , f + 'vs-ribbon'  , 'vertex' );

  //this.loadShader( 'tube' , f + 'fs-tube' , 'fragment' );
  //this.loadShader( 'tube' , f + 'vs-tube' , 'vertex' );

  this.loadShader( 'coralEmanator' , f + 'fs-coralEmanator' , 'fragment' );
  this.loadShader( 'coralEmanator' , f + 'vs-coralEmanator' , 'vertex' );

  this.loadShader( 'coralFloor' , f + 'fs-coralFloor' , 'fragment' );
  this.loadShader( 'coralFloor' , f + 'vs-coralFloor' , 'vertex' );

  this.loadShader( 'coralBase' , f + 'fs-coralBase' , 'fragment' );
  this.loadShader( 'coralBase' , f + 'vs-coralBase' , 'vertex' );

  this.loadShader( 'coral' , f + 'fs-coral' , 'fragment' );
  this.loadShader( 'coral' , f + 'vs-coral' , 'vertex' );




}.bind( flocking ) );


flocking.addToStartArray( function(){

  /*G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

  //G.iPlaneDistance = this.iPlaneDistance;
  
  G.iPlane.faceCamera = false;
  
  G.tmpV3.set( 0 , 200 , 0 );

  G.iPlane.position.copy( this.position.clone().add(G.tmpV3 ));
  G.tmpV3.set( 0 , 201 , 0 )
  G.iPlane.lookAt( this.position.clone().add( G.tmpV3 ) );

}.bind( flocking ));


flocking.addToStartArray( function(){


  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 77,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });

  for( var i = 0; i < this.audioArray.length; i++ ){

    var audio = G.AUDIO[ this.audioArray[i] ];
    audio.reconnect( this.gain );

    this.looper.everyLoop( function(){ this.play() }.bind( audio ) );

  }

  this.looper.start();


}.bind( flocking ) );


flocking.addToStartArray( function(){

  var coralPositions = [];

  for( var i = 0; i < this.audioArray.length; i++ ){

    var z = Math.sin( Math.PI * 2 * i / this.audioArray.length); 
    var x = Math.cos( Math.PI * 2 * i / this.audioArray.length);
    //(i / this.audioArray.length);
    coralPositions[ i ] = [
      x * 10, //(x-.5) * 20,
      ( Math.random() )+1,
      z * 10
    ]


  }
  this.coral = [];


  for( var i = 0; i < coralPositions.length; i++ ){

  // TODO: pull out into Coral.js
    var cp = coralPositions[i]
    var p = new THREE.Vector3( cp[0] , cp[1] , cp[2] );
    p.multiplyScalar( 50 );

    //console.log( p );
    var audio = G.AUDIO[ this.audioArray[i] ];
    var coral = new Coral( this , audio , p );  
    
    this.coral.push( coral );

    var base = new CoralBase( coral );
    coral.base = base;
    base.body.position.x = p.x;
    base.body.position.z = p.z;
    this.scene.add( base.body );

    coral.activate();
    
  }


  this.flock = new Flock( this.coral , {
    pos: this.scene.position,
    size:8
  });

  this.flock.activate( this.scene );

//  this.floor = new CoralFloor( this.coral );
 // this.scene.add( this.floor.body );
  /*var debugScene = this.flock.soul.createDebugScene();
  debugScene.scale.multiplyScalar( 20. );
  this.scene.add( debugScene );*/

}.bind( flocking ) );




flocking.addToAllUpdateArrays( function(){

  this.flock.update();
    
  for( var i = 0; i < this.coral.length; i++ ){
    this.coral[i].update();
  }


}.bind( flocking ));


flocking.addToDeactivateArray( function(){

  G.iPlane.faceCamera = true;

}.bind( flocking) );

flocking.addToEndArray( function(){

  this.looper.end();

}.bind( flocking) );


