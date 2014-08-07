function HandParticles( hand , size ){

  this.hand = hand;
  this.position = new THREE.Vector3();
  this.velocity = new THREE.Vector3();


  this.sim = G.shaders.ss.handParticles;

  this.active = false;

  this.size = size;
  this.s2 = this.size * this.size;

  this.physics = new PhysicsRenderer( this.size , this.sim , G.renderer );
 
  var noiseSize = .005 + (Math.random() -.5)*.003;

  this.noiseSize     = { type:"f"  , value: noiseSize };  

  this.physics.setUniform( 'noiseSize'   , this.noiseSize     );
  
  this.physics.setUniform( 'handPos' , { type:"v3" , value: this.position } );
  this.physics.setUniform( 'handVel' , { type:"v3" , value: this.velocity } );
  this.physics.setUniform( 't_audio'   , G.t_audio                             );
  this.physics.setUniform( 'timer'   , G.timer                              );
  this.physics.setUniform( 'dT'      , G.dT                                 );

  var uniforms = {

    t_audio:G.t_audio,
    t_pos:{ type:"t" , value: null },
    clicking:{ type:"f" , value: 0 },
    hovered:{ type:"f" , value: 0 },
    sprite:{type:"t" , value:G.TEXTURES.sprite_flare },
    

  }

  this.material = new THREE.ShaderMaterial({

    uniforms: uniforms,
    vertexShader: G.shaders.vs.handParticles,
    fragmentShader: G.shaders.fs.handParticles,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,

  });
 
  this.geometry = this.createParticleGeometry();
  
  this.particles = new THREE.PointCloud( 
      this.geometry, 
      this.material
  );

  this.particles.frustumCulled = false;
  this.particles.material.frustumCulled = false;

  this.physics.addBoundTexture( this.particles , 't_pos' , 'output' );
     
//  this.physics.createDebugScene();
//  this.physics.addDebugScene( G.scene );

  console.log( 'HELLO' );

}

HandParticles.prototype.update = function(){

  if( this.active === true ){

    G.tmpV3.copy( G.iPoint );
    G.tmpV3.sub( this.position );

    this.velocity.copy( G.tmpV3 );
    this.position.copy( G.iPoint );

    

    this.physics.update();

  }


}


HandParticles.prototype.activate = function(){

  console.log('ASDASASBAS');
  G.scene.add( this.particles );
  this.active = true;

}

HandParticles.prototype.deactivate = function(){

  G.scene.remove( this.particles );
  this.active = false;

}

HandParticles.prototype.createParticleGeometry = function(){

  var geo = new THREE.BufferGeometry();

  var aPos= new THREE.BufferAttribute( new Float32Array( this.s2 * 3 ), 3 );
  geo.addAttribute( 'position', aPos );
 
  var positions = geo.attributes.position.array;

  for( var i = 0; i < this.size; i++ ){

    for( var j = 0; j < this.size; j++ ){

      var index = (( i * this.size ) + j ) * 3;

      positions[ index + 0 ] = i / this.size;
      positions[ index + 1 ] = j / this.size;

    }

  }

  return geo;

}



