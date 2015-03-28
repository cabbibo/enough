function Frame(section , fish ){

 // fish = true
  this.section = section;

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

  this.body.updateMatrix();

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

  if( fish ){
    this.fish = new FrameFish( this , startPoints , endPoints );
  }
 // this.fish.activate( this.section.page.scene );
  
}


Frame.prototype.update = function(){

  if( this.fish ){
    this.fish.update();
  }

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
