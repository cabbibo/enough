function Section( id , page , params ){

  console.log('PARAMS');
  console.log( params );
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

    transitionIn:     function(){ console.log( 'tranIn'   );},
    start:            function(){ console.log( 'start'    );},
    transitionOut:    function(){ console.log( 'tranOut'  );},
    end:              function(){ console.log( 'end'      );},
    transitioningOut: function(){},
    transitioningIn:  function(){},
    currentUpdate:    function(){},
    activeUpdate:     function(){},
    
  });


  //bubblin up dem params
  for( var propt in this.params ){
    this[propt] = this.params[propt];
  }

  if( this.textChunk ){
    this.text = new PhysicsText( this.textChunk );
  }

}



Section.prototype._transitionIn = function(){

  if( !this.prevSection ){
    this.active = true;
    this._start();
  }else{
    this.active = true;
    this.transitionIn();
  }

}

Section.prototype._start = function(){
 
  this.start();

  if( this.text ){
    this.text.activate();
  }

  this.current = true;

  if( this.nextSection ){  

    var callback = this.nextSection.createTransitionInCallback();

    var mesh  = this.page.createTurnerMesh( this.offset , callback );
    this.page.scene.add( mesh );

  }else{

    this.page.endMesh.add( this.page );

  }

}

Section.prototype._transitionOut = function(){
  
  if( this.text ){
    this.text.kill( this.textDeathTime );
  }
  this.current = false;
  this.transitionOut();

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

    if(  transitionTime == "endOfLoop" ){
      
      var percentTilEnd = 1 - this.page.looper.percentOfMeasure;
      
      // Making sure the transition is never toooooo quick
      if( percentTilEnd < .3 ){
        percentTilEnd += 1;
      }
      var timeTilEnd = percentTilEnd * this.page.looper.measureLength;

      transitionTime = (timeTilEnd-.01) * 1000;

    }

    //var lookAt = this.lookPosition || this.page.position;
    this.page.tweenCamera( this.cameraPosition , transitionTime ,  function(){

      this.prevSection._end();
      this._start();
        
    }.bind( this ),
    this.lookPosition,
    function( t ){
      
      this.transitioningIn( t );
      this.prevSection.transitioningOut( t );
      
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
  }

  if( this.current ){
    this.currentUpdate();
  }

}




