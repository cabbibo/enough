var sparkles = new Page( 'sparkles' );


sparkles.addToInitArray( function(){

  this.mani = true;
  this.sol  = false;

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 ,1000 ),
    textChunk:[
      "How glorious these shapes were. As they stoically drifted past him, Mani examined their infinitely precise textures. How Sol must love these objects! he thought, and turned to see the sense of wonder emanating from her being."
    ].join("\n" ), 
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 ,900 ),
    transitionTime:1000,
    textChunk:[
      "But Sol was not behind him, and his other friends were not behind her. There was just the floating hexagons, him, and the darkness.",
      "","",
      "Mani felt a sense of dread he never before imagined. Where could they have gone. He was sure that they had followed him, but here in the field of stars, they were no where to be seen."
    ].join("\n" ),
    transitionIn:function(){

      console.log('TANSL');
      this.cameraPosition.copy( G.camera.position );
      this.page.cameraPos.x =  G.camera.position.x;
      this.page.cameraPos.y =  G.camera.position.y;
      this.page.cameraPos.z =  G.camera.position.z
      this.lookPosition.copy( this.page.position );
      //G.lookAt.copy( this.page.position );
     // G.camera.position.copy( this.page.position );
      //G.v1.set( 0 , 0 , 900 );
      //this.cameraPosition.add( G.v1 );

    }
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 ,1100 ),
    transitionTime:1000,
    textChunk:[
      "The devastating weight of the abyss returned. Crashing over him like a wave of silence. He could have never comprehended this loneliness. Now that he had seen the beauty of his friends, to have lost them was too much.",
      "","",
      "He had to find them again! No matter what! So he flew onwards, praying that the direction he traveled in would lead him again to the warmth."
    ].join("\n" ),
    transitionIn:function(){

      console.log('TANSL2');
      
      this.cameraPosition.copy( G.camera.position );
      this.page.cameraPos.x =  G.camera.position.x;
      this.page.cameraPos.y =  G.camera.position.y;
      this.page.cameraPos.z =  G.camera.position.z;
     // this.page.cameraPos.copy( G.camera.position );
      
      this.lookPosition.copy( this.page.position );


    }
  });

  this.position.set(  1000 , 2000 , 1000 );

  this.cameraPositions = [];
  this.cameraPositions.push( new THREE.Vector3(  0 , 0 , 1000 ) );
  this.cameraPos =  this.cameraPositions[0];
  

  this.iPlaneDistance = 1100


  this.audioArray = [
    'hueBoy',
    'hueSparkles',
    'hueAngel',
    'hueHum',
    'hueMids'
  ];


  this.movementRate = 1.5;


}.bind( sparkles ) );





// Need to load at least 1 thing
sparkles.addToInitArray( function(){
  
  var f = 'pages/sparkles/';

  this.loadShader( 'sparkles' , f + 'ss-sparkles' , 'simulation' );
  this.loadShader( 'sparkles' , f + 'vs-sparkles' , 'vertex'     );
  this.loadShader( 'sparkles' , f + 'fs-sparkles' , 'fragment'   );


  var f = 'audio/global/';

  for( var i = 0; i < this.audioArray.length; i++ ){
  
    this.loadAudio( this.audioArray[i] , f + this.audioArray[i] + '.mp3' );

  }

}.bind( sparkles ) );


sparkles.addToStartArray( function(){

  /*G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( sparkles ));


sparkles.addToStartArray( function(){
  //G.mani.deactivate();
  this.sparkles = new Sparkles( this , 64 );

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 122,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });



  for( var i = 0;i < this.audioArray.length; i++ ){
 

    var audio = G.AUDIO[  this.audioArray[i] ];
    audio.reconnect( this.gain );

    if( i == 0 || i == 1 ){
      
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

    console.log(this.audioArray[i]);
    var audio = G.AUDIO[  this.audioArray[i] ];
    audio.gain.gain.value = 1;

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




