function Hologram( geo , uniforms , vs , fs ){

  var u = {
    iModelMat:{ type:"m4" , value: new THREE.Matrix4() },
  }

  for( var propt in uniforms ){
  
    u[propt] = uniforms[propt];

  }

  var mat = new THREE.ShaderMaterial({

    uniforms:       u,
    vertexShader:   vs,
    fragmentShader: fs,
   // side: THREE.DoubleSide,
    //transparent: true,
  //  blending: THREE.AdditiveBlending,
  //  depthWrite: false

  });
         

  var mesh = new THREE.Mesh( geo , mat );


  mesh.update = function(){
 
    this.updateMatrixWorld();
    this.material.uniforms.iModelMat.value.getInverse( this.matrixWorld );

  }.bind( mesh );

  return mesh;

}
