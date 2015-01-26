function Section( id , page , params ){

  this.page = page;
  this.id = id;

  this.prevSection = undefined;
  this.nextSection = undefined;

  this.active = false;

  this.params = _.defaults(params || {} , {

    text: null,
    
    offset: G.pageTurnerOffset,
    transitionTime: "endOfLoop",
    textDeathTime: 3000,

    cameraPosition: G.position.relative,
    lookPosition: G.tmpV3.set( 0 , 0 , 0 ),


    transitionIn:   function(){ console.log( 'tranIn'   );},
    start:          function(){ console.log( 'start'    );},
    transitionOut:  function(){ console.log( 'tranOut'  );},
    end:            function(){ console.log( 'end'      );},
    
  });


  //bubblin up dem params
  for( var propt in this.params ){
    this[propt] = this.params[propt];
  }

  //if( !this.text ){ console.log('NO TEXT YA FOOL'); }

}

Section.prototype._start = function(){
 
  this.start();

  this.text.activate();

  if( this.nextSection ){  

    var callback = this.nextSection.createTransitionInCallback();

    var mesh  = this.page.createTurnerMesh( this.offset , callback );
    this.page.scene.add( mesh );

  }else{

    this.page.endMesh.add( this.page );

  }

}

Section.prototype._end = function(){

  this.active = false;
  this.end();

}

Section.prototype._transitionOut = function(){
  this.text.kill( this.textDeathTime );

  this.transitionOut();

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

    this.page.tweenCamera( this.cameraPosition , transitionTime  , function(){

      this.prevSection._end();
      this._start();
        
    }.bind( this ));
    
  }.bind( this );

  return callback;



}

Section.prototype.update = function(){

  this.text.update();

}




