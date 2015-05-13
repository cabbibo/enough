function PhysicsArrayRenderer( size , arrayDepth , shader , renderer ){

  // First Make sure everything Works
  this.checkCompatibility( renderer );
  this.renderer = renderer;
  
  this.depth = arrayDepth;
  this.size = size || 128;
  this.s2   = size * size;

  this.renderer = renderer;

  this.clock = new THREE.Clock();

  
  // Sets up our render targets
  var r = new THREE.WebGLRenderTarget( this.size, this.size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type:THREE.FloatType,
    stencilBuffer: false
  });


  this.rt = [];
  this.output = [];

  for( var i = 0; i < this.depth; i++ ){

    this.rt.push( r.clone() );
    this.output.push( r.clone() );


  }



  this.counter = 0;

  //this.debugScene = this.createDebugScene();
  this.texturePassProgram = this.createTexturePassProgram();
  
  // WHERE THE MAGIC HAPPENS
  this.simulation = this.createSimulationProgram( shader );
  this.material = this.simulation;

  this.boundTextures = [];

  /*
    
    GPGPU Utilities
    From Sporel by Mr.Doob
    @author mrdoob / http://www.mrdoob.com

  */  
  
  this.camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 );
  this.scene = new THREE.Scene();
  this.mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1 ) );
  this.scene.add( this.mesh );
  
}

PhysicsArrayRenderer.prototype.checkCompatibility = function( renderer ){
  
  var gl = renderer.context;

  if ( gl.getExtension( "OES_texture_float" ) === null ) {
    this.onError( "No Float Textures"); 
    return;
  }

  if ( gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS ) === 0 ) {
    this.onError( "Vert Shader Textures don't work"); 
    return;
  }
  
}

PhysicsArrayRenderer.prototype.onError = function( e ){
  console.log( e );
}

PhysicsArrayRenderer.prototype.createDebugScene= function(){

  var debugScene = new THREE.Object3D();
  debugScene.position.z = 0;

  for( var i = 0; i < this.rt.length; i++ ){

    var geo = new THREE.PlaneBufferGeometry( 1 , 1 );
      
    var debugMesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
      map: this.rt[i],
      side: THREE.DoubleSide
    }));
    debugMesh.position.set( (i - ((this.rt.length+1) / 2 )) * 1.1 , 0 , 0 );

    debugScene.add( debugMesh );



  }

  //debugScene.add( new THREE.Mesh( new THREE.PlaneBufferGeometry( 2 , 2 ) , new THREE.MeshNormalMaterial({side: THREE.DoubleSide})));


  return debugScene;

}

PhysicsArrayRenderer.prototype.removeDebugScene = function( scene ){
  scene.remove( this.debugScene );
}

PhysicsArrayRenderer.prototype.addDebugScene = function( scene ){
  scene.add( this.debugScene );
}


PhysicsArrayRenderer.prototype.createTexturePassProgram = function(){

  var uniforms = {
    texture:{  type:"t"  , value:null },
  }

  var texturePassShader = new THREE.ShaderMaterial({
    uniforms:uniforms,
    vertexShader:this.VSPass,
    fragmentShader:this.FSPass,
  });

  return texturePassShader;

}

PhysicsArrayRenderer.prototype.createSimulationProgram = function(sim){

  this.simulationUniforms = {
    t_oPos:{  type:"t"  , value:null },
    t_pos:{   type:"t"  , value:null },
  }


  var program = new THREE.ShaderMaterial({

    uniforms:this.simulationUniforms,
    vertexShader:this.VSPass,
    fragmentShader:sim

  });

  return program;

}


PhysicsArrayRenderer.prototype.VSPass = [
  "varying vec2 vUv;",
  "void main() {",
  "  vUv = uv;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
  "}"
].join("\n");

PhysicsArrayRenderer.prototype.FSPass = [
  "uniform sampler2D texture;",
  "varying vec2 vUv;",
  "void main() {",
  "  vec4 c = texture2D( texture , vUv );",
  "  gl_FragColor = c ;",
  "}"
].join("\n");


PhysicsArrayRenderer.prototype.update = function(){

  var flipFlop = this.counter % this.depth;
 
  var out = (flipFlop + 2) % this.depth;
  var p =  (flipFlop + 1) % this.depth;
  var op = flipFlop

    
  this.simulation.uniforms.t_oPos.value = this.rt[op];
  this.simulation.uniforms.t_pos.value = this.rt[p];

  this.pass( this.simulation, this.rt[out] );

  for( var  i =0; i < this.depth; i++ ){

    var index =( this.counter +2 - i ) % this.depth;
    this.output[ i ] = this.rt[index];

  }

  
  this.counter ++;

 // this.bindTextures();

}

// Some GPGPU Utilities author: @mrdoob
PhysicsArrayRenderer.prototype.render = function ( scene, camera, target ) {
  renderer.render( scene, camera, target, false );
};

PhysicsArrayRenderer.prototype.pass = function ( shader , target ) {
  this.mesh.material = shader;
  this.renderer.render( this.scene, this.camera, target, false );

};

PhysicsArrayRenderer.prototype.out = function ( shader ) {
  this.mesh.material = shader.material;
  this.renderer.render( this.scene, this.camera );
};

// Used if he have uniforms we want to update!
PhysicsArrayRenderer.prototype.setUniforms = function( uniforms ){
  
  this.simulation.uniforms = uniforms || {};

  // Have to make sure that these always remain!
  this.simulation.uniforms.t_pos = { value:"t" , value:null }; 
  this.simulation.uniforms.t_oPos = { value:"t" , value:null };

  console.log( this.simulation.uniforms );

}

PhysicsArrayRenderer.prototype.setUniform = function( name , u ){
  this.simulation.uniforms[name] = u;
}

// resets the render targets to the from position
PhysicsArrayRenderer.prototype.reset = function( texture ){

  this.texture = texture;
  this.texturePassProgram.uniforms.texture.value = texture;

  for( var i = 0; i < this.rt.length; i++){
    this.pass( this.texturePassProgram , this.rt[i] );
    //this.rt[i].needsUpdate = true;
  }


  for( var  i =0; i < this.depth; i++ ){


    /*console.log( i )
    console.log( this.depth )
    console.log( this.rt.length )
    console.log( this.output.length )*/
    this.renderer.setTexture( this.rt[i] )
    this.output[ i ] = this.rt[i];
    //this.output[ i ].needsUpdate = true;

  }


}


// resets the render targets to the from position
PhysicsArrayRenderer.prototype.resetRand = function( size , alpha ){

  var size = size || 100;
  var data = new Float32Array( this.s2 * 4 );

  for( var i =0; i < data.length; i++ ){

    //console.log('ss');
    data[ i ] = (Math.random() - .5 ) * size;
    
    if( alpha && i % 4 ===3 ){
      data[i] = 0;
    }

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

  this.reset( texture );
 
}

//PhysicsArrayRenderer.prototype.re



/*PhysicsArrayRenderer.prototype.addBoundTexture = function( system , uniform , value ){
  this.boundTextures.push( [ system , uniform , value ] );
}

PhysicsArrayRenderer.prototype.bindTextures = function(){

  for( var i = 0; i < this.boundTextures.length; i++ ){

    var boundSystem = this.boundTextures[i][0];
    var boundUniform = this.boundTextures[i][1];
    var textureToBind = this.boundTextures[i][2];

    var uniform = boundSystem.material.uniforms[ boundUniform ];

    uniform.value = this[ textureToBind ];


  }

}*/

