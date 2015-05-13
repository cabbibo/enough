/* 
 
   For each page:

   Order:
    
    1)  Init is called, setting up what needs to be loaded ( called by user )
    
    2)  After all items are loaded, 'onLoad' is called ( called by page )
    
    3)  At a designated time 'start' is called ( called by user )
        this section will do all of the creation of objects, etc.
    
    4)  At this same time 'starting' is activated, and the 'starting'
        array is called every frame. ( called by paged ) 
    
    5)  during the 'starting' update period, the page will check to see if it 
        should be active. If it finds out that it is active, it will call 'activate'
        ending the 'starting' period 

    6)  Now the page will run and run and run calling the 'activeArray' updates
        every frame.

    7)  At some point in time, the user will 'deactivate' the page, which will
        begin the 'ending' array being updated.

    8)  The ending array will continue to be called until if finds out that the page
        has ended, at which point it will call 'end'

    9)  When end is called, TODO: WHAT HAPPENS?!?!?
   Notes:

    - need to add a end check to ending and activating check to starting

   Questions:
      
    - How to space out the creation of all the assests, so we don't 'choke'
      the page before when 'st

  TODO:
    
 */


function Page( name , params ){

  G.pages[ name ]   = this;

  this.name         = name;

  this.initialized  = false;
  this.loaded       = false;
  this.started      = false;
  this.starting     = false;
  this.active       = false;
  this.ending       = false;

  this.finishedStartArray = false;
  this.addingStartArray = false;

  this.initArray      = [];
  
  this.onLoadArray    = [];

  this.startArray     = [];
  this.endStartArray  = [];
  this.startingArray  = [];
 
  this.activateArray    = [];
  this.activeArray      = [];
  this.deactivateArray  = [];

  this.endingArray    = [];
  this.endArray       = [];

  // SECTIONS
  this.sections       = [];
  this.sectionParams  = [];


  this.frame          = 0;
  
  this.loader         = new PageLoader();
  this.loader.onStart = this.onLoad.bind( this );

  // Audio
  this.gain = G.audio.ctx.createGain();
  this.gain.connect( G.audio.gain );

  // THREE.JS
  this.scene    = new THREE.Object3D();
  this.position = this.scene.position;

  // Where the camera should be at the beginning of the scene
  this.cameraPos = new THREE.Vector3();

  this.gui = G.gui.addFolder( name );

  this.proptArray = [];


  for( var propt in this ){

    this.proptArray.push( propt );

  }

}

Page.prototype.update = function(){

  if( this.started ){

    for( var i = 0; i < this.sections.length; i++ ){

      this.sections[i]._update();

    }

    this.frame ++;

    this.motes.update();

    if( this.addingStartArray === true ){


      var dif = this.frame - this.startFrame - 1;

     // console.log( dif );
     // console.log( this.startArray.length );
      
      if( dif === this.startArray.length ){

        //console.log( 'finish' );
        this.finishedStartArray = true;
        this.addingStartArray = false;

        // If we need to call something at the end of it all
        for( var i = 0; i < this.endStartArray.length; i++ ){
          this.endStartArray[i]();
        }


      }else{

        this.startArray[ dif ]();

      }


    }
    if( this.finishedStartArray === true ){
      
      // Transition phase
      if( this.starting ){

        for( var i = 0; i < this.startingArray.length; i++ ){

          this.startingArray[i]();

        }

      }

      // While active
      if( this.active ){

        if( (this.frame - this.startFrame) <= this.startingArray.length ){
    
          console.log('WRONG WRONG WRONG');

        }

        for( var i = 0; i < this.activeArray.length; i++ ){
          this.activeArray[i]();
        }

      }

      // Transition phase
      if( this.ending ){

        for( var i = 0; i < this.endingArray.length; i++ ){
          this.endingArray[i]();
        }

      }

    }

    
  }else{

    //console.log( 'This Page should not be updating' );

  }

}

// Used to begin all the loading needed
Page.prototype.init = function(){

  //console.log( 'PAGE INITILIZED  ' + this.name );
  this.initialized = true;

  for( var i = 0; i < this.initArray.length; i++ ){
    this.initArray[i]( this );
  }

  
  this.motes = new DustMotes();
  this.scene.add( this.motes.body );

  this.createSections( this.sectionParams );
  this.assignSections();

  this.cameraPos.copy( this.sections[0].cameraPosition );

}


// Once everything has been loaded
Page.prototype.onLoad = function(){

  //console.log( 'PAGE LOADED  ' + this.name  );
  this.loaded = true;

  for( var i = 0; i < this.onLoadArray.length; i++ ){

    this.onLoadArray[i]( this );

  }

}

Page.prototype.start = function(){

  G.currentPage = this;
  G.nextPage = this.nextPage;

  if( !this.loaded  ){
    alert('PAGE NOT LOADED ' + this.name);
  }

 // console.log( 'PAGE STARTED ' + this.name );

  if( this.nextPage ){

    //console.log('THERES NEXT PAGE ' + this.name );
    if( !this.nextPage.initialized ){
      this.nextPage.init();
      //console.log( 'INITIALIZING ' + this.name + ' ' + this.nextPage.name );
    }

  }else{
  
   // console.log( 'NO NEXT PAGE ' + this.name );

  }

  this.started  = true;
  this.starting = true;

  this.startFrame = this.frame;

  this.addingStartArray = true;


  G.scene.add( this.scene );

  if( this.sections[0].frame.fish ){
    this.sections[0].frame.fish.activate( this.scene );
  }
  this.sections[0].active = true;
  

}

Page.prototype.activate = function(){

 // console.log( 'PAGE ACTIVATED ' + this.name );

  this.endMesh = G.pageTurner.createMarker( this );

  this.active   = true;
  this.starting = false;

  for( var i = 0; i < this.activateArray.length; i++ ){
    this.activateArray[i]( this );
  }

  this.sections[0]._transitionIn();

}

Page.prototype.deactivate = function(){

  //console.log( 'PAGE DEACTIVATED ' + this.name );

  this.active = false;
  this.ending = true;
  for( var i = 0; i < this.deactivateArray.length; i++ ){
    this.deactivateArray[i]( this );
  }

  this.sections[ this.sections.length - 1 ].text.kill();

}

Page.prototype.end = function(){

 // console.log( 'PAGE ENDED ' + this.name  );
  
  this.ending   = false;
  this.started  = false;
  this.ended    = true;

  for( var i = 0; i < this.endArray.length; i++ ){
    this.endArray[i]();
  }

  G.scene.remove( this.scene );

  for( var propt in this ){

    var needPropt = false;
    for( var i =0; i < this.proptArray.length; i++ ){
      if( this.proptArray[i] === propt ) needPropt = true;
    }

    if( propt === 'proptArray' ){ needPropt = true; }

    if( !needPropt ){

      this[ propt ] = null;

    }

  }
  //this = undefined;

}


Page.prototype.addToAllUpdateArrays = function( callback ){

  this.addToStartingArray(  callback );
  this.addToActiveArray(    callback );
  this.addToEndingArray(    callback );

}

Page.prototype.addToStartingArray = function( callback ){
  this.startingArray.push( callback );
}

Page.prototype.addToEndingArray = function( callback ){
  this.endingArray.push( callback );
}

Page.prototype.addToActiveArray = function( callback ){
  this.activeArray.push( callback );
}


// Event Arrays
Page.prototype.addToInitArray = function( callback ){
  //console.log('added to load array' );
  this.initArray.push( callback );
}

Page.prototype.addToOnLoadArray = function( callback ){
  //console.log('added to load array' );
  this.onLoadArray.push( callback );
}

Page.prototype.addToStartArray = function( callback ){
  this.startArray.push( callback );
}

Page.prototype.addToEndStartArray = function( callback ){
  this.endStartArray.push( callback );
}




Page.prototype.addToActivateArray = function( callback ){
  this.activateArray.push( callback );
}

Page.prototype.addToDeactivateArray = function( callback ){
  this.deactivateArray.push( callback );
}


Page.prototype.addToEndArray = function( callback ){
  this.endArray.push( callback );
}





// Sections
Page.prototype.createSections = function(params){

  for( var i = 0; i < params.length; i++ ){
    this.sections.push( new Section( i , this , params[i] ) );
  }

};

Page.prototype.assignSections = function(){

  for( var i = 0; i < this.sections.length; i++ ){

    if( i > 0 ){
      this.sections[i].prevSection = this.sections[i-1];
    }
    if( i < this.sections.length -1 ){
      this.sections[i].nextSection = this.sections[i+1]
    }

  }

}














// Some extra functions 

Page.prototype.tweenCamera = function( newPos , length , callback , lookAtPos , updateFunction ){

  var lookAt = lookAtPos;


  var tween = new G.tween.Tween( this.cameraPos ).to( newPos , length );

  tween.onUpdate( function( t ){

    G.camera.position.copy( this.cameraPos );
    G.objectControls.unprojectMouse();

    G.camera.lookAt( G.lookAt );
    updateFunction( t );


  }.bind( this ));


  tween.onComplete( function(){

    this.cameraPos.x = newPos.x ;
    this.cameraPos.y = newPos.y ;
    this.cameraPos.z = newPos.z ;

    G.camera.position.copy( newPos );
    G.objectControls.unprojectMouse();

    G.lookAt.copy( lookAtPos );
    G.camera.lookAt( G.lookAt );

    callback();

  }.bind( this ) );

  tween.start();

  var s = { x: G.lookAt.x , y: G.lookAt.y , z: G.lookAt.z };
  var e = { x:   lookAt.x , y:   lookAt.y , z:   lookAt.z };

  var tween2 = new G.tween.Tween( s ).to( e , length );
  tween2.onUpdate( function(t){

    G.lookAt.x = this.x;
    G.lookAt.y = this.y;
    G.lookAt.z = this.z;

  });

  tween2.start();
}




Page.prototype.createTurnerMesh = function( offset , callback ){

  var mesh = new THREE.Mesh(
    G.pageTurner.markerGeometry,
    G.pageTurner.markerMaterial.clone()
  );


  mesh.hoverOver = function(){

    this.material.opacity = .8;

  }.bind( mesh );

  mesh.hoverOut = function(){

    this.material.opacity = .4;

  }.bind( mesh );

  mesh.select = function(){

    G.objectControls.remove( this );

   // console.log( this )
    this.parent.remove( this );
    if( !this.beenClicked ){
      callback();
    }

    this.beenClicked = true;

  };//.bind( mesh );

 /* mesh.position.copy( G.camera.position.relative );

  var forward  = new THREE.Vector3( 0 , 0 , -1 );
  forward.applyQuaternion( G.camera.quaternion );
  forward.normalize();
  forward.multiplyScalar( G.iPlaneDistance );

  //console.log('HELLO');
  //console.log( G.iPlaneDistance );

  //console.log( G.iPlaneDistance );
 // mesh.position.add( forward );

  G.tmpV3.copy( offset );
  G.tmpV3.applyQuaternion( G.camera.quaternion );
  mesh.position.add(  G.tmpV3 );

  G.tmpV3.copy( mesh.position );
  mesh.lookAt( G.tmpV3.sub( forward ) );*/

 // G.objectControls.add( mesh );

  return mesh;

}















// Load Functionality

Page.prototype.loadAudio = function( name ,  file , params ){
  
  if( !G.AUDIO[ name ] ){
    
    this.loader.addLoad();

    G.AUDIO[ name ]= new LoadedAudio( G.audio , file , params );

    G.AUDIO[ name ].onLoad = function(){

      /*  

      console.log('Loaded Audio');
      console.log('name: ' + name );
      console.log('audio:');
      console.log( G.AUDIO[ name ] ); 
    
      */

      this.loader.onLoad();

    }.bind( this );

    return G.AUDIO[ name ];

  }else{

    return G.AUDIO[ name ];

  }

}


Page.prototype.loadTexture = function( name , file , params ){

  params = params || {};

  if( G.TEXTURES[name] ){

    return G.TEXTURES[name] 

  }else{
   
    var cb = function(){
      this.loader.onLoad(); 
    }.bind( this );

    var m = params.mapping || THREE.UVMapping;

    var l = THREE.ImageUtils.loadTexture;

    this.loader.addLoad();
    
    G.TEXTURES[ name ] = THREE.ImageUtils.loadTexture( file , m , cb );
    G.TEXTURES[ name ].wrapS = params.wrapping || THREE.RepeatWrapping;
    G.TEXTURES[ name ].wrapT = params.wrapping || THREE.RepeatWrapping;

    return G.TEXTURES[name];

  }

}

Page.prototype.loadGeo = function( name , file , params ){

  if( !G.GEOS[ name ] ){

    // TODO:


  }


}


Page.prototype.loadShader = function( name , file , type ){

  var t = 'vs';
  if( type === 'vs' || type === 'vertex' || type === 'vertexShader' ){
    type = 'vertex';
    t = 'vs';
  }

  if( type === 'fs' || type === 'fragment' || type === 'fragmentShader' ){
    type = 'fragment';
    t = 'fs';
  }
  if( type === 'ss' || type === 'simulation' || type === 'simulationShader' ){
    type = 'simulation';
    t = 'ss';
  }

  if( !G.shaders[t][ name ] ){

    this.loader.addLoad();

    G.shaders.load( file , name , type , function(){
      this.loader.onLoad();
    }.bind( this ));

    return G.shaders[t][ name ];

  }else{

   // console.log( 'ALREADY LOADED:  ' + type + '   ' + name + ' ' + this.name );
    return G.shaders[t][ name ]; 

  }

}


Page.prototype.resizeFrames = function(){
  for( var i = 0; i < this.sections.length; i++ ){
    this.sections[i].frame.createFrame( this.sections[i].frame.isFish );
  }
}


