var crystals = new Page( 'crystals' );

crystals.textChunk = [

  "Mani could not believe his eyes.",
  "",
  "",
  "Infront of him grew a forest of crystals, each more glorious than the next. They spouted glistening particles as they shown in the darkness. And for a moment Mani forgot his worries from earlier.",
  "",
  "",
  "The feeling did not last long though, and he began to wonder again the purpose of all this. Why had he awoken? Where was he? Was there anybody else out there?",
  "",
  "",
  "These were the questions he could not forget, so after the aching inside of him overcame the shimmer steeples, he continued onwards"



].join("\n" );


88

crystals.position.set(  500 , -2000 , 5400 );
crystals.cameraPos.set( 500 , -1000 , 7000 );
crystals.iPlaneDistance = 1200


crystals.crystalParams = [
  
  {
    
    note:'darkFast',
    height:200,
    //color1: new THREE.Color( 

  },

  {
  
    note:'heavyBeat',
    height:200

  },

  {
  
    note:'shuffleClick',
    height:200

  },

  {
  
    note:'sniperDetail1',
    height:200

  },

  {
  
    note:'sniperDetail2',
    height:200

  },

   {
  
    note:'sniperGlory1',
    height:200

  },

  {
  
    note:'sniperGlory2',
    height:200

  },

  {
  
    note:'sniperShivers',
    height:200

  },

  {
  
    note:'sniperSnare',
    height:200

  },

  {
  
    note:'sniperSnare',
    height:200

  },


]
 

crystals.audio = {};
crystals.audio.array = [];

crystals.crystals = [];

crystals.addToInitArray( function(){
  
  var f = 'audio/pages/crystals/'

  for( var i = 0; i < this.crystalParams.length; i++ ){
    
    var name = this.crystalParams[i].note;

    this.audio[ name ] = this.loadAudio( name , f + name + '.mp3' );
  
    this.audio.array.push( this.audio[ name ] );

  }

  var f = 'pages/crystals/';

  this.loadShader( 'crystalParticles' , f + 'ss-crystalParticles' , 'simulation' );
  
  this.loadShader( 'crystalParticles' , f + 'vs-crystalParticles' , 'vertex' ); 
  this.loadShader( 'crystalParticles' , f + 'fs-crystalParticles' , 'fragment' ); 

  this.loadShader( 'crystalHalo'  , f + 'vs-crystalHalo'  , 'vertex' ); 
  this.loadShader( 'crystalHalo'  , f + 'fs-crystalHalo'  , 'fragment' );


}.bind( crystals ) );


crystals.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = 1200;

}.bind( crystals ));

crystals.addToStartArray( function(){

  for( var i = 0; i < this.audio.array.length; i++ ){

    var audio = this.audio.array[i];
    audio.reconnect( this.gain );

  }

}.bind( crystals) );

crystals.addToStartArray( function(){
  
  var light = new THREE.DirectionalLight(0xff0000);
  light.position.set( 0 , 0 , 1 );
  G.scene.add( light );

  var light = new THREE.DirectionalLight(0x00ff00);
  light.position.set( 0 , 1 , 1 );
  G.scene.add( light );

  var light = new THREE.DirectionalLight(0xa0cca0);
  light.position.set( -1 , 0 , -1 );
  G.scene.add( light );

  var light = new THREE.DirectionalLight(0xa0a0cc);
  light.position.set( 1 , 0 , -1 );
  G.scene.add( light );


  var light = new THREE.DirectionalLight(0xa0a0cc);
  light.position.set( 1 , 0 , -1 );
  G.scene.add( light );
  
}.bind( crystals) );


crystals.addToStartArray( function(){

  for( var i = 0; i < 10; i++ ){

      var color = new THREE.Color();
  color.r = Math.random();
  color.g = Math.random();
  color.b = Math.random();
  var mat = new THREE.MeshLambertMaterial();
    mat.color = color;


    var geo = new CrystalGeo( 30 , 400 , 120 );
  
    var mesh = new THREE.Mesh( geo , mat );

    mesh.position.x = (Math.random() - .5 ) * 2000;
    mesh.position.z = (Math.random() - .5 ) * 2000;
    mesh.rotation.x = Math.PI / 2;

    this.scene.add( mesh );

  }

    var color = new THREE.Color();
  color.r = Math.random();
  color.g = Math.random();
  color.b = Math.random();


   var geo = new CrystalGeo( 120 , 1000 , 3 );
    var mat = new THREE.MeshLambertMaterial();
    mat.color = color;

    var mesh = new THREE.Mesh( geo , mat );

    mesh.position.x = -500;// (Math.random() - .5 ) * 2000;
    mesh.position.z = 0//(Math.random() - .5 ) * 2000;
    mesh.rotation.x = Math.PI / 2;

    this.scene.add( mesh );


}.bind( crystals ));


crystals.addToStartArray( function(){

   this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 88,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });


  this.looper.crystals = this.crystals;


}.bind( crystals ) );


crystals.addToStartArray( function(){

  for( var i = 0; i < this.crystalParams.length; i++ ){

    var s = 1 / this.crystalParams.length;
    var x = i * s;

    var shift = Math.floor( x * 2 );

    var crystal = new Crystal( this , this.crystalParams[i] );


    var t = 2 * Math.PI * x;

    var rX = 400 * Math.cos( t );
    var rY = 400 * Math.sin( t );



    //var rX =1 + ( Math.random() -.5 ) * .1;
    //var rZ =1 + ( Math.random() -.5 ) * .1;
    
    crystal.scene.position.x =rX - 500;//( x-.25 + s*.5) * 1000 * rX - (500 * shift);
    crystal.scene.position.z =rY //(shift) * 200 * rZ;
    crystal.scene.position.y = 100;

    this.crystals.push( crystal );
  
  }

}.bind( crystals ) );

crystals.addToStartArray( function(){

  for( var i = 0; i < this.crystals.length; i++ ){

    console.log( 'CRS');
    this.crystals[i].activate();

  }

}.bind( crystals ) );




crystals.addToStartArray( function(){


  this.text = new PhysicsText( this.textChunk );
  
  //this.crystals.activate();


}.bind( crystals ) );

crystals.addToActivateArray( function(){

  this.looper.start();
  this.text.activate();

}.bind( crystals ));

crystals.addToAllUpdateArrays( function(){

  for( var i = 0; i < this.crystals.length; i++ ){
    this.crystals[i].update();
  }

}.bind( crystals ));


crystals.addToAllUpdateArrays( function(){


  this.text.update();

}.bind( crystals ));


crystals.addToDeactivateArray( function(){

  this.text.kill();

}.bind( crystals) );

crystals.addToEndArray( function(){

  this.looper.end();

}.bind( crystals ));

