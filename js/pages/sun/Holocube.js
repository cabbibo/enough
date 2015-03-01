function Holocube( size , brightness ){

  console.log( 'TIMES' );
  console.log( G.timer );
  var uniforms = {

    t_audio:G.t_audio,
    time:G.timer,

    lightPos:{type:"v3",value: G.mani.position },
    stepDepth:{ type:"f" , value: 10. },
    oscillationSize:{ type:"f" , value: .04 },
    brightness:{type:"f",value:brightness }

  }


  this.meshes = [];
  
  this.body = new THREE.Object3D();
  var size = size || 20
  var dir = [

    [1,0,0],
    [-1,0,0],
    [0,1,0],
    [0,-1,0],
    [0,0,1],
    [0,0,-1],

  ];

  var geo = new THREE.PlaneBufferGeometry( size , size );
  geo.computeTangents();

  for( var i = 0; i < dir.length; i++ ){

    var m = Hologram( 
        geo, 
        uniforms,
        G.shaders.vertexShaders.hologram,
        G.shaders.fragmentShaders.hologram
     );

    m.position.x = dir[i][0]*.5*size; 
    m.position.y = dir[i][1]*.5*size;
    m.position.z = dir[i][2]*.5*size; 

    m.lookAt( new THREE.Vector3() );
    this.body.add( m );
    this.meshes.push( m );


  }


}

Holocube.prototype.update = function(){

  this.body.rotation.x += G.dT.value * .1;
  this.body.rotation.y += G.dT.value * .3;
  this.body.rotation.z += G.dT.value * -.07;
  this.body.updateMatrixWorld();

  for( var i=0; i < this.meshes.length; i++ ){

    this.meshes[i].update();

  }



}


