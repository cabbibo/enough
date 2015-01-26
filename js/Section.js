function Section( page , params ){

  this.page = page;

  this.prevSection = undefined;
  this.nextSection = undefined;

  this.params = _.defaults({

    text: null,
    
    offset: G.pageTurnerOffset,
    transitionTime: "endOLoop",

    cameraPosition: G.position.relative,
    lookPosition: G.tmpV1.set( 0 , 0 , 0 ),

    transitionIn:   function(){ console.log( 'tranIn'   );},
    start:          function(){ console.log( 'start'    );},
    transitionOut:  function(){ console.log( 'tranOut'  );},
    end:            function(){ console.log( 'end'      );},
    
  });

  //bubblin up dem params
  for( var propt in this.params ){
    this[propt] = this.params[propt];
  }

  if( !this.text ){ console.log('NO TEXT YA FOOL'); }

}

Section.prototype._begin = function(){
  
  this.begin();

  this.text.activate();

  if( this.nextSection ){  

    var callback = this.nextSection.createTransitionInCallback();

    var mesh  = this.page.createTurnerMesh( this.params.offset , callback ); 
    this.page.scene.add( this.mesh );

  }else{

    this.endMesh.add( this );

  }

}

Section.prototype.createTransitionInCallback = function(){


  var callback = function(){
   
    this.prevSection.transitionOut();
    this.transitionIn();

    var transitionTime = this.params.transitionTime;

    if(  transitionTime == "endOfLoop" ){
      
      var percentTilEnd = 1 - this.looper.percentOfMeasure;
      var timeTilEnd = percentTilEnd * this.looper.measureLength;

      transitionTime = (timeTilEnd-.01) * 1000;

    }
   
    this.tweenCamera( this.nextPage.cameraPosition , transitionTime  , function(){

      this.prevSection._end();
      this._begin();
      

    }.bind( this ));

  }.bind( this.page );

  return callback;



}

Section.prototype.update = function(){

  this.text.update();

}




