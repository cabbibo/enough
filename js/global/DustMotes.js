function DustMotes(){

  var numOf = 50;

  this.body = new THREE.Object3D();

  var geo = new THREE.BufferGeometry();

  var pos   = new Float32Array( numOf * 3 );
  var id = new Float32Array( numOf * 1 );

  for( var i = 0; i < 50; i++ ){
  
    var p = new THREE.Vector3();
    p.x = (Math.random() - .5 ) * 4000;
    p.y = (Math.random() - .5 ) * 4000;
    p.z = (Math.random() - .5 ) * 4000;
   
    pos[ i * 3 + 0 ] = p.x; 
    pos[ i * 3 + 1 ] = p.y; 
    pos[ i * 3 + 2 ] = p.z;

    id[ i ] = i / numOf;

  }

  var posA = new THREE.BufferAttribute( pos   , 3 );
  var idA = new THREE.BufferAttribute( id , 1 );
  geo.addAttribute( 'position' , posA );
  geo.addAttribute( 'moteID' , idA );

  var uniforms = {

    t_sprite:{type:"t" , value: G.TEXTURES["sprite_mote"] },
    t_audio: G.t_audio,

  }

  var mat = new THREE.ShaderMaterial({
    uniforms:uniforms,
    attributes:{
      moteID:{type:"f" ,value: null }
    },
    vertexShader:   G.shaders.vs.dustMote,
    fragmentShader: G.shaders.fs.dustMote,
   // opacity:.2,
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

DustMotes.prototype.update = function(){

 
  for( var i =0; i< this.clouds.length; i++ ){

    this.clouds[i].rotation.x += Math.sin( i ) * .0002;
    this.clouds[i].rotation.y += Math.sin( i ) * .0002;
    this.clouds[i].rotation.z += Math.sin( i ) * .0002;


   /* G.tmpV3.copy( G.camera.position );
    G.tmpV3.sub( this.clouds[i].position );
    G.tmpV3.multiplyScalar( .1 + .08 * Math.sin( i ) );
    this.clouds[i].position.add( G.tmpV3 );*/

    /*this.clouds[i].position.y += .1;

    if( this.clouds[i].position.y >= 3000 ){

      this.clouds[i].position.y = -3000



    }*/

  }

}
