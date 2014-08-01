function PageTurner( pages ){

  this.pageLoaded = true;

  
  this.markerGeometry =  new THREE.PlaneGeometry( 80 , 80 );

  this.neutralColor = new THREE.Color( .5 , .5 , .5 );
  this.hoverColor   = new THREE.Color( .9 , .9 , .9 );

  this.markerMaterial = new THREE.MeshBasicMaterial({
    
    map: G.TEXTURES['logo'],
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: this.neutralColor
  });

 // this.hoverMaterial = new THREE.MeshBasicMaterial({ color:0xff0000 });

}

PageTurner.prototype.nextPage = function( page ,  length  ){

  
  this.fromPage = page;
  this.toPage = page.nextPage;
  this.length = length

  if( !this.toPage ){

    console.log( 'NO NEW PAGE' );

  }

  page.deactivate();
 
  /*
  
     Sees if there is a next page,
     If there is but it isn't loaded,
     times out again and again to check if it is loaded

  */
  if(this.toPage ){

    if( this.toPage.loaded === false ){

      console.log( 'PAGE NART LOADS' );

      if( this.pageLoaded === true ){
        
        this.pageLoaded = false;
        this.addLoading();

      }
      
      window.setTimeout( function(){

        this.nextPage( this.fromPage, this.length ); 

      }.bind( this ), 1000);
      
      return;

    }else{

      if( this.pageLoaded === false ){

        this.removeLoading();
        this.pageLoaded = true;

      }

      this.toPage.start();

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

  //console.log( page.nextPage )

  //console.log( this.camStartPos );
  //console.log( this.camEndPos );

  var l = length * 1000;
  var tween = new G.tween.Tween( this.camStartPos ).to( this.camEndPos , l );
  
  tween.onUpdate( function( t ){

    G.camera.position.copy( this.camStartPos );
    this.fromPage.gain.gain.value = 1-t;
    this.toPage.gain.gain.value = t;

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

PageTurner.prototype.createMarker = function( page , offset , length ){

  offset = offset || new THREE.Vector3( 300 , -300 , 0 );
  length = length || 50;

  var mesh = new THREE.Mesh(
    this.markerGeometry,
    this.markerMaterial 
  );

  mesh.select = function(){

    
    this.pageTurner.parent.remove( this.pageTurner );
    G.objectControls.remove( this.pageTurner );
    this.nextPage( page ,  length  );

  }.bind( this );

  mesh.hoverOver = function(){

    this.pageTurner.material.color = this.hoverColor;

  }.bind( this );

  mesh.hoverOut = function(){

    this.pageTurner.material.color = this.neutralColor;

  }.bind( this );

  mesh.add = function( page , offset ){
   
    offset = offset || new THREE.Vector3( 150 , -150 , 0 );

    console.log('OFFSET');
    console.log( offset );
    mesh.position.copy( G.camera.position.relative );
    
    var forward  = new THREE.Vector3( 0 , 0 , -1 );
    forward.applyQuaternion( G.camera.quaternion );
    forward.normalize();
    forward.multiplyScalar( G.iPlaneDistance );

    
  console.log('HELLO');
  console.log( G.iPlaneDistance );

    //console.log( G.iPlaneDistance );
    mesh.position.add( forward );


    G.tmpV3.copy( offset );
    G.tmpV3.applyQuaternion( G.camera.quaternion );
    mesh.position.add( offset );

    G.tmpV3.copy( mesh.position );
    mesh.lookAt( G.tmpV3.sub( forward ) );

    G.objectControls.add( mesh );

    page.scene.add( mesh );

  }
  this.pageTurner = mesh;

  return mesh;

}

