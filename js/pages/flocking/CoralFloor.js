function CoralFloor( coral ){

  this.coral = coral;
  this.coralPositions = [];
  this.coralData = [];
  
  for( var i = 0; i < this.coral.length; i++ ){
    this.coralPositions.push( this.coral[i].position );
    this.coralData.push( this.coral[i].data );
  }
  

  var geo = new THREE.PlaneBufferGeometry( 2000 , 2000 , 500 , 500 );
 
    
  this.uniforms = {

    coral: { type: "v3v" , value:this.coralPositions },
    coralData: { type: "v4v" , value:this.coralData },
    mani: { type:"v3" , value:G.mani.position }

  }

  var fs = G.shaders.setValue( 
    G.shaders.fs.coralFloor, 
    'SIZE' ,
    this.coral.length  
  ); 

  var vs = G.shaders.setValue( 
    G.shaders.vs.coralFloor, 
    'SIZE' ,
    this.coral.length  
  ); 

  var mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: vs,
    fragmentShader: fs,
  });


  this.body = new THREE.Mesh( geo , mat );
  this.body.rotation.x = - Math.PI /2;

  this.body.position.y = -500;

}
