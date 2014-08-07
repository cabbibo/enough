function Sparkles( page , size ){

  this.page = page;

  this.size = size || 32;

  this.sim = G.shaders.ss.sparkles;

  this.physics = new PhysicsRenderer( this.size , this.sim , G.renderer );

  this.physics.setUniform( 'dT' , G.dT );
  this.physics.setUniform( 'timer' , G.timer );

  this.gui = this.page.gui.addFolder( 'ParticleParams' );
 
  this.physicsParams = {

    flowSpeed:{ type:"f" , value: 0.13 },
    startingVel:{ type:"f" , value: 1 },
    curlPower:{ type:"f" , value: .1 },
    noiseSize:{ type:"f" , value:.001 },
    lifeMultiplier:{ type:"f" , value: .1 },
    repelCutoff:{ type:"f" , value: 260 },
    repelPower:{ type:"f" , value: 50 },

    repelMultiplier:{ type:"f" , value: .01 },
    repelPos: { type:"v3v" , value: [] }
  
  }
  
  this.physicsParams.repelPos.value.push( G.mani.position.relative );
  //this.physicsParams.repelPos.value.push( G.iPoint.relative );
  //this.physicsParams.repelPos.value.push( G.rHand.relative );
  //this.physicsParams.repelPos.value.push( G.lHand.relative );

  this.physics.setUniform( 'flowSpeed' , this.physicsParams.flowSpeed );
  this.physics.setUniform( 'startingVel' , this.physicsParams.startingVel );
  this.physics.setUniform( 'curlPower' , this.physicsParams.curlPower );
  this.physics.setUniform( 'noiseSize' , this.physicsParams.noiseSize );
  this.physics.setUniform( 'lifeMultiplier' , this.physicsParams.lifeMultiplier );
  this.physics.setUniform( 'repelCutoff' , this.physicsParams.repelCutoff );
  this.physics.setUniform( 'repelMultiplier' , this.physicsParams.repelMultiplier );
  this.physics.setUniform( 'repelPower' , this.physicsParams.repelPower );
  this.physics.setUniform( 'repelPos' , this.physicsParams.repelPos );
  this.physics.setUniform( 'cameraPos' , {type:"v3" ,value: G.camera.position.relative });

  var pp = this.physicsParams;

  this.gui.add( pp.flowSpeed      , 'value'  ).name( 'Flow Speed'       );
  this.gui.add( pp.startingVel    , 'value'  ).name( 'Starting Speed'   );
  this.gui.add( pp.curlPower      , 'value'  ).name( 'Curl Power'       );
  this.gui.add( pp.noiseSize      , 'value'  ).name( 'Noise Size'       );
  this.gui.add( pp.lifeMultiplier , 'value'  ).name( 'Life Multiplier'  );
  this.gui.add( pp.repelPower     , 'value'  ).name( 'Repel Power'  );
  this.gui.add( pp.repelMultiplier     , 'value'  ).name( 'Repel Multiplier'  );
  this.gui.add( pp.repelCutoff    , 'value'  ).name( 'Repel Cutoff'  );


  this.geo = this.createGeo( this.size );

  this.uniforms ={

    timer: G.timer,
    radius: { type:"f" , value: 10},
    rotationSpeed: { type:"f" , value: 1 },
    t_audio: G.t_audio,
    t_lookup: { type:"t" , value: null },
    lightPos: { type:"v3" , value: G.mani.position },
    cameraPos: { type:"v3" , value: G.camera.position },
    lightPower: { type:"f" , value: 2 },
    lightCutoff: { type:"f" , value: 250 },
    audioPower: { type:"f" , value: 1.5 },
    shininess: { type:"f" , value: 10 },
  
  }


  this.gui.add( this.uniforms.rotationSpeed , 'value'  ).name( 'Rotation Speed' );
  this.gui.add( this.uniforms.radius , 'value'  ).name( 'Radius' );
  this.gui.add( this.uniforms.audioPower , 'value'  ).name( 'Audio Power' );
  this.gui.add( this.uniforms.lightPower , 'value'  ).name( 'Light Power' );
  this.gui.add( this.uniforms.lightCutoff , 'value'  ).name( 'Light Cutoff' );
  this.gui.add( this.uniforms.shininess , 'value'  ).name( 'Shininess' );


  this.mat = new THREE.ShaderMaterial({


    uniforms: this.uniforms,
    vertexShader: G.shaders.vs.sparkles,
    fragmentShader: G.shaders.fs.sparkles,
    side: THREE.DoubleSide

  });


  this.particles = new THREE.Mesh( this.geo , this.mat );

  this.particles.frustumCulled = false;
  this.physics.addBoundTexture( this.particles , 't_lookup' , 'output' );


  var geo = new THREE.BoxGeometry( 1000 , 1000 , 1000 , 1 ,1 ,1 )
  var mesh = new THREE.Mesh( geo );

  mesh.position.x = 2000;

  var t = ParticleUtils.createPositionsTexture( this.size ,  mesh );

  this.physics.reset( t );


}


Sparkles.prototype.activate = function(){

  this.page.scene.add( this.particles );
  this.active = true;

/*
  this.physics.createDebugScene();
  this.physics.addDebugScene( this.page.scene );
  this.physics.debugScene.position.z = -300;*/
  
}

Sparkles.prototype.update = function(){

  if( this.active ){

    this.physics.update();
 }

}


Sparkles.prototype.createGeo = function( size ){

  var totalVerts = size * size * 6 * 3;
  var geo = new THREE.BufferGeometry();
  var posA = new THREE.BufferAttribute( new Float32Array( totalVerts * 3 ) , 3 );

  
  var posA = new THREE.BufferAttribute( new Float32Array( totalVerts * 3 ), 3 );
  
  geo.addAttribute( 'position', posA );

  var positions = geo.getAttribute( 'position' ).array;



  for( var i = 0; i < size; i++ ){

    for( var j = 0; j < size; j++ ){

      var x = (i / size);// + (.5 / size);
      var y = (j / size);// + (.5 / size);

      var hexIndex = (i + (j * size )) * 6 * 3 * 3;

      for( var k = 0; k < 6; k++ ){

        var fIndex = hexIndex + k * 3 * 3;

        var t1 = 0;
        var t2 = k+1;//(k+1/6) * Math.PI * 2;
        var t3 = k+2;//(kU / 6 ) * Math.PI * 2;


        positions[ fIndex + 0 ] = x;
        positions[ fIndex + 1 ] = y;
        positions[ fIndex + 2 ] = t1;
        
        positions[ fIndex + 3 ] = x;
        positions[ fIndex + 4 ] = y;
        positions[ fIndex + 5 ] = t2;
        
        positions[ fIndex + 6 ] = x;
        positions[ fIndex + 7 ] = y;
        positions[ fIndex + 8 ] = t3;

      }


    }

  }


  return geo;


}
