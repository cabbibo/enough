function Frame(section , fish ){

 // fish = true
  this.section = section;

  this.isFish = fish
  this.uniforms = {

    opacity: { type:"f" , value:0 },
    scale: { type:"v2" , value:G.windowSize},
    width:{type:"f" , value:3.},
    t_audio: G.t_audio

  }


  var geo = new THREE.PlaneBufferGeometry(1,1);
  var mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: G.shaders.vs.frame,
    fragmentShader: G.shaders.fs.frame,

    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
    transparent: true,
  });

  this.frame = new THREE.Mesh( geo , mat );

  this.body = new THREE.Object3D();
  this.body.add( this.frame )

  //this.section.page.scene.add( this.body );

  this.body.position.copy( this.section.params.cameraPosition );


  this.body.lookAt( this.section.params.lookPosition );
  G.v1.copy( this.section.params.cameraPosition );
  G.v1.sub( this.section.params.lookPosition );
  G.v1.normalize();
  G.v1.multiplyScalar( -1000 );
  this.body.position.add( G.v1 );

  this.createToggleMesh();
  this.createPostprocessingMesh();
  this.createTurnerMesh();

  this.createFrame(this.isFish);
  





  
}


Frame.prototype.update = function(){

  if( this.section.active == true  && this.section.current == false ){
    this.turnerMesh.material.opacity = this.uniforms.opacity.value / 8;
  }

  if( this.toggleMesh ){
    if( !this.toggleMesh.hovered ){
      if( !this.toggleMesh.toggled ){
        this.toggleMesh.material.opacity = this.uniforms.opacity.value / 3;
      }else{
        this.toggleMesh.material.opacity = 1/3;
      }
    }else{

      this.toggleMesh.material.opacity = .9;
    }
  }


  if( this.postprocessingMesh ){
    if( !this.postprocessingMesh.hovered ){
      if( !this.postprocessingMesh.postprocessingd ){
        this.postprocessingMesh.material.opacity = this.uniforms.opacity.value / 3;
      }else{
        this.postprocessingMesh.material.opacity = 1/3;
      }
    }else{

      this.postprocessingMesh.material.opacity = .9;
    }
  }
  if( this.fish ){
    this.fish.update();
  }

}


Frame.prototype.createFrame = function(fish){


  var fov = ( G.camera.fov / 360 )  * Math.PI;
 // tan( fov ) = Y / 1000
  //this.body.scale.x = 1000 * G.camera.aspect
  //
  var margin = 100;
  //
  var fullY = 1000 * Math.tan( fov) * 2
  this.body.scale.y = fullY - margin;
  this.body.scale.x = fullY * G.camera.aspect - margin;

  this.uniforms.scale.x = this.body.scale.x;
  this.uniforms.scale.y = this.body.scale.y;

  this.body.updateMatrix();

 /* var bodyTmp = this.body.clone();
  bodyTmp.position.copy( this.section.params.cameraPosition );


  bodyTmp.lookAt( this.section.params.lookPosition );
  G.v1.copy( this.section.params.cameraPosition );
  G.v1.sub( this.section.params.lookPosition );
  G.v1.normalize();
  G.v1.multiplyScalar( -1000 );
  bodyTmp.position.add( G.v1 );
  bodyTmp.updateMatrix();*/




  var lineGeo = new THREE.Geometry();
  var startPoints = [];
  var endPoints = [];

  var s = this.body.scale;

  var v1 = new THREE.Vector3( -1 / 2 , -1 / 2 , 0 );
  var v2 = new THREE.Vector3( -1 / 2 ,  1 / 2 , 0 );

  lineGeo.vertices.push( v1 );
  lineGeo.vertices.push( v2 );

  startPoints.push( v1 );
  endPoints.push(   v2 );

  var v1 = new THREE.Vector3( 1 / 2 , -1 / 2 , 0 );
  var v2 = new THREE.Vector3( 1 / 2 ,  1 / 2 , 0 );

  lineGeo.vertices.push( v1 );
  lineGeo.vertices.push( v2 );

  startPoints.push( v1 );
  endPoints.push(   v2 );

  var v1 = new THREE.Vector3( -1 / 2 , -1 / 2 , 0 );
  var v2 = new THREE.Vector3(  1 / 2 , -1 / 2 , 0 );

  lineGeo.vertices.push( v1 );
  lineGeo.vertices.push( v2 );

  startPoints.push( v1 );
  endPoints.push(   v2 );
   
  var v1 = new THREE.Vector3( -1 / 2 , 1 / 2 , 0 );
  var v2 = new THREE.Vector3(  1 / 2 , 1 / 2 , 0 );

  lineGeo.vertices.push( v1 );
  lineGeo.vertices.push( v2 );

  startPoints.push( v1 );
  endPoints.push(   v2 );

  for( var i = 0; i < startPoints.length; i++ ){

    startPoints[i].applyMatrix4( this.body.matrix );
    endPoints[i].applyMatrix4( this.body.matrix );

  }


  var fishActive = false;
  
  if( this.fish ){
    if( this.fish.simulationActive ){ fishActive = true; }
    this.fish.deactivate( this.section.page.scene );
  }

  if( fish ){
    this.fish = new FrameFish( this , startPoints , endPoints );
    if( fishActive ){ this.fish.activate( this.section.page.scene ); }
  }

  this.resizeToggleMesh();
  this.resizePostprocessingMesh();
  this.resizeTurnerMesh();

 
}


Frame.prototype.setTurnCallbacks = function( mesh ){
  //console.log( 'YA')
  //console.log( this.turnerMesh )

  //console.log( mesh.select )
  this.turnerMesh.select = mesh.select.bind( this.turnerMesh )
  this.turnerMesh.select.bind( this.turnerMesh )
  this.turnerMesh.material.opacity = .3;

  this.turnerMesh.hoverOver = function(){
    this.material.opacity = .7
  }.bind( this.turnerMesh );

  this.turnerMesh.hoverOut = function(){
    this.material.opacity = .3
  }.bind( this.turnerMesh );


  G.objectControls.add( this.turnerMesh );
}

Frame.prototype.createTurnerMesh = function(){


  this.turnerMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 80 , 80 ) , new THREE.MeshBasicMaterial({
    side: THREE.FrontSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    map: G.TEXTURES.logo,
    depthWrite: false,
    opacity: 0.
  }));

  this.turnerMesh.rotation.y = Math.PI




  this.body.add( this.turnerMesh );

}

Frame.prototype.createToggleMesh = function(){


  //console.log('hello')

  this.toggleMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 40 , 40 ) , new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    map: G.TEXTURES.toggleClose,
    depthWrite: false,
    opacity: 0
  }))


  this.toggleMesh.hoverOver = function(){

    this.toggleMesh.hovered = true;

  }.bind( this );

  this.toggleMesh.hoverOut = function(){

    this.toggleMesh.hovered = false;
    //console.log( 'yup' );

  }.bind( this );

  this.toggleMesh.select = function(){

    //console.log( this )
    if( this.toggleMesh.toggled ){

      this.frame.visible = true;
      this.toggleMesh.toggled = false;
      if( this.section.text ) this.section.text.particles.visible = true;
      if( this.turnerMesh ) this.turnerMesh.visible = true;
    //  if( this.postprocessingMesh ) this.postprocessingMesh.visible = true;
      //console.log( this.section )
      this.toggleMesh.material.map = G.TEXTURES.toggleClose;
    }else{
      this.frame.visible = false;
      this.toggleMesh.toggled = true;
      if( this.section.text ){
        //console.log( 'HAS TEXT')
        this.section.text.particles.visible = false;
      }
      if( this.turnerMesh ) this.turnerMesh.visible = false;
    //  if( this.postprocessingMesh ) this.postprocessingMesh.visible = false;
      this.toggleMesh.material.map = G.TEXTURES.toggleOpen;

    }
  }.bind( this )

  //this.toggleMesh.hovered = tmpHover;
  //this.toggleMesh.toggled = tmpToggle;


  G.objectControls.add( this.toggleMesh );
  this.body.add( this.toggleMesh );

}

Frame.prototype.createPostprocessingMesh = function(){


  //console.log('hello')

  this.postprocessingMesh = new THREE.Mesh( 
    new THREE.PlaneBufferGeometry( 40 , 40 ) , 
    new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      map: G.TEXTURES.postprocessingOn,
      depthWrite: false,
      opacity: 0
    })
  );


  this.postprocessingMesh.hoverOver = function(){

    this.postprocessingMesh.hovered = true;

  }.bind( this );

  this.postprocessingMesh.hoverOut = function(){

    this.postprocessingMesh.hovered = false;
    //console.log( 'yup' );

  }.bind( this );

  this.postprocessingMesh.select = function(){
    console.log('HELLO')
    G.togglePostprocessing();
  }.bind( this )

  //this.postprocessingMesh.hovered = tmpHover;
  //this.postprocessingMesh.postprocessingd = tmppostprocessing;


  //G.objectControls.add( this.postprocessingMesh );
  //this.body.add( this.postprocessingMesh );

}

Frame.prototype.resizeToggleMesh = function(){

  this.toggleMesh.position.x = -.5;
  this.toggleMesh.position.y = .5;

  this.toggleMesh.scale.x = 1 / this.body.scale.x 
  this.toggleMesh.scale.y = 1 / this.body.scale.y 
  this.toggleMesh.scale.z = 1 / this.body.scale.z;

  this.toggleMesh.position.x += 30 / this.body.scale.x;
  this.toggleMesh.position.y -= 25 / this.body.scale.y;

}

Frame.prototype.resizePostprocessingMesh = function(){

  this.postprocessingMesh.position.x = -.5;
  this.postprocessingMesh.position.y = .5;

  this.postprocessingMesh.scale.x = 1 / this.body.scale.x 
  this.postprocessingMesh.scale.y = 1 / this.body.scale.y 
  this.postprocessingMesh.scale.z = 1 / this.body.scale.z;

  this.postprocessingMesh.position.x += 30 / this.body.scale.x;
  this.postprocessingMesh.position.y -= 65 / this.body.scale.y;

}

Frame.prototype.resizeTurnerMesh = function(){

  this.turnerMesh.position.x = -.5;
  this.turnerMesh.position.y = -.5;

  this.turnerMesh.scale.x = 1 / this.body.scale.x 
  this.turnerMesh.scale.y = 1 / this.body.scale.y 
  this.turnerMesh.scale.z = 1 / this.body.scale.z;

  this.turnerMesh.position.x += 80 / this.body.scale.x;
  this.turnerMesh.position.y += 80 / this.body.scale.y;

}

Frame.prototype.add = function(){

  console.log( this.section );
  this.section.page.scene.add( this.body );

  this.body.position.copy( this.section.params.cameraPosition );
 
  var fov = ( G.camera.fov / 360 )  * Math.PI;
 // tan( fov ) = Y / 1000
  //this.body.scale.x = 1000 * G.camera.aspect
  //
  var margin = 100;
  //
  var fullY = 1000 * Math.tan( fov) * 2
  this.body.scale.y = fullY - margin;
  this.body.scale.x = fullY * G.camera.aspect - margin;

  this.uniforms.scale.x = this.body.scale.x;
  this.uniforms.scale.y = this.body.scale.y;

  this.body.lookAt( this.section.params.lookPosition );
  G.v1.copy( this.section.params.cameraPosition );
  G.v1.sub( this.section.params.lookPosition );
  G.v1.normalize();
  G.v1.multiplyScalar( -1000 );
  this.body.position.add( G.v1 );

  this.resizeToggleMesh();



}
