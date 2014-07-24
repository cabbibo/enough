function PageTurner( pages ){

  this.pageLoaded = true;

  
  this.markerGeo =  new THREE.IcosahedronGeometry( 40 , 1 );

  this.neutralMaterial = new THREE.MeshNormalMaterial();
  this.hoverMaterial = new THREE.MeshBasicMaterial({ color:0xff0000 });

}

PageTurner.prototype.nextPage = function( page ,  length  ){

  
  this.prevPage = page;
  this.nextPage = page.nextPage;
  this.length = length

  if( !this.nextPage ){

    console.log( 'NO NEW PAGE' );

  }

  page.deactivate();
 
  /*
  
     Sees if there is a next page,
     If there is but it isn't loaded,
     times out again and again to check if it is loaded

  */
  if(this.nextPage ){

    if( this.nextPage.loaded === false ){

      if( this.pageLoaded === true ){
        
        this.pageLoaded = false;
        this.addLoading();

      }
      
      window.setTimeout( function(){

        this.nextPage( this.prevPage, this.length ); 

      }.bind( this ), 1000);
      
      return;

    }else{

      if( this.pageLoaded === false ){

        this.removeLoading();
        this.pageLoaded = true;

      }

      this.nextPage.start();

    }

  }else{

    console.log( 'NO NEW PAGE' );
    G.endBook(); //TODO

  }


  this.sceneStartPos = page.position.clone();
  this.sceneEndPos   = page.nextPage.position.clone();

  this.camStartPos   = G.camera.position.clone();
  this.camEndPos     = page.nextPage.cameraPos.clone();


  this.distStart = { d: G.iPlaneDistance }
  this.distEnd   = { d: page.nextPage.iPlaneDistance }

  console.log( page.nextPage )

  console.log( this.camStartPos );
  console.log( this.camEndPos );

  var l = length * 1000;
  var tween = new G.tween.Tween( this.camStartPos ).to( this.camEndPos , l );
  
  tween.onUpdate( function( t ){

    G.camera.position.copy( this.camStartPos );
    this.prevPage.gain.gain.value = 1-t;
    this.nextPage.gain.gain.value = t;

    G.objectControls.unprojectMouse();


  }.bind( this ));

  tween.onComplete( function( t ){

    page.end();
    page.nextPage.activate();
  
  }.bind( this ));


  var s = this.sceneStartPos , e = this.sceneEndPos;
 
  var tween1 = new G.tween.Tween( s ).to( e , l);
  
  tween1.onUpdate( function( t ){

    G.position.copy( this.sceneStartPos );
    G.camera.lookAt( G.position );

  }.bind( this ));

  tween1.onComplete( function( t ){

  }.bind( this ));

  var tween2 = new G.tween.Tween( this.distStart ).to( this.distEnd , l);
  
  tween2.onUpdate( function( t ){

    G.iPlaneDistance = this.distStart.d;

  }.bind( this ));

  tween2.onComplete( function( t ){

  }.bind( this ));


  tween.start();
  tween1.start();
  tween2.start();


}

PageTurner.prototype.prevPage = function(){


}

PageTurner.prototype.jumpToPage = function(){


}

PageTurner.prototype.turnPage = function( page ,  length ){


}

//TODO: Make it so that if page is not loaded,
//we can add and remove some sort of loading bar
PageTurner.prototype.addLoading = function(){


}

PageTurner.prototype.removeLoading = function(){


}

PageTurner.prototype.createMarker = function( page , offset ){

  offset = offset || new THREE.Vector3( 200 , -300 , 0 );
  var mesh = new THREE.Mesh(
    this.markerGeo,
    this.neutralMaterial 
  );

  mesh.select = function(){

   this.nextPage( page ,  10 );

  }.bind( this );

  mesh.hoverOver = function(){

    this.pageTurner.material = this.hoverMaterial;
    this.pageTurner.materialNeedsUpdate = true;

  }.bind( this );

  mesh.hoverOut = function(){

    this.pageTurner.material = this.neutralMaterial;
    this.pageTurner.materialNeedsUpdate = true;

  }.bind( this );

  mesh.position.copy( G.camera.position.relative );
  
  var forward  = new THREE.Vector3( 0 , 0 , -1 );
  forward.applyQuaternion( G.camera.quaternion );
  forward.normalize();
  forward.multiplyScalar( G.iPlaneDistance );

  console.log( G.iPlaneDistance );
  mesh.position.add( forward );

  mesh.position.add( offset );

  mesh.neutralMaterial = this.neutralMaterial
  mesh.hoverMaterial = this.hoveMaterial

  G.objectControls.add( mesh );
  this.pageTurner = mesh;

  return mesh;

}

