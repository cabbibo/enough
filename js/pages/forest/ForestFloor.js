 
function ForestFloor( params ){

  var forestFloorGeo = new THREE.PlaneGeometry( params.width , params.height , 300 , 300 );

  console.log('IPOS');
  console.log( G.iPosition );

  var forestFloorMat = new THREE.ShaderMaterial({

    uniforms:{

      lightPos:{type:"v3",value:G.iPoint }


    },
    vertexShader: G.shaders.vs.forestFloor,
    fragmentShader: G.shaders.fs.forestFloor,


  });


  var forestFloor = new THREE.Mesh(
    forestFloorGeo,
    forestFloorMat
  );

  return forestFloor;


}


