var alone = new Page( 'alone' );

alone.addToInitArray( function(){

  this.mani = false;
  this.sol  = false;

  //console.log( 'INAT');
  this.title = "Real Time Is Now";

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3(  0 , 800 , 100 ),
    transitionTime: 1000000,
    transitioningOut:function(){ 
     // this.page.titleOpacity = 1 - t
    },
   /* start:function(){
      G.mani.activate();
      G.mani.deactivate();
    }*/
    
  });

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3(  500  , 800 , 2000 ),
    lookPosition: new THREE.Vector3(  500  , 0 , -500 ),
    transitionTime: 3000,
    textChunk:TEXT.ALONE[0]

  });

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3(  0 , -50 , 1000 ),
    transitionTime: 8000,
    textChunk:TEXT.ALONE[1],
    start: function(){

      G.v1.copy( G.position );
      G.v2.set( 0 , 1000 , 0 );
      G.v1.add( G.v2 );
      G.mani.transport( G.v1 );
     
      G.mani.activate();

    }
    
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  0 , 0 , 1500 ),
    transitionTime: 3000,
    textChunk:TEXT.ALONE[2]
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  1000 , 0 , 4500 ),
    lookPosition: new THREE.Vector3(  1000 , 100 , 500 ),
    transitionTime: 3000,
    textChunk:TEXT.ALONE[3]
  });


 
  this.position.set(  0 , 0 , 0 );
  
  this.iPlaneDistance = 1000

}.bind( alone ) );

// Need to load at least 1 thing
alone.addToInitArray( function(){
  
  var f = 'audio/global/';
  this.audio =  this.loadAudio( 'hueSparkles' , f + 'hueSparkles.mp3' );

  var t = 'titleSDF';
  this.textTexture = this.loadTexture( 'text_' + t , 'img/extras/' + t + '.png' );

  
  var t = 'sand';
  this.normalTexture = this.loadTexture( 'normal_' + t , 'img/normals/' + t + '.png' );

  var t = 'turq';
  this.iriTexture = this.loadTexture( 'iri_' + t , 'img/iri/' + t + '.png' );
  var t = 'gold';
  this.iriTextureFace = this.loadTexture( 'iri_' + t , 'img/iri/' + t + '.png' );
  
  
  var f = 'pages/alone/'
  
  this.loadShader( 'title' , f + 'vs-title' , 'vertex'     );
  this.loadShader( 'title' , f + 'fs-title' , 'fragment'   );


}.bind( alone ) );


alone.addToStartArray( function(){

 /* G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;*/

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( alone ));


alone.addToStartArray( function(){


  this.titleTexture = G.textCreator.createTexture( this.title ,{
    size:.4,
  });

  var tt = this.titleTexture
  var scale = new THREE.Vector2( .5 , (.5 * tt.scaledHeight) / tt.scaledWidth );
 
  var titleGeo = new THREE.PlaneGeometry( 2000 , 2000 , 100 , 100 );


  var uniforms = {

    t_audio: G.t_audio,
    t_normal: { type:"t" , value: this.normalTexture },
    t_iri: { type:"t" , value: this.iriTexture },
    t_iriFace: { type:"t" , value: this.iriTextureFace },
    t_text:{ type:"t" , value: this.textTexture },
    textureScale:{ type:"v2" , value: scale },
    normalScale:{ type:"f" , value: 2.4 },
    texScale:{ type:"f" , value: 1.5 },
    cameraPos:{ type:"v3" , value: G.camera.position },
    lightPos:{ type:"v3" , value: G.iPoint },
    lightCutoff:{ type:"f" , value: 400 },
    lightPower:{ type:"f" , value: 1},
    timer: G.timer,
    bumpHeight:{ type:"f" , value: 40},
    bumpSize:{ type:"f" , value: .003},
    bumpSpeed:{ type:"f" , value: .1},
    bumpCutoff:{ type:"f" , value: .4},
    opacity:{ type:"f" , value:1.},




  }

  var titleMat = new THREE.ShaderMaterial({

    uniforms: uniforms,
    vertexShader: G.shaders.vs.title,
    fragmentShader: G.shaders.fs.title,
    transparent: true,

  });
  this.titleMesh = new THREE.Mesh( titleGeo , titleMat );
  this.titleMesh.position.y = -500;
  this.titleOpacity = titleMat.uniforms.opacity;

 // console.log( 'OPACITY' );
 // console.log( this.titleOpacity );
  this.titleMesh.rotation.x = -Math.PI / 2;
  this.scene.add( this.titleMesh );


  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 122,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });

  this.looper.everyLoop( function(){ this.play() }.bind( this.audio ) );

  this.audio.reconnect( this.gain );

  this.looper.start();


}.bind( alone ) );


alone.addToActivateArray( function(){

 // G.mani.activate();

}.bind( alone ));


alone.addToAllUpdateArrays( function(){

}.bind( alone ));


alone.addToDeactivateArray( function(){

}.bind( alone) );


alone.addToEndArray( function(){

  this.looper.end();

}.bind( alone ) );
