function Water( page , y ){

  
  this.page = page;
  this.scene = this.page.scene;
  this.y = y;

  this.texture = new THREE.WebGLRenderTarget( 2048 , 2048 );
  
  this.camera = G.camera.clone(); 
  this.camera.position.copy( G.camera.position );

  this.camera.position.y *= -1;
  this.camera.scale.y *= -1;
  
  //this.camera.lookAt( new THREE.Vector3() );


  this.uniforms =  {
    t_scene:      { type:"t" , value: this.texture },
    t_normal:     { type:"t" , value: G.TEXTURES['normal_water'] },
    t_audio:      G.t_audio,
    lightPos:     { type:"v3" , value: G.camera.position },
    SS:           { type:"v2",value: G.windowSize},
    dpr:          G.dpr,//value: new THREE.Vector2( w*dpr , h*dpr ) },
    timer:        G.timer,
    normalScale:  {type:"f",value:1.}
  }


 this.material = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: G.shaders.vs.water,
    fragmentShader: G.shaders.fs.water,
    //transparent:true,
    //side: THREE.DoubleSide
  });

  this.body = new THREE.Mesh(
    new THREE.PlaneGeometry( 1000000 , 1000000 ),
    this.material
  );

  this.body.position.y = this.y;




}

Water.prototype.update = function(){

  this.camera = G.camera.clone(); 
  this.camera.position.copy( G.camera.position );
  this.camera.position.y =-( G.camera.position.y - this.scene.position.y);
  //this.camera.position.y = this.y;
  //G.tmpV3.set( 0 , this.y , 0 );
 // this.camera.lookAt( this.scene.position.clone().sub( G.tmpV3 ) );

  this.camera.scale.y = -1;


  //waterRender.value = 1;
 // this.camera.scale.y = -1;
  this.body.visible = false;
  G.renderer.render( G.scene , this.camera  , this.texture , true);

  //waterRender.value = 0;
  this.body.visible = true;

  
  //this.camera.lookAt( new THREE.Vector3() );


}
