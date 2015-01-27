var alone = new Page( 'alone' );

alone.addToInitArray( function(){


  console.log( 'INAT');
  this.title = "Real Time Is Now";

  this.sectionParams = [];
  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3(  0 , 800 , 100 ),
    transitionTime: 1000000,
    transitioningOut:function(){ 
      console.log('HELLOS'); 
     // this.page.titleOpacity = 1 - t
    }
    
  });
  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3(  0 , 0 , 1000 ),
    transitionTime: 3000,
    textChunk:[
      "When Mani awoke, he had now idea where he was.",
      "","",
      "He was surrounded by a darkness that reached farther than he could see, an abyss greater than he could comprehend.",
      "","",
      "He began to move, slowly discovering the physics of his form."
    ].join("\n" ),
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
    textChunk:[
      "The nothing was so complete, Mani could not tell if he moved. Still he swam onwards, delighting at the soft swish of his tail, the gentle movement of his spine.",
      "","",
      "Mani was curious, and though he was scared, decided that he would explore, even if the conquest ended in darkness"
    ].join("\n" )
  });

 
  this.position.set(  0 , 0 , 0 );
  
  this.cameraPos =  this.sectionParams[0].cameraPosition;

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
 
console.log('SCALED')
  console.log( scale );

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

  console.log( 'OPACITY' );
  console.log( this.titleOpacity );
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
