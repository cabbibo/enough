function Section( id, page , text , position , params ){

  this.page = page;

  this.params = _.defaults({

    offset: G.pageTurnerOffset,
    transitionTime: 


    begin:function(){

      console.log('begin' );

    },
    end:function(){
      console.log( 'end' );
    }

    transitionIn:function(){

      console.log('transitioning');

    }

    transitionOut:function(){


    }
    
  });


}

Section.prototype.begin = function(){

  this.text.activate();


  if( this.page.sections[ id+1 ] ){  

    var mesh  = this.page.createTurnerMesh( this.params.offset , callback ); 
    this.page.scene.add( this.mesh );

  }else{

    this.endMesh.add( this );

  }

}

Section.prototype.createTweenTransition = function(){

  var transitionTime = this.params.transitionTime;

  if(  transitionTime == "endOfLoop" ){
    
    var percentTilEnd = 1 - this.looper.percentOfMeasure;
    var timeTilEnd = percentTilEnd * this.looper.measureLength;

    transitionTime = (timeTilEnd-.01) * 1000;

  }
 
  var position = this.position( 
  this.tweenCamera( this.cameraPos2 , transitionTime  , function(){


    var cb = this.callback.bind( this.page );
    cb();

    if( this.page.sections[ id+1 ] ){  


    }


  }.bind( this ));



}

Section.prototype.update = function(){

  this.text.update();

}




