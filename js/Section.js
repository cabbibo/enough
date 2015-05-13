function Section( id , page , params ){

  this.page = page;
  this.id = id;

  this.prevSection = undefined;
  this.nextSection = undefined;

  this.active  = false;
  this.current = false; 

  this.params = _.defaults(params || {} , {

    offset: G.pageTurnerOffset,
    transitionTime: "endOfLoop",
    textDeathTime: 3000,

    cameraPosition:   G.position.relative,
    lookPosition:     new THREE.Vector3(),

    transitionIn:     function(){},
    start:            function(){},
    transitionOut:    function(){},
    end:              function(){},
    transitioningOut: function(){},
    transitioningIn:  function(){},
    currentUpdate:    function(){},
    activeUpdate:     function(){},

    fish:             false,
    frameShown:       true
    
  });


  //bubblin up dem params
  for( var propt in this.params ){
    this[propt] = this.params[propt];
  }

  if( this.textChunk ){
    this.text = new PhysicsText( this.textChunk );
  }


  this.frame = new Frame( this , this.params.fish );

  this.page.scene.add( this.frame.body );
  if( !this.frameShown ){
    this.frame.frame.visible = false;
  }

}



Section.prototype._transitionIn = function(){

  if( !this.prevSection ){
    this.active = true;
    //this.frame.add();
    this._start();
  }else{
    //this.frame.add();

    this.frame.turnerMesh.material.opacity = .1
    this.active = true;
    this.transitionIn();
  }

  if( this.frame.fish ){
    this.frame.fish.activate( this.page.scene );
  }

}

Section.prototype._start = function(){
 
  this.start();

  if( this.text ){
   //console.log('ACTIVATINGS');
    this.text.activate();
  }

  this.current = true;

  if( this.nextSection ){  

    var callback = this.nextSection.createTransitionInCallback();

    var mesh  = this.page.createTurnerMesh( this.offset , callback );
    this.turnerMesh = mesh;
  //  this.page.scene.add( mesh );

    this.frame.setTurnCallbacks( this.turnerMesh )

  }else{

    if( this.page.nextPage ){
      this.turnerMesh = this.page.endMesh;
      //this.page.endMesh.add( this.page );

      this.frame.setTurnCallbacks( this.turnerMesh )
    }

  }

}

Section.prototype._transitionOut = function(){
  
  if( this.text ){
    this.text.kill( this.textDeathTime );
  }
  this.current = false;
  this.transitionOut();

}


Section.prototype._transitioningOut = function(t){
  
  this.frame.uniforms.opacity.value = 1-t;
  this.transitioningOut();

}

Section.prototype._transitioningIn = function(t){
  
  this.frame.uniforms.opacity.value = t;
  this.transitioningIn();

}


Section.prototype._end = function(){

  this.active = false;
  this.end();

}


Section.prototype.createTransitionInCallback = function(){

  var callback = function(){
   
    this.prevSection._transitionOut();
    this._transitionIn();

    var transitionTime = this.params.transitionTime;


    var looper = this.page.looper;
    if(  transitionTime == "endOfLoop" ){
     
      var percentTilEnd = 1 - looper.percentOfLoop;
      
      // Making sure the transition is never toooooo quick
      if( percentTilEnd < .3 ){
        percentTilEnd += 1;
      }

      var measureLength = looper.secondsPerBeat * looper.beatsPerMeasure * looper.measuresPerLoop; 

      var timeTilEnd = percentTilEnd * measureLength; //looper.loopLength;

      transitionTime = (timeTilEnd-.01) * 1000;

    }

    //var lookAt = this.lookPosition || this.page.position;
    this.page.tweenCamera( this.cameraPosition , transitionTime ,  function(){

      this.prevSection._end();
      this._start();
        
    }.bind( this ),
    this.lookPosition,
    function( t ){
      
      this._transitioningIn( t );
      this.prevSection._transitioningOut( t );
      
    }.bind( this ));
    
  }.bind( this );

  return callback;



}

Section.prototype._update = function(){

  if( this.text ){
    this.text.update();
  }
  
  if( this.active ){
    this.activeUpdate();
    this.frame.update();
  }

  if( this.current ){
    this.currentUpdate();
  }

}




