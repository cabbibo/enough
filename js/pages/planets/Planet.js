function Planet( type ,audio , color1 , color2 , color3 , color4 ){

  this.type     = type;

  this.color1 = color1;
  this.color2 = color2;
  this.color3 = color3;
  this.color4 = color4;

  this.audio  = new LoadedAudio( audioController, audio );

  this.audio.onLoad = function(){

    console.log('AHSDAB');
    console.log( this );
    //this.play();

  }

 // console.log( shaders );
  var tNormal = THREE.ImageUtils.loadTexture( '../img/normals/moss_normal_map.jpg' );
  tNormal.wrapS = THREE.RepeatWrapping; 
  tNormal.wrapT = THREE.RepeatWrapping; 
  console.log( 'TNOMAL');
  console.log( tNormal );
  
  
  this.uniforms = {

    lightPos: { type:"v3" , value: center.position },
    tNormal:{type:"t",value:tNormal},
    time:timer,
    t_audio:{ type:"t" , value: audioController.texture },
    color1:{ type:"v3" , value: color1 },
    color2:{ type:"v3" , value: color2 },
    color3:{ type:"v3" , value: color3 },
    color4:{ type:"v3" , value: color4 },

  }

  this.vertexShader   = shaders.vertexShaders.planet;
  this.fragmentShader = shaders.fragmentShaders.planet;

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

  objectControls.add( this.mesh );
  scene.add( this.mesh );
  

}


Planet.prototype.update = function(){



}
