function Flock( coral , params ){

  this.coral = coral;
  this.coralPositions = [];
  this.coralData = [];
  
  for( var i = 0; i < this.coral.length; i++ ){
    this.coralPositions.push( this.coral[i].position );
    this.coralData.push( this.coral[i].data );
  }

  this.counter = { type:"f" , value: 0 };
  this.simulationActive = false;
  this.textureArray = [];


  this.params = _.defaults( params || {} , {

    depth: 32,
    joints: 4,
    size: 32,
    sides: 6,
    time: G.dT,
    matcap: G.TEXTURES.blood,

    pos: new THREE.Vector3()


  });

  this.params.jointSize = this.params.depth / this.params.joints;

  this.soulUniforms = {

    resolution:           { type: "v2", value: new THREE.Vector2() },
    testing:              { type: "f" , value: 1.0 },
    seperationDistance:   { type: "f" , value: 20.9 },
    alignmentDistance:    { type: "f" , value: 40.0 },
    cohesionDistance:     { type: "f" , value: 60.0 },
    freedomFactor:        { type: "f" , value: 1000000000000000.0 },
    maxVel:               { type: "f" , value: 3 },
    velMultiplier:        { type: "f" , value: 5. },
    forceMultiplier:      { type: "f" , value: 8000. },
    centerPower:          { type: "f" , value: 2 },
    centerPosition:       { type: "v3", value: new THREE.Vector3(0,200,0) },
   // prsdator:             { type: "v3", value: new THREE.Vector3(0 , 400 , 0) },
    predator:             { type: "v3", value: G.mani.position.relative },
    predatorRepelRadius:  { type: "f" , value: 300 },
    predatorRepelPower:   { type: "f" , value: .1 },
    attractor:            { type: "v3", value: new THREE.Vector3() },
    attractionCoral :     { type: "f" , value: 3 },
    coralRepelRadius:     { type: "f" , value:10 },
    coralAttractRadius:   { type: "f" , value:100 },
    coralAttractPower:    { type: "f" , value:2000000 },
    coralRepelPower:      { type: "f" , value:10 },
    coral:                { type: "v3v" , value:this.coralPositions },
    coralData:            { type: "v4v" , value:this.coralData },

    t_vortex: G.mani.lineUniforms.t_pos,
    scenePos: {type:"v3", value: params.pos }
  };


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

  this.bodyUniforms.seperationDistance   = this.soulUniforms.seperationDistance;
  this.bodyUniforms.alignmentDistance    = this.soulUniforms.alignmentDistance;
  this.bodyUniforms.cohesionDistance     = this.soulUniforms.cohesionDistance;

  this.bodyUniforms.coralData            = this.soulUniforms.coralData;


  /*
   
     Setting up simulation

  */

  var s = this.params.size;
  this.soulUniforms.resolution.value.set( s , s );
  //this.soulUniforms.predator.value.set( 10000000000 , 0 , 0 );

  var nc = this.coralPositions.length;
  var simulation = G.shaders.setValue( G.shaders.ss.flocking , 'SIZE' , s + "." );
      simulation = G.shaders.setValue( simulation , 'NUM_OF_CORAL' , nc );

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
  this.soul.setUniform( 'time' , G.time  );
  this.soul.resetRand( 100 );

  for( var i = 0; i < this.params.joints; i++ ){

    this.textureArray.push( this.soul.rt[i] );

  }



  var size = this.params.size;
  var joints = this.params.joints;
  var sides = this.params.sides;
  this.geometries = CreateFlockingGeometry( size , joints , sides );


  /*

     creating bodies

  */


  // TODO: Why different depth for this one ?

  // FISH ( point )

  /*var vs = G.shaders.setValue( 
    G.shaders.vs.fish , 
    'DEPTH' ,
    this.params.joints
  );

  var fishMat = new THREE.ShaderMaterial({
    uniforms: this.bodyUniforms,
    vertexShader: vs,
    fragmentShader: G.shaders.fs.fish,
  });

  var geo = this.geometries.line( this.params.size );
  this.fish = new THREE.PointCloud( geo , fishMat );
  this.fish.frustumCulled = false;



  // EEL ( line )

  var vs = G.shaders.setValue( 
    G.shaders.vs.eel , 
    'DEPTH' ,
    this.params.joints 
  );
  
  var eelMat = new THREE.ShaderMaterial({
    uniforms: this.bodyUniforms,
    vertexShader: vs,
    fragmentShader: G.shaders.fs.eel,
    linewidth:1
  });

  var geo = this.geometries.line( this.params.size , this.params.joints );
  this.eel = new THREE.Line( geo , eelMat, THREE.LinePieces );

*/
  // Ribbons

  var vs = G.shaders.setValue( 
    G.shaders.vs.ribbon, 
    'DEPTH' ,
    this.params.joints  
  );

  var fs = G.shaders.setValue( 
    G.shaders.fs.ribbon, 
    'SIZE' ,
    this.coral.length  
  );

  
  var ribbonMat = new THREE.ShaderMaterial({
    uniforms: this.bodyUniforms,
    vertexShader: vs,
    fragmentShader:fs,
    linewidth:1,
    side: THREE.DoubleSide,
    transparent: true,
    //depthWrite:false,
    //blending: THREE.AdditiveBlending
  });

  var geo = this.geometries.ribbon( this.params.size , this.params.joints * 8 );
  this.ribbon = new THREE.Mesh( geo , ribbonMat );
  this.ribbon.frustumCulled = false;



}


Flock.prototype.activate = function( scene ){

  //scene.add( this.fish );
  //scene.add( this.eel );
  scene.add( this.ribbon );

  this.simulationActive = true;

}

Flock.prototype.deactivate = function( scene ){

  // scene.remove( this.fish );
  // scene.remove( this.eel );
  scene.remove( this.ribbon );

  this.simulationActive = false;

}
Flock.prototype.update = function(){

  this.counter ++;

  if( this.simulationActive ){

    this.soulUniforms.seperationDistance.value = Math.abs(Math.sin( G.timer.value * 1 ) * 20);
    this.soulUniforms.alignmentDistance.value = Math.abs(Math.sin( G.timer.value * .5 ) * 40);
    this.soulUniforms.cohesionDistance.value = Math.abs(Math.sin( G.timer.value * .8 ) * 60);
    this.soul.update();

    for( var i =0;i< this.params.joints; i++ ){
      this.textureArray[i] = this.soul.output[i * this.params.jointSize];
    }

  }

}




