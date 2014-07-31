var together = new Page( 'together' );

together.textChunk = [

  "Mani and Sol danced for hours in the stars that glistened around them.",
  "","",
  "There was nothing that Mani had know that was like this. The shimmering crystals, the mystic tree, glistening particles, nothing compared. No matter how amazed he had been at discoverying these magical places, the magic that he felt now was unforgetable",
  "","",
  "After they danced for what seemed like an eternity, Sol told Mani to follow her, because she had something to show him"

].join("\n" );




together.position.set(  0 , 0 , 0 );
together.cameraPos.set( 0 , 0 , 1000 );
together.iPlaneDistance = 1000


// Need to load at least 1 thing
together.addToInitArray( function(){
  
  var f = 'img/iri/';
  this.loadTexture( 'wetwetwet' , f + 'comboWet.png');

}.bind( together ) );


together.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( together ));


together.addToStartArray( function(){

  this.text = new PhysicsText( this.textChunk );

}.bind( together ) );


together.addToActivateArray( function(){

  this.endMesh.add( this );
  this.text.activate();

}.bind( together ));


together.addToAllUpdateArrays( function(){

  this.text.update();

}.bind( together ));


together.addToDeactivateArray( function(){

  this.text.kill();

}.bind( together) );


