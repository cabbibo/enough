function Planet( page , type , audio , color1 , color2 , color3 , color4 ){

  this.page     = page;
  this.type     = type;

  this.color1 = color1;
  this.color2 = color2;
  this.color3 = color3;
  this.color4 = color4;

  this.audio  = audio;
 
  // TODO: Bring this to main load
  var t_normal = THREE.ImageUtils.loadTexture( 'img/normals/moss_normal_map.jpg' );
  t_normal.wrapS = THREE.RepeatWrapping; 
  t_normal.wrapT = THREE.RepeatWrapping; 
  
  
  this.uniforms = {

    lightPos: { type:"v3" , value: G.camera.position },
    t_normal:{type:"t",value:t_normal},
    t_audio:{ type:"t" , value: this.audio.texture },
    color1:{ type:"v3" , value: color1 },
    color2:{ type:"v3" , value: color2 },
    color3:{ type:"v3" , value: color3 },
    color4:{ type:"v3" , value: color4 },

  }

  this.vertexShader   = G.shaders.vs.planet;
  this.fragmentShader = G.shaders.fs.planet;

  this.material = new THREE.ShaderMaterial({

    uniforms: this.uniforms,
    vertexShader: this.vertexShader,
    fragmentShader: this.fragmentShader

  });

  this.geometry = new THREE.IcosahedronGeometry( 100 , 5 );

  this.mesh = new THREE.Mesh( this.geometry, this.material );

  this.position = this.mesh.position;
  this.velocity = new THREE.Vector3();

  this.position.x = ( Math.random() - .5 ) * 1000;
  this.position.y = ( Math.random() - .5 ) * 1000;
  this.position.z = ( Math.random() - .5 ) * 1000;

  G.objectControls.add( this.mesh );
  this.page.scene.add( this.mesh );
  

}

Planet.prototype.update = function(){



}
