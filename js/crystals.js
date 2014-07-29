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
  "These were the questions he could not forget, so after the aching inside of him overcame the shimmer steeples, he continued onwards."

].join("\n" );


crystals.position.set(  500 , -2000 , 1400 );
crystals.cameraPos.set( 500 , -1000 , 3200 );
crystals.iPlaneDistance = 1200


crystals.crystalParams = [
 
 {
  
    note:'YES1',
    height:150

  },

  {
  
    note:'YES2',
    height:200

  },

  {
  
    note:'YES3',
    height:150

  },
  {
    
    note:'darkFast',
    height:200,
    //color1: new THREE.Color( 

  },

  {
  
    note:'heavyBeat',
    height:150

  },

  {
  
    note:'shuffleClick',
    height:100

  },

  {
  
    note:'sniperDetail1',
    height:100

  },

  {
  
    note:'sniperDetail2',
    height:150

  },

   {
  
    note:'sniperGlory1',
    height:200

  },

  {
  
    note:'sniperGlory2',
    height:300

  },

  {
  
    note:'sniperShivers',
    height:350

  },

  {
  
    note:'sniperSnare',
    height:300

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
  
  this.loadShader( 'crystal' , f + 'vs-crystal' , 'vertex' ); 
  this.loadShader( 'crystal' , f + 'fs-crystal' , 'fragment' ); 

}.bind( crystals ) );


crystals.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = 1200;

  G.iPlane.faceCamera = false;
  
  G.tmpV3.set( 0 , 450 , 0 );

  G.iPlane.position.copy( this.position.clone().add(G.tmpV3 ));
  G.tmpV3.set( 0 , 451 , 0 )
  G.iPlane.lookAt( this.position.clone().add( G.tmpV3 ) );

  //G.iPlane.visible = true;

}.bind( crystals ));

// Setting up uniforms gui
crystals.addToStartArray( function(){

  G.tmpV3.set( -500 , 400 , 0 );


  var globalLightPos = this.position.clone().add( G.tmpV3 );


  this.uniforms = {

    lightPos:{ type:"v3" , value:G.iPoint },


    baseMultiplier: { type:"f" , value : .6 },
    ringMultiplier: { type:"f" , value : 10.3 },
    reflMultiplier: { type:"f" , value : 1 },
    distanceCutoff: { type:"f" , value: 360 },
    distancePow:{ type:"f" , value: 4 },
    texScale:{ type:"f" , value:.000034 },
    normalScale:{ type:"f" , value:.6 },
    extra:{ type:"f" , value:1 }

  }

  // Crystal Params
  var cp = this.gui.addFolder( "Crystal Params" );

  var u = this.uniforms;
  cp.add( u.baseMultiplier , 'value' ).name( 'Base' );
  cp.add( u.ringMultiplier , 'value' ).name( 'Ring' );
  cp.add( u.reflMultiplier , 'value' ).name( 'Reflection' );
  cp.add( u.distanceCutoff , 'value' ).name( 'Distance Cutoff' );
  cp.add( u.distancePow , 'value' ).name( 'Distance Power' );
  cp.add( u.texScale , 'value' ).name( 'Texture Scale' );
  cp.add( u.normalScale , 'value' ).name( 'Normal Scale' );
  cp.add( u.extra , 'value' ).name( 'Extra' );


}.bind( crystals ));

crystals.addToStartArray( function(){

  for( var i = 0; i < this.audio.array.length; i++ ){

    var audio = this.audio.array[i];
    audio.reconnect( this.gain );

  }

}.bind( crystals) );

crystals.addToStartArray( function(){
  
  var light = new THREE.PointLight(0x66aa99);
  light.position.copy( this.position );
  G.tmpV3.set( -500 , -1000 , 0 );
  light.position.add( G.tmpV3 );
  G.scene.add( light );

   var light = new THREE.PointLight(0x6688aa);
  //light.position.copy( this.position );
  G.tmpV3.set( 0 , 00 , 0 );

  light.position.add( G.tmpV3 );
  G.iObj.add( light );

  //light.position.copy( this.position );
  //G.tmpV3.set( -500 , 400 , 0 );

  //light.position.add( G.tmpV3 );
  //G.mani.leader.add( light  );

  
}.bind( crystals) );


crystals.addToStartArray( function(){

  G.tmpV3.set( -500 , 400 , 0 );

  var globalLightPos = this.position.clone().add( G.tmpV3 );

  var uniforms = {

    t_audio:G.t_audio,
    t_normal:{ type:"t" , value : G.TEXTURES.norm_moss },

    cameraPos:{ type:"v3" , value : G.camera.position },
    hovered:{ type:"f" , value:0},
    playing:{ type:"f" , value:0},
    selected:{ type:"f" , value:0},
    special:{ type:"f" , value: 0 },
     
    lightPos: this.uniforms.lightPos,

    baseMultiplier: this.uniforms.baseMultiplier,
    ringMultiplier: this.uniforms.ringMultiplier,
    reflMultiplier: this.uniforms.reflMultiplier, 
    distanceCutoff: this.uniforms.distanceCutoff,
    distancePow:    this.uniforms.distancePow,
    texScale:       this.uniforms.texScale,
    normalScale:    this.uniforms.normalScale,
    extra:          this.uniforms.extra 


  }
  var attributes = {

    id:{ type:"f" , value:null },
    edge:{ type:"f" , value:null },
    uv:{ type:"v2" , value:null },

  }
  var mat = new THREE.ShaderMaterial({

    uniforms:uniforms,
    attributes: attributes,
    vertexShader: G.shaders.vs.crystal,
    fragmentShader: G.shaders.fs.crystal,

  }); 

  /*var mat = new THREE.MeshPhongMaterial({
   
    diffuse: 0x000000,
    specular: 0x88ffee,   
    shininess: 80
  });*/

  for( var i = 0; i < 10; i++ ){


    var geo = new CrystalGeo( 30 , 400 , 120, 20 );
  
    var mesh = new THREE.Mesh( geo , mat );

    mesh.position.x = (Math.random() - .5 ) * 2000;
    mesh.position.z = (Math.random() - .5 ) * 2000;
    mesh.rotation.x = Math.PI / 2;

    this.scene.add( mesh );

  }

  var uniforms = {

    t_audio:G.t_audio,
    t_normal:{ type:"t" , value : G.TEXTURES.norm_moss },

    cameraPos:{ type:"v3" , value : G.camera.position },
    hovered:{ type:"f" , value:0},
    playing:{ type:"f" , value:0},
    selected:{ type:"f" , value:1},
    special:{ type:"f" , value: 0 },
     
    lightPos: this.uniforms.lightPos,

    baseMultiplier: this.uniforms.baseMultiplier,
    ringMultiplier: this.uniforms.ringMultiplier,
    reflMultiplier: this.uniforms.reflMultiplier, 
    distanceCutoff: this.uniforms.distanceCutoff,
    distancePow:    this.uniforms.distancePow,
    texScale:       this.uniforms.texScale,
    normalScale:    this.uniforms.normalScale,
    extra:          this.uniforms.extra 


  }
  var attributes = {

    id:{ type:"f" , value:null },
    edge:{ type:"f" , value:null },
    uv:{ type:"v2" , value:null },

  }
  var mat = new THREE.ShaderMaterial({

    uniforms:uniforms,
    attributes: attributes,
    vertexShader: G.shaders.vs.crystal,
    fragmentShader: G.shaders.fs.crystal,

  }); 



  var geo = new CrystalGeo( 120 , 1000 , 3 , 20 );
  var mesh = new THREE.Mesh( geo , mat );

  mesh.position.x = -500;// (Math.random() - .5 ) * 2000;
  mesh.position.z = 0//(Math.random() - .5 ) * 2000;
  mesh.rotation.x = Math.PI / 2;

  this.scene.add( mesh );

  /*for( var i = 0; i < 10; i++ ){

    var geo = new CrystalGeo( 100 , 30 , 10 , 50 );
    var mesh = new THREE.Mesh( geo , mat );

    mesh.position.x = -500;// (Math.random() - .5 ) * 2000;
    mesh.position.y = 200;//(Math.random() - .5 ) * 2000;
    mesh.rotation.x = Math.PI / 2;

   // mesh.rotation. = (Math.random() - .5) * .3;
    mesh.rotation.y = (i / 10 ) * Math.PI * 2;

    this.scene.add( mesh );

    

  }*/

  

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




  var centerCrystals = new THREE.Object3D();

  centerCrystals.position.x = -500;
  centerCrystals.position.y = 100;
  this.scene.add( centerCrystals );



  for( var i = 0; i < 3; i++ ){

    var crystal = new Crystal( this , this.crystalParams[i] );

    crystal.scene.position.x = (1-i) * 50;
    crystal.scene.rotation.z = (i-1)/2;
    this.crystals.push( crystal );

    crystal.activate( centerCrystals ); 
 
    //crystal.select();

  }
  for( var i = 3; i < this.crystalParams.length; i++ ){

    var s = 1 / (this.crystalParams.length-3);
    var x = (i -4) * s;

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

    crystal.activate( this.scene );
 
    crystal.select();

  }

 
}.bind( crystals ) );

crystals.addToStartArray( function(){
  
  this.text = new PhysicsText( this.textChunk );

    this.looper.start();

}.bind( crystals ) );




crystals.addToStartArray( function(){


}.bind( crystals ) );

crystals.addToActivateArray( function(){

  //this.looper.start();
  this.text.activate();

}.bind( crystals ));

crystals.addToAllUpdateArrays( function(){

  for( var i = 0; i < this.crystals.length; i++ ){
    this.crystals[i].update();
  }
  
  this.text.update();

}.bind( crystals ));

crystals.addToDeactivateArray( function(){

  G.iPlane.faceCamera = true;
  this.text.kill();

}.bind( crystals) );

crystals.addToEndArray( function(){

  this.looper.end();

}.bind( crystals ));

