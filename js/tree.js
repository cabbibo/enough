var tree = new Page( 'tree' );

tree.textChunk = [

  "The after leaving the flowing forest, Mani began feeling lonely again.",
  "","",
  "It was true that he had loved seeing the whisping silver flow around him, and the sounds he had heard were truly magical, but what he wanted there to be more. He wanted to find the purpose for the world around him. He wanted to know why he was hear, and most importantly he begged of the reality around him, that he was not alone."

].join("\n" );




tree.position.set(  0 , 0 , 0 );
tree.cameraPos.set( 0 , 3500 , 4000 );
tree.iPlaneDistance = 1000


// Need to load at least 1 thing
tree.addToInitArray( function(){
  
  var f = 'pages/crystals/';

  this.loadShader( 'crystalParticles' , f + 'ss-crystalParticles' , 'simulation' );

}.bind( tree ) );


tree.addToStartArray( function(){

  G.mani.deactivate();

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( tree ));


tree.addToStartArray( function(){

  for( var i = 0; i < 10; i++ ){

   var tree = new Tree( this , G.MATS[ 'normal' ] , {
    
    /* radius:
     height:
     sides:
     numOf:
     randomness:
     slices:
     startingChance:
     chanceReducer:
     randomnessReducer:
     sliceReducer:
     numOfReducer:*/
     
   });

   tree.scene.position.y = -400;

   var r = 500;
   var t = (i / 10 )* 2 * Math.PI;

   tree.scene.position.x = r * Math.cos( t );
   tree.scene.position.z = r * Math.sin( t );



  }

  
  for( var i = 0; i < 10; i++ ){

   var tree = new Tree( this , G.MATS[ 'normal' ] );

   tree.scene.position.y = -400;

   var r = 1000;
   var t = (i / 10 )* 2 * Math.PI;

   tree.scene.position.x = r * Math.cos( t );
   tree.scene.position.z = r * Math.sin( t );



  }

  //this.text = new PhysicsText( this.textChunk );

}.bind( tree ) );


tree.addToActivateArray( function(){

  //this.text.activate();

}.bind( tree ));


tree.addToAllUpdateArrays( function(){

  //this.text.update();

}.bind( tree ));


tree.addToDeactivateArray( function(){

  //this.text.kill();

}.bind( tree) );



