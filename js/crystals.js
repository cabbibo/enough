var crystals = new Page( 'crystals' );


crystals.addToInitArray( function(){

  this.mani = true;
  this.sol  = false;

  this.sectionParams.push({
    cameraPosition:new THREE.Vector3(  2000 , 2000 , -2000 ),
    lookPosition:new THREE.Vector3(  -1000 , 00 , -500 ),
    
    textChunk:TEXT.CRYSTALS[0],

  });

  /*this.sectionParams.push({
    cameraPosition:new THREE.Vector3(  00 , 500 , 1000 ),
    lookPosition:new THREE.Vector3(  -500 , 00 , 0 ),
    
    textChunk:[
      "After an eternity of drifting through the ether, Mani discovered a land of crystals.",
      "","",
      "They spewed sparkles into the world around him, and Mani’s entire being shimmered with glee. So splendid they stood, stoic yet playful, each with its own voice and melody."
    ].join("\n" ),

  });*/




  this.sectionParams.push({
    cameraPosition:new THREE.Vector3( -100 , 1000 , 1600  ),
    textChunk:TEXT.CRYSTALS[1],
    start:function(){
      for( var i = 0; i < this.page.crystals.length; i++ ){

        var c = this.page.crystals[i];
        if( i == 0 || i == 1 || i == 2 || i == 3 || i == 5){
         
         //console.log('HELLOS') 
          if( !c.selected ) c.select();
        
        }else{

          if( c.selected ) c.select();
        }

      }
    }
    
  });

  this.sectionParams.push({
    cameraPosition:new THREE.Vector3( 0 , 1000 , 1400  ),
    lookPosition:new THREE.Vector3( -300 , 00 , -600  ),

    textChunk:TEXT.CRYSTALS[2],
    start:function(){
      for( var i = 0; i < this.page.crystals.length; i++ ){
        var c = this.page.crystals[i];
        //if(  i !== 3 && i !== 9 ){
          if( !c.selected ) c.select();
        //}else{
        //  if( c.selected ) c.select();
        //}
      }
    }
  });

  this.sectionParams.push({
    cameraPosition:new THREE.Vector3( 0 , 2000 , 2400  ),
    lookPosition:new THREE.Vector3( -300 , 00 , -600  ),

    textChunk:TEXT.CRYSTALS[3],
    start:function(){
      for( var i = 0; i < this.page.crystals.length; i++ ){
        var c = this.page.crystals[i];
        //if(  i !== 3 && i !== 9 ){
          if( !c.selected ) c.select();
        //}else{
        //  if( c.selected ) c.select();
        //}
      }
    }
  });

  this.position.set(  -2500 , -2000 , 3400 );
  
  this.iPlaneDistance = 1200;


  this.crystalParams = [
   
   {
    
      note:'plipPlop1',
      height:350

    },

    {
    
      note:'bass',
      height:400

    },

    {
    
      note:'plipPlop2',
      height:350

    },
    {
      
      note:'shuffle',
      height:600,
      //color1: new THREE.Color( 

    },

   /* {
    
      note:'heavyBeat',
      height:150

    },*/

    {
    
      note:'heartbeat',
      height:600

    },

    {
    
      note:'atmosphere',
      height:600

    },

    {
    
      note:'burial',
      height:600

    },




  ]
   

  this.audio = {};
  this.audio.array = [];

  this.crystals = [];


}.bind( crystals ));

crystals.addToInitArray( function(){
  
  var f = 'audio/global/friends/'

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

  //G.position.copy( this.position );
  //G.camera.position.copy( this.cameraPos );
  //G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = 1200;

  //this.lightRays = new LightRays();
  //this.lightRays.body.scale.multiplyScalar( 2000 );
  //this.scene.add( this.lightRays);




  //G.iPlane.visible = true;

}.bind( crystals ));

// Setting up uniforms gui
crystals.addToStartArray( function(){

  G.tmpV3.set( -500 , 400 , 0 );

 // console.log('CRYSTALS STARTED' );

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

    beatsPerMinute: 96,
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

    //crystal.scene.position.x = (1-i) * 50;
    //crystal.scene.rotation.z = (i-1)/2;
    //
    crystal.scene.position.z = 200;
    crystal.scene.position.x = (i -1) * 200
    this.crystals.push( crystal );

    crystal.activate( centerCrystals ); 
 
    //crystal.select();

  }
  
  
  for( var i = 3; i < this.crystalParams.length; i++ ){

    var s = 1 / (this.crystalParams.length-3);
    var x = (i -3) * s;

    var shift = Math.floor( x * 2 );

    var crystal = new Crystal( this , this.crystalParams[i] );


    var t =  Math.PI * (x +1);

    var rX = 400 * Math.cos( t );
    var rY = 400 * Math.sin( t );



    //var rX =1 + ( Math.random() -.5 ) * .1;
    //var rZ =1 + ( Math.random() -.5 ) * .1;
    
    crystal.scene.position.x =rX - 500;//( x-.25 + s*.5) * 1000 * rX - (500 * shift);
    crystal.scene.position.z =rY //(shift) * 200 * rZ;
    crystal.scene.position.y = 100;

    this.crystals.push( crystal );

    crystal.activate( this.scene );
 
    //crystal.select();

  }

  this.crystals[0].select();
  this.crystals[2].select();

 
}.bind( crystals ) );

crystals.addToStartArray( function(){

  this.looper.start();

}.bind( crystals ) );

crystals.addToActivateArray( function(){

    
  G.iPlane.faceCamera = false;
  
  G.tmpV3.set( 0 , 450 , 0 );

  G.iPlane.position.copy( this.position.clone().add(G.tmpV3 ));
  G.tmpV3.set( 0 , 451 , 0 )
  G.iPlane.lookAt( this.position.clone().add( G.tmpV3 ) );

}.bind( crystals ));

crystals.addToAllUpdateArrays( function(){

  for( var i = 0; i < this.crystals.length; i++ ){
    this.crystals[i].update();
  }

}.bind( crystals ));

crystals.addToEndArray( function(){

  this.looper.end();

}.bind( crystals ));

