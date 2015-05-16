function FrameFish( frame , startPoints , endPoints , params ){
 
  this.counter = { type:"f" , value: 0 };
  this.simulationActive = false;
  this.textureArray = [];

  this.params = _.defaults( params || {} , {

    depth: 32,
    joints: 4,
    size: 16,
    sides: 6,
    time: G.dT,
    matcap: G.TEXTURES.blood

  });

  this.params.jointSize = this.params.depth / this.params.joints;


  this.startPoints = startPoints;
  this.endPoints = endPoints;
  this.soulUniforms = {

    resolution:           { type: "v2", value: new THREE.Vector2() },
    testing:              { type: "f" , value: 1.0 },
    maxVel:               { type: "f" , value: 1 },
    velMultiplier:        { type: "f" , value: 5. },
    forceMultiplier:      { type: "f" , value: 8000. },
    centerPower:          { type: "f" , value: 2 },
    centerPosition:       { type: "v3", value: frame.body.position },
    predator:             { type: "v3", value: G.iTextPoint.relative },
    predatorRepelRadius:  { type: "f" , value: 300 },
    predatorRepelPower:   { type: "f" , value: .1 },
    attractor:            { type: "v3", value: G.camera.position.relative },

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

    opacity:      frame.uniforms.opacity,
    lightPos:     { type: "v3", value: G.mani.position },
    maniPos:      { type: "v3", value: G.mani.position },
    

  };

  this.bodyUniforms.lightPos             = this.soulUniforms.predator;
  this.bodyUniforms.predator             = this.soulUniforms.predator;
  this.bodyUniforms.predatorRepelPower   = this.soulUniforms.predatorRepelPower;
  this.bodyUniforms.predatorRepelRadius  = this.soulUniforms.predatorRepelRadius;

 // console.log( this.startPoints );


  /*
   
     Setting up simulation

  */

  var s = this.params.size;
  this.soulUniforms.resolution.value.set( s , s );

  this.s2 = s * s;
  this.size = s;
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
    depthWrite:false,
    blending: THREE.AdditiveBlending
  });

  var geo = this.geometries.ribbon( this.params.size , this.params.joints * 8 );
  this.ribbon = new THREE.Mesh( geo , ribbonMat );
  this.ribbon.frustumCulled = false;



  /*console.log( frame )
  this.soul.debugScene = this.soul.createDebugScene();
  console.log( )
  this.soul.addDebugScene( frame.body )
  this.soul.debugScene.scale.y = 20 / frame.body.scale.y
  this.soul.debugScene.scale.x = 20 / frame.body.scale.x
  console.log( this.soul.debugScene )*/

    this.resetPositions();


}

FrameFish.prototype.resetPositions = function(){

  var data = new Float32Array( this.s2 * 4 );


  for( var i =0; i < data.length; i += 4 ){

    var l = Math.floor( Math.random() * 4 );


    G.v1.copy( this.startPoints[l] );
    G.v2.copy( this.startPoints[l] );
    G.v2.sub( this.endPoints[l] );
    G.v2.multiplyScalar( -Math.random() );

    G.v1.add( G.v2 );
    

    data[ i + 0 ] = G.v1.x ; 
    data[ i + 1 ] = G.v1.y ; 
    data[ i + 2 ] = G.v1.z ;
    data[ i + 3 ] = 1; 

    
  }

  var texture = new THREE.DataTexture( 
    data,
    this.size,
    this.size,
    THREE.RGBAFormat,
    THREE.FloatType
  );

  texture.minFilter =  THREE.NearestFilter,
  texture.magFilter = THREE.NearestFilter,

  texture.needsUpdate = true;


  this.soul.reset( texture );

  for( var i =0;i< this.params.joints; i++ ){

    this.textureArray[i] = this.soul.output[i * this.params.jointSize];
   // console.log( this.textureArray[i] );

   //console.log( this.textureArray[i].__webglTexture )

   //G.renderer.uploadTexture( this.textureArray[i]  )

   //this.textureArray[i].needsUpdate = true;

  }

  //this.ribbon.material.needsUpdate = true;



}


FrameFish.prototype.activate = function( scene ){

  this.counter.value = 0;
  this.added = false;
  this.simulationActive = true;
  this.toAddScene = scene;

}

FrameFish.prototype.deactivate = function( scene ){

  this.toAddScene = scene;
  this.toAddScene.remove( this.ribbon );
  this.simulationActive = false;

}

FrameFish.prototype.update = function(){

  this.counter.value ++;


  if( this.simulationActive ){
    if( this.added == false && this.counter.value > 32 ){ 
      this.added = true;
      this.toAddScene.add( this.ribbon )
    }

    this.soul.update();
    
    for( var i =0;i< this.params.joints; i++ ){
      this.textureArray[i] = this.soul.output[i * this.params.jointSize];
    }

  }

}


