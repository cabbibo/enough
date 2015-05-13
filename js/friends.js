var friends = new Page( 'friends' );

friends.activateTail = function( n ){

  G.v1.copy( G.camera.position.relative );
  G.v2.set(
     Math.random() - .5  * 500,
     Math.random() - .5  * 500,
     200
  );
  G.v2.applyQuaternion( G.camera.quaternion );
  G.v1.add( G.v2 ); 
   
  this.furryTails[ n ].activate( G.v1 );
  this.audio[n].gain.gain.value = .4;

}.bind( friends );

friends.addToInitArray( function(){

  this.mani = true;
  this.sol  = true;

  
  this.position.set(  -1000 ,  2000 ,  -1000 );
 

this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  0 , 0 , 2000 ) ,
    textChunk:TEXT.FRIENDS[0],
   start:function(){

       this.activateTail( 1 );
       this.activateTail( 0 );

      for( var i = 0; i < this.furryTails.length; i++ ){

        var fT = this.furryTails[i];
        //console.log('FT');
        //console.log( fT );

        for( var j = 0; j < fT.brethren.length; j++ ){

          //console.log('adds ');

          //console.log( fT.brethren[j].position );
          fT.addSpringForce( fT.brethren[j].position , .008 , 300 );
        }

        fT.addSpringForce( G.mani.position.relative , .004 , 100 );

      
      }


   }.bind(friends)

});

this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  0 , 0 , 1000 ) ,
    textChunk:TEXT.FRIENDS[1],

             
     
});

this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  0 , 0 , 1300 ) ,
    textChunk:TEXT.FRIENDS[2],
   start:function(){
             
       this.activateTail( 2 );
   }.bind( friends )
             
     
});

this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  0 , 0 , 1600 ) ,
    textChunk:TEXT.FRIENDS[3],
   start:function(){
       this.activateTail( 3 );
       this.activateTail( 4 );
   }.bind(friends)
});

this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  0 , 0 , 1900 ) ,
    textChunk:TEXT.FRIENDS[4],
   start:function(){

     this.activateTail( 5 );
     this.activateTail( 6 );

   }.bind(friends)
});

this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  0 , 0 , 3300 ) ,
    textChunk:TEXT.FRIENDS[5],
   start:function(){
     this.activateTail( 7 );
     this.activateTail( 8 );
     this.activateTail( 9 ); 
   }.bind(friends)
});

this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  0 , 0 , 3500 ) ,
    textChunk:TEXT.FRIENDS[6],
});



  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 500 , 0 , 2500 ) ,
    textChunk:TEXT.FRIENDS[7],


   start:function(){

     this.activateTail( 10 );   
     this.activateTail( 11 );

      G.iPlaneDistance = 1000;

      for( var i = 0; i < this.furryTails.length; i++ ){

        var fT = this.furryTails[i];

        for( var j = 0; j < fT.brethren.length; j++ ){

          fT.addSpringForce( fT.brethren[j].position , .0008 , 5000 );
        }

        fT.addSpringForce( G.mani.position.relative , .00004 , 1000 );

      
      }

     /* for( var i = 0; i < this.furryTails.length; i++ ){

        var fT = this.furryTails[i];
        fT.removeAllForces();

        var other = Math.floor( Math.random() * i );
        if( i == other ){

          other = 1-i

        }

        for( var j = 0; j < fT.brethren.length; j++ ){


          fT.addNormalForce( fT.brethren[j].position , -10.5 );
        }


        if( i !== 0 ){
          fT.addDistanceForce( this.furryTails[ other ].position , .004 );
          fT.addDistanceForce( G.sol.position.relative, .004 );
          
        }else{
          fT.addDistanceForce( G.sol.position.relative, .004 );
        }

     

      }*/


    }.bind( friends )


  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 500 , 0 , 2500 ),
    lookPosition: new THREE.Vector3( 1000 , 0 , 0 ),
   // lookAtPosition: new THREE.Vector3( 1000 , 0 , 0 ),

    
    textChunk:TEXT.FRIENDS[8],

    
    
    start:function(){
      
      this.activateTail( 12 );
      G.iPlaneDistance = 2000;
      for( var i = 0; i < this.furryTails.length; i++ ){

        var fT = this.furryTails[i];
        fT.removeAllForces();

        if( i !== 0 ){
          fT.addSpringForce( this.furryTails[i-1].position , .0004, 200 );
        }else{
          fT.addSpringForce( G.sol.position.relative , .0004, 200 );
          
        }

     

      }


    }.bind( friends ) 


  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 500 , 0 , 1500 ),
    lookPosition: new THREE.Vector3( 1000 , 0 , 0 ),
   // lookAtPosition: new THREE.Vector3( 1000 , 0 , 0 ),

    
    textChunk:TEXT.FRIENDS[9],

    
    
    start:function(){
      

      G.iPlaneDistance = 2500;
      /*for( var i = 0; i < this.furryTails.length; i++ ){

        var fT = this.furryTails[i];
        fT.removeAllForces();

        if( i !== 0 ){
          fT.addSpringForce( this.furryTails[i-1].position , .0004, 200 );
        }else{
          fT.addSpringForce( G.sol.position.relative , .0004, 200 );
          
        }

     

      }*/


    }.bind( friends ) 

  });







  this.iPlaneDistance = 1200;

  this.friends = [];
  this.furryGroups = [];
  this.furryTails = [];

  this.audio = [];

}.bind( friends ));


friends.addToInitArray( function(){
  
  var f = 'audio/pages/friends/';

  // purposefully ordered!
 
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

    this.audio.push( this.loadAudio( this.choreography[i] , file ,{
     texture:true 
    }) ) ;

  }

 /* this.audio.halle   = this.loadAudio( 'halle' , f + 'halle.mp3' );
  this.audio.main    = this.loadAudio( 'main' , f + 'main.mp3' );
  this.audio.water   = this.loadAudio( 'water' , f + 'water.mp3' );
  this.audio.wood    = this.loadAudio( 'wood' , f + 'wood.mp3' );
  this.audio.musik   = this.loadAudio( 'musik' , f + 'musik.mp3' );
  this.audio.shuffle = this.loadAudio( 'shuffle' , f + 'shuffle.mp3' );

   this.audio.halle   = this.loadAudio( 'halle' , f + 'halle.mp3' );
  this.audio.main    = this.loadAudio( 'main' , f + 'main.mp3' );
  this.audio.water   = this.loadAudio( 'water' , f + 'water.mp3' );
  this.audio.wood    = this.loadAudio( 'wood' , f + 'wood.mp3' );
  this.audio.musik   = this.loadAudio( 'musik' , f + 'musik.mp3' );
  this.audio.shuffle = this.loadAudio( 'shuffle' , f + 'shuffle.mp3' );*/

  var f = 'global/';

  this.loadShader( 'furryParticles' , f + 'vs-furryParticles' , 'vs' );
  this.loadShader( 'furryParticles' , f + 'fs-furryParticles' , 'fs' );
  this.loadShader( 'furryTail'      , f + 'vs-furryTail' , 'vs' );
  this.loadShader( 'furryTail'      , f + 'fs-furryTail' , 'fs' );
  this.loadShader( 'furryHead'      , f + 'vs-furryHead' , 'vs' );
  this.loadShader( 'furryHead'      , f + 'fs-furryHead' , 'fs' );
  this.loadShader( 'furryTailSim'   , f + 'furryTailSim' , 'ss' );
  this.loadShader( 'furryHeadSim'   , f + 'furryHeadSim' , 'ss' );

/*  var f = 'pages/friends/';
  
  this.loadShader( 'planet' , f + 'vs-planet' , 'vs' );
  this.loadShader( 'planet' , f + 'fs-planet' , 'fs' );
*/
}.bind( friends) );


friends.addToStartArray( function(){


  
  /*G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( friends ));

/*

   Creating Planets and Tails

*/

friends.addToStartArray( function(){


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
    /*var col1 = new THREE.Vector3( c[2].r , c[2].g , c[2].b );
    var col2 = new THREE.Vector3( c[3].r , c[3].g , c[3].b );
    var col3 = new THREE.Vector3( c[4].r , c[4].g , c[4].b );
    var col4 = new THREE.Vector3( c[5].r , c[5].g , c[5].b );*/

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
      dist_spineAttract     : .9    * (0.5 + (i/this.choreography.length) * 2 ),
      force_spineAttract    : .1    * (0.5 + (i/this.choreography.length) * 2 ),
      dist_bundleAttract    : 21.1  * (0.5 + (i/this.choreography.length) * 2 ),
      force_bundleAttract   : .1    * (0.5 + (i/this.choreography.length) * 2 ),
      dist_bundleRepel      : 100   * (0.5 + (i/this.choreography.length) * 2 ),
      force_bundleRepel     : .018  * (0.5 + (i/this.choreography.length) * 2 ),
      dist_subAttract       : 58.1  * (0.5 + (i/this.choreography.length) * 2 ),
      force_subAttract      : .5    * (0.5 + (i/this.choreography.length) * 2 ),
      dist_subRepel         : 88.1  * (0.5 + (i/this.choreography.length) * 2 ),
      force_subRepel        : .3    * (0.5 + (i/this.choreography.length) * 2 ),
      dist_subSubAttract    : 12.1  * (0.5 + (i/this.choreography.length) * 2 ),
      force_subSubAttract   : .5    * (0.5 + (i/this.choreography.length) * 2 ),
      dist_subSubRepel      : 100   * (0.5 + (i/this.choreography.length) * 2 ),
      force_subSubRepel     : .2    * (0.5 + (i/this.choreography.length) * 2 ),

      audioAmount           :.5 -(i/this.choreography.length)*.4,
      audioPower            :1 //* (.5 + Math.random() )

    });

    this.furryGroups.push( f );

    this.center.visible = false;
  //G.renderer.render( G.scene , G.camera );
    

  }



  for( var i = 0; i < this.furryTails.length; i++ ){

    this.furryTails[i].brethren = this.furryTails;

  }

 }.bind( friends ));




/*

  Setting up audio
  TODO: Make into looper

*/
friends.addToStartArray( function(){

  this.looper = new Looper( G.audio , G.timer , {
  
    beatsPerMinute: 96,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });


  for( var i = 0; i < this.choreography.length  ; i++ ){
    this.audio[i].gain.gain.value = 0;
  }
  this.looper.everyLoop( function(){
    for( var i = 0; i < this.audio.length; i++ ){
      this.audio[i].play();
    }
  }.bind( this ) );

   
  /*for( var i = 0; i < this.friends.length; i++ ){
    this.friends[i].updateAudio();
   }*/

  this.looper.start();
  


}.bind( friends ));


/*
 
   Text

*/
friends.addToStartArray( function(){

  
  var repelPosArray = [];
  
  for( var i =0; i < this.furryTails.length; i++ ){

    repelPosArray.push( this.furryTails[i].position );

  }

  for( var i = 0; i < this.friends.length; i++ ){

    repelPosArray.push( this.friends[i].position );

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

}.bind( friends ));


friends.addToStartArray( function(){


  for( var i = 0; i < this.furryTails.length; i++ ){

    var furryTail = this.furryTails[i];
/*
    furryTail.position.x = ( Math.random() - .5 ) * 500;
    furryTail.position.y = ( Math.random() - .5 ) * 500;
    furryTail.position.z = ( Math.random() - .5 ) * 500;
    
    furryTail.velocity.x = ( Math.random() - .5 ) * 1000;
    furryTail.velocity.y = ( Math.random() - .5 ) * 1000;
    furryTail.velocity.z = ( Math.random() - .5 ) * 1000;*/

  }

}.bind( friends ));


friends.addToAllUpdateArrays( function(){

  
  for( var i = 0; i < this.furryTails.length; i++ ){

    var furryTail = this.furryTails[i];
    furryTail.updateTail();

  }


  for( var i = 0; i < this.furryTails.length; i++ ){

    var furryTail = this.furryTails[i];
    furryTail.updatePhysics();

  }

  for( var i =0; i < this.furryTails.length; i+=1 ){

    /*G.v1.copy( G.mani.position.relative   );
    G.v1.sub(  this.furryTails[i].position );

    var l = G.v1.length();

    var a = 1 / l;

    G.v1.copy( G.mani.position.relative   );
    G.v1.sub(  this.furryTails[i+1].position );

    var l = G.v1.length();
    a += 1/l

    a *= 40;*/
    //this.audio[ Math.floor( i / 2 ) ].gain.gain.value = Math.min( 1. , a );

  }


}.bind( friends ) );

friends.addToDeactivateArray( function(){

  G.v1.set( -100000 , 0 , 0 );
  G.solAttractor.add( G.v1 );

}.bind( friends ));

friends.addToEndArray( function(){

  this.looper.end();
  G.sol.deactivate();

}.bind( friends ));

