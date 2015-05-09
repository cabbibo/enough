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

  this.body = new THREE.Mesh( geo , mat );

  //this.section.page.scene.add( this.body );

  this.body.position.copy( this.section.params.cameraPosition );


  this.body.lookAt( this.section.params.lookPosition );
  G.v1.copy( this.section.params.cameraPosition );
  G.v1.sub( this.section.params.lookPosition );
  G.v1.normalize();
  G.v1.multiplyScalar( -1000 );
  this.body.position.add( G.v1 );

  this.createFrame(this.isFish);

  
}


Frame.prototype.update = function(){

  if( this.toggleMesh ){
    if( !this.toggleMesh.hovered ){
      if( !this.toggleMesh.toggled ){
        this.toggleMesh.material.opacity = this.uniforms.opacity.value / 4;
      }else{
        this.toggleMesh.material.opacity = 1/4;
      }
    }else{

      this.toggleMesh.material.opacity = .7;
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

  console.log( startPoints )

  var fishActive = false;
  
  if( this.fish ){
    if( this.fish.simulationActive ){ fishActive = true; }
    this.fish.deactivate( this.section.page.scene );
  }

  if( fish ){
    this.fish = new FrameFish( this , startPoints , endPoints );
    if( fishActive ){ this.fish.activate( this.section.page.scene ); }
  }

  this.createToggleMesh();

 
}

Frame.prototype.createToggleMesh = function(){


  var tmpHover = false;
  var tmpToggle = false;
  if( this.toggleMesh ){
    tmpHover = this.toggleMesh.hovered
    tmpToggle = this.toggleMesh.toggled
    this.body.remove( this.toggleMesh )
    G.objectControls.remove( this.toggleMesh )
  }

  this.toggleMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 40 , 40 ) , new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    map: G.TEXTURES.toggleTexture,
    depthWrite: false,
    opacity: 0
  }))


  this.toggleMesh.position.x = -.5;
  this.toggleMesh.position.y = .5;

  this.toggleMesh.scale.x = 1 / this.body.scale.x 
  this.toggleMesh.scale.y = 1 / this.body.scale.y 
  this.toggleMesh.scale.z = 1 / this.body.scale.z;

  this.toggleMesh.position.x += 25 / this.body.scale.x 
  this.toggleMesh.position.y -= 25 / this.body.scale.y;

  this.toggleMesh.hoverOver = function(){

    this.toggleMesh.hovered = true;

  }.bind( this );

  this.toggleMesh.hoverOut = function(){

    this.toggleMesh.hovered = false;
    console.log( 'yup' );

  }.bind( this );

  this.toggleMesh.select = function(){

    if( this.toggleMesh.toggled ){
      this.uniforms.opacity.value = 1;
      this.toggleMesh.toggled = false;
      if( this.section.text ) this.section.text.particles.visible = true;
      if( this.section.turnerMesh ) this.section.turnerMesh.visible = true;
      console.log( this.section )
    }else{
      this.uniforms.opacity.value = 0;
      this.toggleMesh.toggled = true;
      if( this.section.text ) this.section.text.particles.visible = false;
      if( this.section.turnerMesh ) this.section.turnerMesh.visible = false;

    }
  }.bind( this )

  this.toggleMesh.hovered = tmpHover;
  this.toggleMesh.toggled = tmpToggle;


  G.objectControls.add( this.toggleMesh );
  this.body.add( this.toggleMesh );

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



}
