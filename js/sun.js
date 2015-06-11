var sun = new Page( 'sun' );


sun.addToInitArray( function(){

  this.mani = true;
  this.sol  = false;

  /*  

      SECTIONS

  */

  
  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(  -10000 , 0 , 5000 ),
    lookPosition: new THREE.Vector3(   00 ,    0 ,   2000 ),
    
    textChunk:TEXT.SUN[0],
    
  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(   -6000 ,    0 ,   5000 ),
    lookPosition: new THREE.Vector3(   00 ,    0 ,   1000 ),
    textChunk:TEXT.SUN[1],
    transitionTime: 15000,

    transitionIn:function(){
      this.page.iPlaneDistance = 2000 ;
      G.iPlaneDistance = this.page.iPlaneDistance;
    },
    transitionIn:function(){
  
      for( var i = 0; i < this.audio.array.length; i++ ){
        if( i == 5 ){
          console.log( this.audio.array[i] )
          this.audio.array[i].fadeIn( 10 , 1 );
        }
      }

    }.bind( sun )
  });

 
    
  this.sectionParams.push({
    cameraPosition: new THREE.Vector3(   -4000 ,  0 , 4000 ),
    lookPosition:   new THREE.Vector3(   -4000 ,  0 , 0 ),
    textChunk: TEXT.SUN[2],
    transitionTime:15000,

    transitionIn:function(){

      for( var i = 0; i < this.audio.array.length; i++ ){
        if( i == 4  ){
          this.audio.array[i].fadeIn( 10 , 1 );
        }
         if( i == 0  ){
          this.audio.array[i].fadeOut( 10 );
        }
      }


    }.bind( sun ),
    start:function(){

      
      G.iPlane.faceCamera = false;
  
    
      G.v1.copy( G.camera.position );
     // G.v1.normalize();
     // G.v1.multiplyScalar( 300 );

      G.v2.set( 0 , 0 , -1 );
      G.v2.applyQuaternion( G.camera.quaternion );
      G.v2.multiplyScalar( 3000 );
      
      G.v1.add( G.v2 );

     // G.iPlane.position.copy( G.camera.position );
      G.iPlane.position.copy( G.v1 );


      G.v2.copy( G.lookAt );
      G.v2.sub( G.camera.position );
      G.v2.normalize();
      G.v2.multiplyScalar( -1 );
      G.v1.add( G.v2 );

      G.v2.set( -1 , 0 , 0 );
      G.v2.applyQuaternion( G.camera.quaternion );
      G.v2.multiplyScalar( 1 );
      G.v1.add( G.v2 );



      G.iPlane.lookAt( G.v1 );
      //G.iPlane.visible = true;

    }.bind( sun ),
    transitionOut:function(){
      this.page.iPlaneDistance = 1200 ;
      G.iPlaneDistance = this.page.iPlaneDistance;
      G.iPlane.faceCamera = true;
    }
  });


  // INSIDE

  this.sectionParams.push({
    cameraPosition:new THREE.Vector3( -1000 , 0 , 1000 ),
    lookPosition:new THREE.Vector3( 500 , 0 , 100 ),
    transitionTime:30000,
    
    textChunk:TEXT.SUN[3],
    transitionIn:function(){

     for( var i = 0; i < this.audio.array.length; i++ ){
        if( i == 3 || i == 2 || i == 1  ){
          this.audio.array[i].fadeIn( 10 , 1 );
        }
      }

      this.iPlaneDistance = 800 ;
      G.iPlaneDistance = this.iPlaneDistance;
      G.iPlane.faceCamera = true;

      
   
     }.bind( sun ),
    
    // adding the viewer
    start:function(){
      
      this.scene.add( this.hyperborder.body );
      this.scene.add( this.hyperdots.body );


    }.bind( sun )

  });



  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 1200 ),
    transitionTime:4000,

    textChunk:TEXT.SUN[4],
    transitionIn:function(){

      this.flower.setValue( 'noiseSize' , 2 );
      this.flower.setValue( 'springLength' , 2/31 );
      for( var i = 0; i < this.audio.array.length; i++ ){
        if(i == 4 || i == 5 || i == 6 ){
          this.audio.array[i].fadeOut( 10 );
        }
      }

       this.iPlaneDistance = 800 ;
      G.iPlaneDistance = this.iPlaneDistance;
     }.bind( sun )

  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 1100 ),
    transitionTime: 3000,

    textChunk:TEXT.SUN[5],
    transitionIn:function(){

      this.flower.setValue( 'noiseSize' , 3 );
      this.flower.setValue( 'springLength' , .5/31 );
      /*for( var i = 0; i < this.audio.array.length; i++ ){
        if(i == 4 || i == 5 || i == 6 ){
          this.audio.array[i].fadeOut( 10 );
        }
      }*/

       this.iPlaneDistance = 900 ;
      G.iPlaneDistance = this.iPlaneDistance;
     }.bind( sun )

  });

  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 1100 ),
    transitionTime: 10,

    textChunk:TEXT.SUN[6],
    transitionIn:function(){

      this.flower.setValue( 'noiseSize' , 3 );
      this.flower.setValue( 'springLength' , .5/31 );
      /*for( var i = 0; i < this.audio.array.length; i++ ){
        if(i == 4 || i == 5 || i == 6 ){
          this.audio.array[i].fadeOut( 10 );
        }
      }*/

       this.iPlaneDistance = 900 ;
      G.iPlaneDistance = this.iPlaneDistance;
     }.bind( sun )

  });


  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 0 , 0 , 1050 ),

    textChunk:TEXT.SUN[7],
    transitionTime: 3000,
    transitionIn:function(){

      this.flower.setValue( 'noiseSize' , 2 );
      this.flower.setValue( 'springLength' , 2/31 );
      /*for( var i = 0; i < this.audio.array.length; i++ ){
        if(i == 4 || i == 5 || i == 6 ){
          this.audio.array[i].fadeOut( 10 );
        }
      }*/

       this.iPlaneDistance = 900 ;
      G.iPlaneDistance = this.iPlaneDistance;
     }.bind( sun )

  });





  this.sectionParams.push({
    cameraPosition: new THREE.Vector3( 400 ,    0 ,  2000 ),
    lookPosition: new THREE.Vector3( 400 , 0 , 0 ),
    transitionTime: 10000,

    textChunk: TEXT.SUN[8],
    transitionIn:function(){

      G.sol.activate();
      G.v1.copy( this.position );
      G.v2.set( -500 , 0 , 2000 );
      G.v1.add( G.v2 );
      G.sol.transport( G.v1 );
      G.solAttractor.copy( G.mani.position );
     
      this.iPlaneDistance = 1000 ;
      G.iPlaneDistance = this.iPlaneDistance; 

      this.flower.setValue( 'windDepth' , 3 );
      this.flower.setValue( 'windHeight' , 3 );

      for( var i = 0; i < this.audio.array.length; i++ ){
        if(i == 4 ||  i == 5 || i == 0  || i == 6){
          this.audio.array[i].fadeIn( 10 , 1 );
        }
      }

     }.bind( sun )


  });



  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3( 400 , -1000 ,  1600 ), 
    lookPosition: new THREE.Vector3(  400 , -400 ,  0 ),
    transitionTime:10000,
    textChunk:TEXT.SUN[9],

    transitionIn:function(){


      this.flower.setValue( 'windSpeed' , .001 );
      this.flower.setValue( 'springLength' , 2/31 );
     // this.flower.setValue( 'dampening' , .0001 );
      
      for( var i = 0; i < this.audio.array.length; i++ ){
        if( i == 5 || i == 6 ){
          this.audio.array[i].fadeIn( 10 , 1 );
        }
      }

    }.bind( sun )


  });

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3( 400 , -1500 ,  1600 ), 
    lookPosition: new THREE.Vector3(  400 , -400 ,  0 ),
    transitionTime:3000,
    textChunk:TEXT.SUN[10],

    transitionIn:function(){


      this.flower.setValue( 'windSpeed' , .001 );
      this.flower.setValue( 'springLength' , 1/31 );
     // this.flower.setValue( 'dampening' , .0001 );
      
      for( var i = 0; i < this.audio.array.length; i++ ){
        if( i == 5 || i == 6 ){
          this.audio.array[i].fadeIn( 10 , 1 );
        }
      }

    }.bind( sun )


  });

  this.sectionParams.push({
    
    cameraPosition: new THREE.Vector3( 400 , -1500 ,  1600 ), 
    lookPosition: new THREE.Vector3(  400 , -1000 ,  0 ),
    transitionTime:3000,
    textChunk:TEXT.SUN[11],

    transitionIn:function(){


      this.flower.setValue( 'windSpeed' , .001 );
      this.flower.setValue( 'springLength' , .5/31 );
     // this.flower.setValue( 'dampening' , .0001 );
      
   
    }.bind( sun )


  });

  
  
  
  this.position.set(  12000 , 3000 , -5000 );
  this.iPlaneDistance = 1000;

  this.audioArray = [

    'sun1',
    'sun2',
    'sun3',
    'sun4',
    'sun5',
    'sun6',
    'sun7',

  ]

  this.audio = {};
  this.audio.array = [];


  var f = 'pages/sun/';

  this.loadShader( 'sun' , f + 'ss-sun' , 'simulation' );

  this.loadShader( 'sun' , f + 'vs-sun' , 'vertex' ); 
  this.loadShader( 'sun' , f + 'fs-sun' , 'fragment' ); 

  this.loadShader( 'lookingGlass' , f + 'vs-lookingGlass' , 'vertex' ); 
  this.loadShader( 'lookingGlass' , f + 'fs-lookingGlass' , 'fragment' ); 

  this.loadShader( 'hologram' , f + 'vs-hologram' , 'vertex' ); 
  this.loadShader( 'hologram' , f + 'fs-hologram' , 'fragment' ); 

  this.loadShader( 'holoborder' , f + 'vs-holoborder' , 'vertex' ); 
  this.loadShader( 'holoborder' , f + 'fs-holoborder' , 'fragment' ); 

  this.loadShader( 'cloth' , f + 'vs-cloth' , 'vertex' ); 
  this.loadShader( 'cloth' , f + 'fs-cloth' , 'fragment' ); 
  this.loadShader( 'cloth' , f + 'ss-cloth' , 'simulation' ); 

}.bind( sun ) );


// Need to load at least 1 thing
sun.addToInitArray( function(){
  
  var f = 'img/matcap/';
  this.loadTexture( 'matcapMetal' , f + 'metal.jpg');
  this.loadTexture( 'sand' , 'img/normals/sand.png' );
  

  var f = 'audio/pages/sun/'

  for( var i = 0; i < this.audioArray.length; i++ ){
    
    var name = this.audioArray[i];

    this.audio[ name ] = this.loadAudio( name , f + name + '.mp3' );
 
    //this.audio[ name ].updateAnalyser = true;
    //this.audio[ name ].updateTexture = true;

    this.audio.array.push( this.audio[ name ] );


  }

  

}.bind( sun ) );


sun.addToStartArray( function(){

  this.scene.remove( this.motes.body );
  //G.position.copy( this.position );
  //G.camera.position.copy( this.cameraPos );
  //G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

   //console.log('HELLLOAAA');
     // console..lg( this.audio );


  for( var i = 0; i < this.audio.array.length; i++ ){

   // console.log('yes');
    this.audio.array[i].gain.gain.value = 0;

  }

   for( var i = 0; i < this.audio.array.length; i++ ){
      if( i == 6 || i == 0 ){
        this.audio.array[i].fadeIn( 10 , 1 );
      }
    }



}.bind( sun ));


sun.addToStartArray( function(){

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 78,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });

  for( var i = 0; i < this.audioArray.length; i++ ){

    var audio = G.AUDIO[ this.audioArray[i] ];
    audio.reconnect( this.gain );

    this.looper.everyLoop( function(){ this.play() }.bind( audio ) );

  }

  this.looper.start();


}.bind( sun ) );

sun.addToStartArray( function(){


  this.repelers = [];

   for(var i = 0; i < 50; i++ ){

      var mesh = new THREE.Mesh( G.GEOS.icosahedron, G.MATS.normal  );
      mesh.target   = new THREE.Vector3();//toCart( 12 , t , p );
      mesh.velocity = new THREE.Vector3();
      mesh.power    = new THREE.Vector3( 1 , 1 , 1);
      mesh.radius   = new THREE.Vector3( 1 , 1 , 1);
      mesh.scale.multiplyScalar( 10 );
      this.repelers.push( mesh );

      //this.scene.add( mesh );

      mesh.position.x = (Math.random() - .5 ) * 2000;
      mesh.position.z = (Math.random() - .5 ) * 2000;
      mesh.position.y = (Math.random() - .5 ) * 2000;
      mesh.position.normalize();
      mesh.position.multiplyScalar( 4000 );

    }


  // console.log('GES');
  // console.log( G.GEOS.sun );

  var mesh = new THREE.Mesh(  G.GEOS.sun ); 
  this.gem = new RepelerMesh( 'Parameters' , mesh , this.repelers , {

        
    vs: G.shaders.vs.sun,

    fs: G.shaders.fs.sun,

    soul:{

      repulsionPower:     { type:"f" , value: 1000000, constraints:[-300  , 0] },
      repulsionRadius:     { type:"f" , value:10000 , constraints:[ 0  , 1000] },
    },

    body:{
      //t_refl:{type:"t" , value:reflectionCube},
      //t_refr:{type:"t" , value:reflectionCube },
      custom1:{type:"f" , value:.9 , constraints:[ .8 , 1 ]},
      t_sem:{type:"t" , value: G.TEXTURES.matcapMetal }

    }

  }); 

  this.gem.soul.reset( this.gem.t_og.value );
  this.gem.toggle( this.scene );

  //this.gem.debug( this.scene , 1 , 100 );

  
  
  this.flower = new Sunflower();
  this.flower.add( this.scene );


 // this.hypercube  = new Hypercube( 30 );
  //this.holocubeC = new Holocube( 100 , 2 );
  //this.holocube.add( this.scene );
  //this.scene.add( this.hypercube.body );
  //this.scene.add( this.hypercube.body );
 
  this.hyperborder = new Hyperborder( 200 );
  this.hyperdots = new Hyperdots( 250 );
 // this.hyperlines = new Hyperlines( 300 );

//  console.log( this.hyperborder );
/* 

  this.hyperborder2 = new Hyperborder( 80 );
  this.hyperborder2.body.position.x = 200;
  this.hyperborder2.body.position.y = 300;
  this.hyperborder2.body.position.z = 100;

  this.hyperlines2 = new Hyperdots( 100 );
  this.hyperlines2.body.position.x = 200;
  this.hyperlines2.body.position.y = 300;
  this.hyperlines2.body.position.z = 100;*/
 
 // this.hypercircle = new Hypercircle( 150 );
  //this.hypercircle.body.position.z = 30
  
 //this.scene.add( this.hypercircle.body );
 ///this.scene.add( this.hyperborder.body );
 //this.scene.add( this.hyperdots.body );
 // this.scene.add( this.hyperlines.body );


  this.lookingGlass = new THREE.LookingGlass( G.renderer, G.camera, { clipBias: 0.3, textureWidth: G.windowSize.x * G.dpr.value, textureHeight:G.windowSize.y* G.dpr.value , color: 0x777777 } ); 

  var g = new THREE.CircleGeometry( 150 , 32 );
  this.mirrorMesh = new THREE.Mesh( g , this.lookingGlass.material );
  this.mirrorMesh.add( this.lookingGlass );
  //this.mirrorMesh.rotateX( - Math.PI / 2 );
  this.mirrorMesh.position.z = 00;
 
  this.scene.add( this.mirrorMesh );

  this.lookingGlass.render();



}.bind( sun ));




sun.addToAllUpdateArrays( function(){

  
  this.gem.update();
  this.flower.update();
 
  G.v2.copy( G.camera.position.relative  );
  //this.holocube.body.lookAt( G.mani.position.relative );
  G.v1.set( 0, 0, 1 );
  G.v1.applyQuaternion( G.camera.quaternion );
  G.v1.multiplyScalar( 300 );
  G.v2.add( G.v1 );
  //this.hypercube.body.position.copy( G.v2 );
  this.hyperborder.body.position.copy( G.v2 );
  //this.hypercircle.body.position.copy( G.v2 );
  this.hyperdots.body.position.copy( G.v2 );
  //this.hyperlines.body.position.copy( G.v2 );
  
  this.hyperborder.body.lookAt(G.mani.position.relative );
  //this.hypercube.body.lookAt(G.mani.position.relative );
  this.hyperdots.body.lookAt( G.mani.position.relative )
 
  //this.hypercube.update();
  this.hyperdots.update();
  this.hyperborder.update();
  //this.hyperlines.update();
  
  //his.hypercircle.update(); 
  

  /*
  
     Hiding some stuff before we render

  */

  var tmpVis = [];
  for( var  i = 0; i< this.sections.length; i++ ){
    tmpVis.push( this.sections[i].text.particles.visible );
  }

  for( var i = 0; i < this.sections.length; i++ ){
     this.sections[i].text.particles.visible = false;
     this.sections[i].frame.body.visible = false;
  }
  this.flower.visible = false;
  this.lookingGlass.render();
  this.flower.visible = true;
   for( var i = 0; i < this.sections.length; i++ ){
     this.sections[i].frame.body.visible = true;
     this.sections[i].text.particles.visible = tmpVis[i];
  }
 


  for( var i = 0; i < this.repelers.length; i++ ){

    var a = G.audio.analyzer.array;
    
    var ind = i / ( 4 * this.repelers.length); 
    var fI = Math.floor( ind * G.audio.analyzer.array.length );
    var p = G.audio.analyzer.array[ fI ];

    //PARAMS.soul.aPower.value[i].x = p / 256;
    //var l = a.varlu

    this.repelers[i].power.x = p / 256; 

  }

}.bind( sun ));


sun.addToEndArray( function(){

  this.looper.end();

}.bind( sun) );

