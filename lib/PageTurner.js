function PageTurner( pages ){


}

PageTurner.prototype.nextPage = function( page ,  length  ){

  this.sceneStartPos = page.position.clone();
  this.sceneEndPos   = page.nextPage.position.clone();

  this.camStartPos   = G.camera.position.clone();
  this.camEndPos     = page.nextPage.cameraPos.clone();



  var l = length * 1000;
  var tween = new G.tween.Tween( this.camStartPos ).to( this.camEndPos , l );
  
  tween.onUpdate( function( t ){

    G.camera.position.copy( this.camStartPos );

  }.bind( this ));

  tween.onComplete( function( t ){

    console.log('WHOAs');

  }.bind( this ));


  var s = this.sceneStartPos , e = this.sceneEndPos;
 
  var tween1 = new G.tween.Tween( s ).to( e , l);
  
  tween1.onUpdate( function( t ){

    G.position.copy( this.sceneStartPos );
    G.camera.lookAt( G.position );

  }.bind( this ));

  tween1.onComplete( function( t ){

    console.log('WHOAs1');

  }.bind( this ));

  tween.start();
  tween1.start();


}

PageTurner.prototype.prevPage = function(){


}

PageTurner.prototype.jumpToPage = function(){


}

PageTurner.prototype.turnPage = function( page ,  length ){




}
