function RandomParticles(){

  this.body = new THREE.Object3D();

  var geo = new THREE.Geometry();

  for( var i = 0; i < 50; i++ ){
  
    var p = new THREE.Vector3();
    p.x = (Math.random() - .5 ) * 1000;
    p.y = (Math.random() - .5 ) * 1000;
    p.z = (Math.random() - .5 ) * 1000;
    
    geo.vertices.push( p );


  }

  var mat = new THREE.PointCloudMaterial({
    size: 6,
    map:G.TEXTURES[ "sprite_mote" ],
    opacity:.2,
    transparent:true,
    blending:THREE.AdditiveBlending,
    depthWrite:false
    
  });


  this.clouds = [];

  for( var i =0; i < 10; i++ ){

    var pc = new THREE.PointCloud( geo , mat );
    pc.position.x = (Math.random() - .5 ) * 500;
    pc.position.y = (Math.random() - .5 ) * 500;
    pc.position.z = (Math.random() - .5 ) * 500;

    pc.rotation.x = Math.random() * Math.PI * 2;
    pc.rotation.y = Math.random() * Math.PI * 2;
    pc.rotation.z = Math.random() * Math.PI * 2;

    this.body.add( pc );

    this.clouds.push( pc );
  }


}

RandomParticles.prototype.update = function(){

 
  for( var i =0; i< this.clouds.length; i++ ){

    this.clouds[i].rotation.x += Math.sin( i ) * .0002;
    this.clouds[i].rotation.y += Math.sin( i ) * .0002;
    this.clouds[i].rotation.z += Math.sin( i ) * .0002;


    G.tmpV3.copy( G.camera.position );
    G.tmpV3.sub( this.clouds[i].position );
    G.tmpV3.multiplyScalar( .1 + .08 * Math.sin( i ) );
    this.clouds[i].position.add( G.tmpV3 );

    /*this.clouds[i].position.y += .1;

    if( this.clouds[i].position.y >= 3000 ){

      this.clouds[i].position.y = -3000



    }*/

  }

}
