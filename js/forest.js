var forest = new Page( 'forest' );

forest.selectBase = function( x , y ){
  var i = x + y * 16
  if( this.forest.bases[i].selected == false ){
    this.forest.bases[ x + y * 16].select();
  }
}

forest.deselectBase = function( x , y ){
  var i = x + y * 16;
  if( this.forest.bases[i].selected ){
    this.forest.bases[ x + y * 16].select();
  }
}


forest.setMonome = function( array ){

  for( var x = 0; x < 16; x++ ){
    for( var y = 0; y < 16; y++ ){

      this.deselectBase( x , y );
  
    }
  }

  for( var i = 0; i < array.length; i++ ){

    var x = array[i][0]; var y = array[i][1];
    this.selectBase( x ,y );

  }

}


forest.addToInitArray( function(){
  
  this.mani = true;
  this.sol  = false;

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , -400 , 3500 ),
    lookPosition: new THREE.Vector3( 1000 , 00 , 00 ),
    
    transitionTime:3000,    
    textChunk:TEXT.FOREST[0], 
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 1000 , -1000 , 2500 ),
    lookPosition: new THREE.Vector3( 1000 , 500 , 00 ),
    transitionTime:3000,
    textChunk:TEXT.FOREST[1],
    transitionIn:function(){
    
      this.page.setMonome([
        [  1 ,  1 ], 
        [  1 ,  9 ], 
        [  2 ,  8 ], 
        [  4 ,  7 ], 
        [  4 ,  6 ], 
        [  8 ,  3 ], 
        [  9 ,  9 ], 
        [ 11 ,  5 ], 
        [ 12 , 10 ], 
        [ 14 ,  8 ]
       ]);


  
      this.page.forest.physicsRenderer.simulationUniforms.uFloatForce.value = 60000
      this.page.forest.physicsRenderer.simulationUniforms.uFlowMultiplier.value = 400       
  
    }
  });


  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( -2000 , -500 , 3500 ),
    lookPosition: new THREE.Vector3( 1000 , 00 , 1000 ),

    transitionTime:3000,    
    textChunk:TEXT.FOREST[2],
    transitionIn:function(){
      this.page.setMonome([
        [  1 ,  1 ], 
        [  1 ,  7 ], 
        [  1 ,  9 ], 
        [  1 , 10 ], 
        [  2 ,  8 ], 
        [  3 , 11 ], 
        [  4 ,  7 ], 
        [  4 ,  6 ], 
        [  5 ,  4 ], 
        [  8 ,  3 ], 
        [  9 ,  9 ], 
        [ 11 ,  0 ], 
        [ 11 ,  5 ], 
        [ 11 ,  8 ], 
        [ 11 , 10 ], 
        [ 12 , 10 ], 
        [ 13 , 12 ], 
        [ 14 ,  8 ]
       ]);

      this.page.forest.physicsRenderer.simulationUniforms.uFloatForce.value = 10000
      this.page.forest.physicsRenderer.simulationUniforms.uFlowMultiplier.value = 1000       
        

    }
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 1000 , 1000 , 2500 ),
    lookPosition: new THREE.Vector3( 1000 , -500 , 00 ),

    transitionTime:3000,    
    textChunk:TEXT.FOREST[3],
    transitionIn:function(){
      this.page.setMonome([
        [  1 ,  1 ], 
        [  1 ,  9 ], 
        [  2 ,  8 ], 
        [  4 ,  7 ], 
        [  4 ,  6 ], 
        [  8 ,  3 ], 
        [  9 ,  9 ], 
        [ 11 ,  5 ], 
        [ 12 , 10 ], 
        [ 14 ,  8 ]
       ]);

      this.page.forest.physicsRenderer.simulationUniforms.uFloatForce.value = 60000
      this.page.forest.physicsRenderer.simulationUniforms.uFlowMultiplier.value = 400      
        

    }
  });



 // this.position.set(  0 , 0 , -2500 );

  this.position.set(  500 , 2000 , -3900 );
  
  
  this.iPlaneDistance = 3000


  this.audioArray = [
    
    'bolloning1', 'bolloning2', 'bolloning3',
    
    'wait1', 'wait2', 'wait3', 'wait4', 
    
    'drumz1', 'drumz4', 'drumz9', 'drumz10',

    'synth1', 'synth2', 'synth3', 'synth4', 'synth5'
    //'weStand5',
  ]


  this.audio = {};
  this.audio.array = [];
  this.monomeMeshes = [];

}.bind( forest ) );

forest.addToInitArray( function(){
  
  var f = 'audio/pages/forest/'

  for( var i = 0; i < this.audioArray.length; i++ ){
    
    var name = this.audioArray[i];

    this.audio[ name ] = this.loadAudio( name , f + name + '.mp3' );
 
    this.audio[ name ].updateAnalyser = true;
    this.audio[ name ].updateTexture = true;

    this.audio.array.push( this.audio[ name ] );

  }


  var f = 'pages/forest/';

  this.loadShader( 'forest' , f + 'ss-forest' , 'simulation' );

  this.loadShader( 'forest' , f + 'vs-forest' , 'vertex' ); 
  this.loadShader( 'forest' , f + 'fs-forest' , 'fragment' ); 

  this.loadShader( 'forestFloor' , f + 'vs-forestFloor' , 'vertex' ); 
  this.loadShader( 'forestFloor' , f + 'fs-forestFloor' , 'fragment' ); 

  this.loadShader( 'trunk'  , f + 'vs-trunk'  , 'vertex' ); 
  this.loadShader( 'trunk'  , f + 'fs-trunk'  , 'fragment' );

  this.loadShader( 'monome' , f + 'vs-monome' , 'vertex' );
  this.loadShader( 'monome' , f + 'fs-monome' , 'fragment' );


  this.loadTexture( 'iri_comboWet' , 'img/iri/comboWet.png' );
  this.loadTexture( 'normal_moss' , 'img/normals/moss_normal_map.jpg' );

}.bind( forest ) );


forest.addToStartArray( function(){

/*  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( forest ));

forest.addToStartArray( function(){

  for( var i = 0; i < this.audio.array.length; i++ ){

    var audio = this.audio.array[i];
    audio.reconnect( this.gain );

  }

}.bind( forest) );

forest.addToStartArray( function(){

  var repelObjects    = [];
  var repelPositions  = [];
  var repelVelocities = [];
  var repelRadii      = [];
      
  for( var i = 0; i < 6; i++ ){

    var l = 10000000;
    repelPositions.push( new THREE.Vector3( l, l , l ) );
    repelVelocities.push( new THREE.Vector3( 0 , 0 , 0 ) );
    repelRadii.push( 0 );

  }

  repelPositions.push( G.mani.position.relative );
  repelVelocities.push( G.mani.velocity );
  repelRadii.push( 500 );


 /* repelPositions.push( G.iPoint.relative );
  repelVelocities.push( new THREE.Vector3() );
  repelRadii.push( 500 );


  repelPositions.push( G.lHand.relative );
  repelVelocities.push( new THREE.Vector3()  );
  repelRadii.push( 500 );

  repelPositions.push( G.rHand.relative  );
  repelVelocities.push( new THREE.Vector3()  );
  repelRadii.push( 500 );*/


  this.forest = new Forest(
  this,
  {
    position:new THREE.Vector3(),
    repelPositions: repelPositions,
    repelVelocities: repelVelocities,
    repelRadii: repelRadii,
    width: 2000,
    height: 2000,
    girth: 12.9,
    headMultiplier: 6.6,
    repelMultiplier:50,
    flowMultiplier:280,
    floatForce: 2000,
    springForce: 40,
    springDist: 10,
    maxVel: 1000,
    baseGeo: new THREE.IcosahedronGeometry(100 , 1 )
    //baseGeo: new THREE.CubeGeometry( 50 , 50 , 50, 10 , 10 , 10 )
  });

}.bind( forest ) );


forest.addToStartArray( function(){

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 280,
    beatsPerMeasure: 1,
    measuresPerLoop: 16

  });


  this.looper.forest = this.forest;
  this.looper.onNewMeasure = function(){
    this.forest.updateBases( this.relativeMeasure );
  };


  this.looper.start();

 // this.text = new PhysicsText( this.textChunk );


  this.setMonome([ 
    [ 1  ,  1 ], 
    [ 1  ,  7 ], 
    [ 1  , 10 ], 

    [ 5  ,  4 ], 
    [ 8  ,  3 ],
    [ 11 ,  0 ], 
    [ 11 , 10 ], 
    [ 12 , 10 ]
  ]);
  //this.selectBase( 15 , 2 ); 
  




  this.forest.activate();


  
}.bind( forest ) );


forest.addToActivateArray( function(){

  G.iPlane.faceCamera = false;
  
  G.tmpV3.set( 0 , 0 , 450 );

  G.iPlane.position.copy( this.position.clone().add(G.tmpV3 ));
  G.tmpV3.set( 0 , 0 , 450 )
  G.iPlane.lookAt( this.position.clone().add( G.tmpV3 ) );

}.bind( forest ));

forest.addToAllUpdateArrays( function(){

  this.forest.update();
 

}.bind( forest ));


forest.addToDeactivateArray( function(){

  G.iPlane.faceCamera = true;

  //G.mani.removeAllForces();

}.bind( forest) );

forest.addToEndArray( function(){

  this.looper.end();

  for( var i = 0; i < this.monomeMeshes.length; i++ ){

    G.objectControls.remove( this.monomeMeshes[i] );

  }

}.bind( forest ));

