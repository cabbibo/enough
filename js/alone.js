var alone = new Page( 'alone' );

alone.textChunk = [

  "When Mani awoke, he had no idea where he was.",
  "",
  "",
  "In fact, he had no idea what he was.",
  "",
  "",
  "All he knew is that he was alone, and surround by darkness.",
  "",
  "",
  "After moving through the blackness that surrounded for long enough, he began to explore"

].join("\n" );


alone.position.set(  0 , 0 , 0 );
alone.cameraPos.set( 0 , 0 , 1000 );
alone.iPlaneDistance = 1000


// Need to load at least 1 thing
alone.addToInitArray( function(){
  
  var f = 'pages/crystals/';

  this.loadShader( 'crystalParticles' , f + 'ss-crystalParticles' , 'simulation' );

}.bind( alone ) );


alone.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( alone ));


alone.addToStartArray( function(){

  this.text = new PhysicsText( this.textChunk );

}.bind( alone ) );


alone.addToActivateArray( function(){

  this.text.activate();

}.bind( alone ));


alone.addToAllUpdateArrays( function(){

  this.text.update();

}.bind( alone ));


alone.addToDeactivateArray( function(){

  this.text.kill();

}.bind( alone) );



