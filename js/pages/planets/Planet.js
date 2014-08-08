function Planet( page , type , audio , color1 , color2 , color3 , color4 ){

  this.page     = page;
  this.type     = type;

  this.color1 = color1;
  this.color2 = color2;
  this.color3 = color3;
  this.color4 = color4;

  this.audio  = audio;
  //this.audio.updateAnalyser = true;
  //this.audio.updateTexture = true;
 
  // TODO: Bring this to main load
  var t_normal = THREE.ImageUtils.loadTexture( 'img/normals/moss_normal_map.jpg' );
  t_normal.wrapS = THREE.RepeatWrapping; 
  t_normal.wrapT = THREE.RepeatWrapping; 
  
  
  this.uniforms = {

    lightPos: { type:"v3" , value: G.camera.position },
    t_normal:{type:"t",value:t_normal},
    //t_audio:{ type:"t" , value: this.audio.texture },
    t_audio:G.t_audio,

    color1:{ type:"v3" , value: color1 },
    color2:{ type:"v3" , value: color2 },
    color3:{ type:"v3" , value: color3 },
    color4:{ type:"v3" , value: color4 },
    selected:{ type:"f" , value: 0 },
    hovered:{ type:"f" , value: 0 },
    time:G.timer

  }

  this.vertexShader   = G.shaders.vs.planet;
  this.fragmentShader = G.shaders.fs.planet;

  this.material = new THREE.ShaderMaterial({

    uniforms: this.uniforms,
    vertexShader: this.vertexShader,
    fragmentShader: this.fragmentShader

  });


  console.log( page.planetsGeo );


  this.mesh = new THREE.Mesh( page.planetGeo, this.material );
  this.mesh.selected = false;

  this.mesh.rotation.y = Math.PI / 2;

  this.position = this.mesh.position;
  this.velocity = new THREE.Vector3();

/*  this.position.x = ( Math.random() - .5 ) * 1000;
  this.position.y = ( Math.random() - .5 ) * 1000;
  this.position.z = ( Math.random() - .5 ) * 1000;*/

  this.mesh.hoverOver = function(){
    this.uniforms.hovered.value = 1;
  }.bind( this );

  this.mesh.hoverOut = function(){
    this.uniforms.hovered.value = 0;
  }.bind( this );

  this.mesh.select = function(){
    this.uniforms.selected.value = 1;
  }.bind( this );
  
  this.mesh.deselect = function(){
    this.uniforms.selected.value = 0;
  }.bind( this );

  this.mesh.update = function(){

    var newPos = G.iPoint.clone().sub( this.page.position ) 
    this.position.copy( G.iPoint.relative  );
    this.updateAudio();

  }.bind( this );

  this.mesh.update();

  G.objectControls.add( this.mesh );

  this.page.scene.add( this.mesh );
  

}

Planet.prototype.updateAudio = function(){

    var d = this.position.length();
    this.audio.gain.gain.value = Math.min( 1. , 50000 / (d*d));

}
