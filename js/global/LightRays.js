function LightRays(){

  console.log( G.shaders );
  var geo = G.GEOS.planeBuffer;


  //this.body = new THREE.Object3D();

  this.rays = [];

  for( var i = 0; i < 5; i++ ){

     var mat = new THREE.ShaderMaterial({
    
      uniforms:{
        t_audio: G.t_audio,
        time: G.timer,
        offset: { type:"f" , value: i }
      },
      vertexShader: G.shaders.vs.lightRays,
      fragmentShader: G.shaders.fs.lightRays,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh( geo , mat );

    //mesh.rotation.x = Math.random() - .5;
    mesh.rotation.z = (Math.random() - .5)*.4;
    mesh.rotation.y = (Math.random() - .5)*.4;
    mesh.scale.multiplyScalar( 1000.3 );
    mesh.scale.y *= 3;
    //mesh.position.x = (Math.random() - .5) * 2;
    //mesh.position.z = (Math.random() - .5) * 2;
    //this.body.add( mesh );
    this.rays.push( mesh );

  }


}

LightRays.prototype.update = function(){


  for( var i = 0; i < this.rays.length; i ++ ){

    var r = this.rays[i];

    r.rotation.x = Math.sin(i + 5 * Math.sin( G.timer.value * .01 )) * .3;
    r.rotation.y = Math.sin(i + 5 * Math.sin( G.timer.value * .01 )) * .3;
    r.rotation.z = Math.sin(i + 5 * Math.sin( G.timer.value * .01 )) * .3;

    var d = Math.abs( Math.sin( i + 4 + Math.sin( G.timer.value * .001 ) )  ) * 2000 + 500;
    var x = Math.sin( i + 8.124 + Math.sin( G.timer.value * .001 ) ) * 2000;

   // console.log( d );
    G.v1.copy( G.camera.position );

    G.v2.set( 0 , 0 , -1 );
    G.v2.applyQuaternion( G.camera.quaternion );
    G.v2.multiplyScalar( d );

    G.v1.add( G.v2 );

    G.v2.set( 1 , 0 , 0 );
    G.v2.applyQuaternion( G.camera.quaternion );
    G.v2.multiplyScalar( x );

  

    G.v1.add( G.v2 );

   // G.v1.sub( r.position );
    //G.v1.multiplyScalar( .5 );

  
   // console.log( G.v1 );
    r.position.copy( G.v1 );

    //r.position.add( G.v1 );


  }




}
