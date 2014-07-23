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

  G.pages[ name ]  = this;

  this.initialized  = false;
  this.loaded       = false;
  this.started      = false;
  this.starting     = false;
  this.active       = false;
  this.ending       = false;

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

}

Page.prototype.update = function(){

  if( this.started ){

    this.frame ++;

    // Transition phase
    if( this.starting ){

      for( var i = 0; i < this.startingArray.length; i++ ){

        this.startingArray[i]();

      }

    }

    // While active
    if( this.active ){

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

    // Only call end start array once 
    // we have the second frame 
    // AKA G.renderer.render has been called once
    if( this.frame === 2 ){

      for( var i = 0; i < this.endStartArray.length; i++ ){
        this.endStartArray[i]();
      }

    }

  }else{

    //console.log( 'This Page should not be updating' );

  }


}

// Used to begin all the loading needed
Page.prototype.init = function(){

  console.log( 'PAGE INITILIZED' );
  this.initialized = true;

  for( var i = 0; i < this.initArray.length; i++ ){
    this.initArray[i]( this );
  }

}
// Once everything has been loaded
Page.prototype.onLoad = function(){

  console.log( 'PAGE LOADED' );
  this.loaded = true;

  for( var i = 0; i < this.onLoadArray.length; i++ ){

    this.onLoadArray[i]( this );

  }

}

Page.prototype.start = function(){

  if( !this.loaded  ){
    alert('PAGE NOT LOADED');
  }

  console.log( 'PAGE STARTED' );

  this.started  = true;
  this.starting = true;

  for( var i = 0; i < this.startArray.length; i++ ){
    this.startArray[i]();
  }

  G.scene.add( this.scene );


}

Page.prototype.activate = function(){

  console.log( 'PAGE ACTIVATED' );

  this.active   = true;
  this.starting = false;

  for( var i = 0; i < this.activateArray.length; i++ ){
    this.activateArray[i]( this );
  }

}

Page.prototype.deactivate = function(){

  console.log( 'PAGE DEACTIVATED' );

  this.active = false;
  this.ending = true;
  for( var i = 0; i < this.deactivateArray.length; i++ ){
    this.deactivateArray[i]( this );
  }

}

Page.prototype.end = function(){

  console.log( 'PAGE ENDED' );
  this.ending   = false;
  this.started  = false;
  this.ended    = true;

  for( var i = 0; i < this.endArray.length; i++ ){
    this.endArray[i]();
  }

  G.scene.remove( this.scene );

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

  if( !G.TEXTURES[ name ] ){
    this.loader.addLoad();

    //TODO:
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

    console.log( 'ALREADY LOADED:  ' + type + '   ' + name );
    return G.shaders[t][ name ]; 

  }


}



