var sparkles = new Page( 'sparkles' );


sparkles.addToInitArray( function(){

  this.mani = true;
  this.sol  = false;

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 ,1000 ),
    textChunk:TEXT.SPARKLES[0],
    //frameShown: false 
    transitionOut:function(){
      G.objectControls.remove( this.frame.toggleMesh );
    }
  });

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3( 0 , 0 , 995 ),
    transitionTime:500,
    textChunk:TEXT.SPARKLES[1],
    transitionIn:function( a ){


      this.cameraPosition.copy( G.camera.position );
      this.page.cameraPos.x =  G.camera.position.x;
      this.page.cameraPos.y =  G.camera.position.y;
      this.page.cameraPos.z =  G.camera.position.z
      this.lookPosition.copy( this.page.position );


      for( var i = 0;i < this.page.audioArray.length; i++ ){

        //console.log(this.page.audioArray[i]);
        var audio = G.AUDIO[  this.page.audioArray[i] ];

        if( i == 3 ){
          audio.fadeIn( 5 , 1 );
        }

      }

    },

    transitioningIn: function(){

      this.position.x     -= this.movementRate;
      G.camera.position.x -= this.movementRate;

          
    }.bind( this ),
    transitionOut:function(){
      G.objectControls.remove( this.frame.toggleMesh );
    }
    //frameShown: false 
    
   
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 ,990 ),
    transitionTime:500,
    textChunk:TEXT.SPARKLES[2],
    transitionIn:function( ){
      
      this.cameraPosition.copy( G.camera.position );
      this.page.cameraPos.x =  G.camera.position.x;
      this.page.cameraPos.y =  G.camera.position.y;
      this.page.cameraPos.z =  G.camera.position.z;
     // this.page.cameraPos.copy( G.camera.position );
      
      this.lookPosition.copy( this.page.position );

      for( var i = 0;i < this.page.audioArray.length; i++ ){

        console.log(this.page.audioArray[i]);
        var audio = G.AUDIO[  this.page.audioArray[i] ];

        if( i == 4 ){
          audio.fadeIn( 4 , 1 );
        }

      }


    },
    transitionOut:function(){
      G.objectControls.remove( this.frame.toggleMesh );
    },

    transitioningIn: function(){

      this.position.x     -= this.movementRate;
      G.camera.position.x -= this.movementRate;

          
    }.bind( this )
    //frameShown: false 
   
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 980 ),
    transitionTime:500,
    textChunk:TEXT.SPARKLES[3],
    transitionIn:function( ){
      
      this.cameraPosition.copy( G.camera.position );
      this.page.cameraPos.x =  G.camera.position.x;
      this.page.cameraPos.y =  G.camera.position.y;
      this.page.cameraPos.z =  G.camera.position.z;
     // this.page.cameraPos.copy( G.camera.position );
      
      this.lookPosition.copy( this.page.position );


    },
    transitionOut:function(){
      G.objectControls.remove( this.frame.toggleMesh );
    },

    transitioningIn: function(){

      this.position.x     -= this.movementRate;
      G.camera.position.x -= this.movementRate;

          
    }.bind( this )
   // frameShown: false 
   
  });

  this.position.set(  1000 , 2000 , 1000 );

  this.cameraPositions = [];
  this.cameraPositions.push( new THREE.Vector3(  0 , 0 , 1000 ) );
  this.cameraPos =  this.cameraPositions[0];
  

  this.iPlaneDistance = 1100


  this.audioArray = [
    'ohoh',
    'sparkleMelody1',
    'sparkleMelody2',
    'dolak',
    'penny',
  ];


  this.movementRate = 1.5;
  //this.movementRate = 0;


}.bind( sparkles ) );





// Need to load at least 1 thing
sparkles.addToInitArray( function(){
  
  var f = 'pages/sparkles/';

  this.loadShader( 'sparkles' , f + 'ss-sparkles' , 'simulation' );
  this.loadShader( 'sparkles' , f + 'vs-sparkles' , 'vertex'     );
  this.loadShader( 'sparkles' , f + 'fs-sparkles' , 'fragment'   );


  var f = 'audio/pages/sparkles/';

  for( var i = 0; i < this.audioArray.length; i++ ){
  
    this.loadAudio( this.audioArray[i] , f + this.audioArray[i] + '.mp3' );

  }

}.bind( sparkles ) );


sparkles.addToStartArray( function(){

  /*G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

  this.scene.remove( this.motes.body );
  G.iPlaneDistance = this.iPlaneDistance;

}.bind( sparkles ));


sparkles.addToStartArray( function(){
  //G.mani.deactivate();
  this.sparkles = new Sparkles( this , 64 );

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 91,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });



  for( var i = 0;i < this.audioArray.length; i++ ){
 

    var audio = G.AUDIO[  this.audioArray[i] ];
    audio.reconnect( this.gain );

    if( i == 0 || i == 1 || i == 2 ){
      
      audio.gain.gain.value = 1;

    }else{

      audio.gain.gain.value = 0;

    }

    this.looper.everyLoop( function(){ this.play() }.bind( audio ) );

  }


 this.looper.start();


}.bind( sparkles ) );



sparkles.addToActivateArray( function(){


  this.sparkles.activate();
    
  for( var i = 0;i < this.audioArray.length; i++ ){

   // console.log(this.audioArray[i]);
    var audio = G.AUDIO[  this.audioArray[i] ];
    //audio.gain.gain.value = 1;

  }

 // this.endMesh.add( this );

}.bind( sparkles ));



sparkles.addToAllUpdateArrays( function(){


 
  this.sparkles.update();


}.bind( sparkles));

sparkles.addToActiveArray( function(){
  

  this.position.x     += this.movementRate;
  G.camera.position.x += this.movementRate;
  G.position.copy( this.position );
  G.lookAt.copy( this.position );
  G.camera.lookAt( this.position );//= 1000;


}.bind( sparkles ));


sparkles.addToDeactivateArray( function(){

//  G.position.copy( this.position );
//  G.camera.lookAt( this.position );
}.bind( sparkles) );


sparkles.addToEndArray( function(){

  this.looper.end();
  this.sparkles.deactivate();

}.bind( sparkles) );




