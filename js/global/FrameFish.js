function FrameFish( frame , startPoints , endPoints , params ){
 
  this.counter = { type:"f" , value: 0 };
  this.simulationActive = false;
  this.textureArray = [];

  this.params = _.defaults( params || {} , {

    depth: 64,
    joints: 8,
    size: 16,
    sides: 6,
    time: G.dT,
    matcap: G.TEXTURES.blood

  });

  this.params.jointSize = this.params.depth / this.params.joints;


  this.soulUniforms = {

    resolution:           { type: "v2", value: new THREE.Vector2() },
    testing:              { type: "f" , value: 1.0 },
    freedomFactor:        { type: "f" , value: 1000000000000000.0 },
    maxVel:               { type: "f" , value: 20 },
    velMultiplier:        { type: "f" , value: 5. },
    forceMultiplier:      { type: "f" , value: 8000. },
    centerPower:          { type: "f" , value: 2 },
    centerPosition:       { type: "v3", value: new THREE.Vector3(0,200,0) },
   // prsdator:             { type: "v3", value: new THREE.Vector3(0 , 400 , 0) },
    predator:             { type: "v3", value: G.mani.position.relative },
    predatorRepelRadius:  { type: "f" , value: 300 },
    predatorRepelPower:   { type: "f" , value: .1 },
    attractor:            { type: "v3", value: new THREE.Vector3() },

    startPoints : { type:"v3v" , value: startPoints },
    endPoints : { type:"v3v" , value: endPoints },

  }

  this.bodyUniforms = {
    
    t_pos :       { type:"t"  , value: null },
    t_posArray :  { type:"tv" , value: this.textureArray },
    t_matcap :    { type:"t"  , value: this.params.matcap },
    t_audio:      G.t_audio,
    t_normal:     { type:"t" , value: G.TEXTURES.ribbonNorm},
    t_matcap:     { type:"t" , value: G.TEXTURES.matcapMetal},
    t_ribbon:     { type:"t" , value: G.TEXTURES.ribbon},

    lightPos:     { type: "v3", value: G.mani.position },
    maniPos:      { type: "v3", value: G.mani.position },
    

  };

  this.bodyUniforms.lightPos             = this.soulUniforms.predator;
  this.bodyUniforms.predator             = this.soulUniforms.predator;
  this.bodyUniforms.predatorRepelPower   = this.soulUniforms.predatorRepelPower;
  this.bodyUniforms.predatorRepelRadius  = this.soulUniforms.predatorRepelRadius;



  /*
   
     Setting up simulation

  */

  var s = this.params.size;
  this.soulUniforms.resolution.value.set( s , s );
  //this.soulUniforms.predator.value.set( 10000000000 , 0 , 0 );

  var simulation = G.shaders.setValue( G.shaders.ss.frameFish , 'NUM_OF_LINES' ,  startPoints.length );
    simulation = G.shaders.setValue(simulation ,  'SIZE' , s + "." );

  this.soul = new PhysicsArrayRenderer( 
    this.params.size,
    this.params.depth,
    simulation,
    G.renderer
  );

  for( var propt in this.soulUniforms ){
    this.soul.setUniform( propt , this.soulUniforms[ propt ] );
  }

  this.soul.setUniform( 'dT'   , G.dT    );
  this.soul.setUniform( 'time' , G.timer  );
  this.soul.resetRand( 500 );



  for( var i = 0; i < this.params.joints; i++ ){

    this.textureArray.push( this.soul.rt[i] );

  }

  var size = this.params.size;
  var joints = this.params.joints;
  var sides = this.params.sides;
  this.geometries = CreateFlockingGeometry( size , joints , sides );

  /*
    
     GETTING 

  */
  var vs = G.shaders.setValue( 
    G.shaders.vs.frameFish, 
    'DEPTH' ,
    this.params.joints  
  );

  var fs = G.shaders.fs.frameFish; 
  
  var ribbonMat = new THREE.ShaderMaterial({
    uniforms: this.bodyUniforms,
    vertexShader: vs,
    fragmentShader:fs,
    side: THREE.DoubleSide,
    transparent: true,
    //depthWrite:false,
    //blending: THREE.AdditiveBlending
  });

  var geo = this.geometries.ribbon( this.params.size , this.params.joints * 8 );
  this.ribbon = new THREE.Mesh( geo , ribbonMat );
  this.ribbon.frustumCulled = false;


}

FrameFish.prototype.activate = function( scene ){

  scene.add( this.ribbon );
  this.simulationActive = true;

}

FrameFish.prototype.deactivate = function( scene ){

  scene.remove( this.ribbon );
  this.simulationActive = false;

}

FrameFish.prototype.update = function(){

  this.counter.value ++;

  if( this.simulationActive ){

    this.soul.update();
    
    for( var i =0;i< this.params.joints; i++ ){
      this.textureArray[i] = this.soul.output[i * this.params.jointSize];
    }

  }

}


