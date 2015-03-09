function Hypercube( size ){


  var u = {
    
    time:G.timer,
    t_audio:G.t_audio,

    stepDepth:{ type:"f" , value: 10. },
    brightness:{type:"f",value: 1 },
    oscillationSize:{ type:"f" , value: .04 },
    lightPos:{type:"v3",value: G.mani.position },
    
    iModelMat:{ type:"m4" , value: new THREE.Matrix4() },

  }

  var a = {
    faceType: { type:"f" , value:null }
  }

  var mat = new THREE.ShaderMaterial({

    uniforms:       u,
    attributes:     a,
    vertexShader:   G.shaders.vs.hologram,
    fragmentShader: G.shaders.fs.hologram,
    side:           THREE.DoubleSide,
  //  transparent:    true,
  //  depthWrite:     false,
  //  blending:       THREE.AdditiveBlending

  });

  var geo = this.createGeometry( size );
  this.body = new THREE.Mesh( geo , mat );





}


Hypercube.prototype.update = function(){

  this.body.updateMatrixWorld();
  this.body.material.uniforms.iModelMat.value.getInverse( this.body.matrixWorld );


}



Hypercube.prototype.createGeometry = function( size ){

  var faces = [

    /*
    
      Lil Cube 

    */

    // Top Face
    [ [  1 , 1 ,  1 ],
      [  1 , 1 , -1 ],
      [ -1 , 1 , -1 ],
      [ -1 , 1 ,  1 ] ],

    // Bottom Face
    [ [  1 , -1 ,  1 ],
      [  1 , -1 , -1 ],
      [ -1 , -1 , -1 ],
      [ -1 , -1 ,  1 ] ],

    // Left Face
    [ [ -1 ,  1 ,  1 ],
      [ -1 ,  1 , -1 ],
      [ -1 , -1 , -1 ],
      [ -1 , -1 ,  1 ] ],
     
    // Right Face
    [ [  1 ,  1 ,  1 ],
      [  1 ,  1 , -1 ],
      [  1 , -1 , -1 ],
      [  1 , -1 ,  1 ] ],

    // Front Face
    [ [  1 ,  1 , -1 ],
      [ -1 ,  1 , -1 ],
      [ -1 , -1 , -1 ],
      [  1 , -1 , -1 ] ],

    // Back Face
    [ [  1 ,  1 , 1 ],
      [ -1 ,  1 , 1 ],
      [ -1 , -1 , 1 ],
      [  1 , -1 , 1 ] ],



    /* 
    
      Big Cube 


    // Top Face
    [ [  2 , 2 ,  2 ],
      [  2 , 2 , -2 ],
      [ -2 , 2 , -2 ],
      [ -2 , 2 ,  2 ] ],

    // Bottom Face
    [ [  2 , 2 ,  2 ],
      [  2 , 2 , -2 ],
      [ -2 , 2 , -2 ],
      [ -2 , 2 ,  2 ] ],

    // Left Face
    [ [ -2 ,  2 ,  2 ],
      [ -2 ,  2 , -2 ],
      [ -2 , -2 , -2 ],
      [ -2 , -2 ,  2 ] ],
     
    // Right Face
    [ [  2 ,  2 ,  2 ],
      [  2 ,  2 , -2 ],
      [  2 , -2 , -2 ],
      [  2 , -2 ,  2 ] ],

    // Front Face
    [ [  2 ,  2 , -2 ],
      [ -2 ,  2 , -2 ],
      [ -2 , -2 , -2 ],
      [  2 , -2 , -2 ] ],

    // Back Face
    [ [  2 ,  2 , 2 ],
      [ -2 ,  2 , 2 ],
      [ -2 , -2 , 2 ],
      [  2 , -2 , 2 ] ],

   
    */

    /*
     
       FINS

    */

    // Front / Right Fin
    [
      [  1 , -1 , -1 ],
      [  2 , -2 , -2 ],
      [  2 ,  2 , -2 ],
      [  1 ,  1 , -1 ],
    ],

    // Back / Right Fin
    [ 
      [  1 ,  1 , 1 ],
      [  2 ,  2 , 2 ],
      [  2 , -2 , 2 ], 
      [  1 , -1 , 1 ]
    ],

    // Front / Left Fin
    [ 
      [ -1 ,  1 , -1 ],
      [ -2 ,  2 , -2 ],
      [ -2 , -2 , -2 ],
      [ -1 , -1 , -1 ],
    ],

    // Back / Left Fin
    [ 
      [ -1 ,  1 , 1 ],
      [ -2 ,  2 , 2 ],
      [ -2 , -2 , 2 ],
      [ -1 , -1 , 1 ],
    ],


    // Front / Bottom Fin
    [ 
      [  1 , -1 , -1 ],
      [  2 , -2 , -2 ],
      [ -2 , -2 , -2 ],
      [ -1 , -1 , -1 ],
    ],

    // Front / Top Fin
    [ 
      [  1 , 1 , -1 ],
      [  2 , 2 , -2 ],
      [ -2 , 2 , -2 ],
      [ -1 , 1 , -1 ],
    ],

    // Back / Bottom Fin
    [ 
      [  1 , -1 , 1 ],
      [  2 , -2 , 2 ],
      [ -2 , -2 , 2 ],
      [ -1 , -1 , 1 ],
    ],

    // Back / Top Fin
    [ 
      [  1 , 1 , 1 ],
      [  2 , 2 , 2 ],
      [ -2 , 2 , 2 ],
      [ -1 , 1 , 1 ],
    ],


    // right bottom
    [ 
      [ 1 , -1 ,  1 ],
      [ 2 , -2 ,  2 ],
      [ 2 , -2 , -2 ],
      [ 1 , -1 , -1 ]
    ],

    // left bottom
    [ 
      [ -1 , -1 ,  1 ],
      [ -2 , -2 ,  2 ],
      [ -2 , -2 , -2 ],
      [ -1 , -1 , -1 ]
    ],

    // left top
     [ 
      [ -1 , 1 ,  1 ],
      [ -2 , 2 ,  2 ],
      [ -2 , 2 , -2 ],
      [ -1 , 1 , -1 ]
    ],

    // top right
    [ 
      [ 1 , 1 ,  1 ],
      [ 2 , 2 ,  2 ],
      [ 2 , 2 , -2 ],
      [ 1 , 1 , -1 ]
    ],



  ];


  var positions  = new Float32Array( faces.length * 6 * 3 );
  var normals    = new Float32Array( faces.length * 6 * 3 );
  var tangents   = new Float32Array( faces.length * 6 * 3 );
  var types      = new Float32Array( faces.length * 6 * 1 );
  var uvs        = new Float32Array( faces.length * 6 * 2 );


  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();
  var v3 = new THREE.Vector3();
  var v4 = new THREE.Vector3();

  var uv1 = new THREE.Vector2();
  var uv2 = new THREE.Vector2();
  var uv3 = new THREE.Vector2();
  var uv4 = new THREE.Vector2();

  
  var tmpV1 = new THREE.Vector3();
  var tmpV2 = new THREE.Vector3();

  var norm = new THREE.Vector3();
  var tang = new THREE.Vector3();
 
  for( var i = 0 ; i < faces.length; i++ ){


    var faceIndex = i * 6;
    var vertIndex = faceIndex * 3;
    var typeIndex = faceIndex * 1;
    var uvIndex   = faceIndex * 2;
    var face = faces[i];

    v1.set( face[0][0] , face[0][1] , face[0][2] );
    v2.set( face[1][0] , face[1][1] , face[1][2] );
    v3.set( face[2][0] , face[2][1] , face[2][2] );
    v4.set( face[3][0] , face[3][1] , face[3][2] );

    v1.multiplyScalar( size );
    v2.multiplyScalar( size );
    v3.multiplyScalar( size );
    v4.multiplyScalar( size );


    tmpV1.copy( v2 );
    tmpV2.copy( v2 );
    tmpV1.sub( v1 );
    tmpV2.sub( v3 );
  
    norm.crossVectors( tmpV1 , tmpV2 );
    norm.normalize(); 

    // any vec in the plane should do, as long as it is
    // shared across all attributes 
    tang.copy( v2 );
    tang.sub( v1 );
    tang.normalize();


    uv1.set( 0 , 0 );
    uv2.set( 0 , 1 );
    uv3.set( 1 , 1 );
    uv4.set( 1 , 0 );

    
    this.assignBufVec2( uvs , uvIndex + 0  , uv1 );
    this.assignBufVec2( uvs , uvIndex + 2  , uv3 );
    this.assignBufVec2( uvs , uvIndex + 4  , uv2 );
    this.assignBufVec2( uvs , uvIndex + 6  , uv4 );
    this.assignBufVec2( uvs , uvIndex + 8  , uv3 );
    this.assignBufVec2( uvs , uvIndex + 10 , uv1 );


    this.assignBufVec3( positions , vertIndex + 0  , v1 ); 
    this.assignBufVec3( positions , vertIndex + 3  , v3 ); 
    this.assignBufVec3( positions , vertIndex + 6  , v2 ); 
    this.assignBufVec3( positions , vertIndex + 9  , v4 ); 
    this.assignBufVec3( positions , vertIndex + 12 , v3 ); 
    this.assignBufVec3( positions , vertIndex + 15 , v1 );

    this.assignBufVec3( normals , vertIndex + 0  , norm ); 
    this.assignBufVec3( normals , vertIndex + 3  , norm ); 
    this.assignBufVec3( normals , vertIndex + 6  , norm ); 
    this.assignBufVec3( normals , vertIndex + 9  , norm );
    this.assignBufVec3( normals , vertIndex + 12 , norm );
    this.assignBufVec3( normals , vertIndex + 15 , norm );

    this.assignBufVec3( tangents , vertIndex + 0  , tang ); 
    this.assignBufVec3( tangents , vertIndex + 3  , tang ); 
    this.assignBufVec3( tangents , vertIndex + 6  , tang ); 
    this.assignBufVec3( tangents , vertIndex + 9  , tang ); 
    this.assignBufVec3( tangents , vertIndex + 12 , tang ); 
    this.assignBufVec3( tangents , vertIndex + 15 , tang ); 

    var type ;
    if( i < 6 ){
      console.log('TYPE: 0');
      type = 0;
    }else if( i >= 6 && i < 12 ){
      console.log('TYPE: 1');
      type = 1;
    }else{
      console.log('TYPE: 2');
      type = 2;
    }

    this.assignBufFloat( types , typeIndex + 0, type ); 
    this.assignBufFloat( types , typeIndex + 1, type ); 
    this.assignBufFloat( types , typeIndex + 2, type ); 
    this.assignBufFloat( types , typeIndex + 3, type ); 
    this.assignBufFloat( types , typeIndex + 4, type ); 
    this.assignBufFloat( types , typeIndex + 5, type ); 


  } 

  var geo = new THREE.BufferGeometry();

  var posA  = new THREE.BufferAttribute( positions , 3 );
  var tangA = new THREE.BufferAttribute( tangents  , 3 );
  var normA = new THREE.BufferAttribute( normals   , 3 );
  var uvA   = new THREE.BufferAttribute( uvs       , 2 );
  var typeA = new THREE.BufferAttribute( types     , 1 );

  geo.addAttribute( 'position' , posA  );
  geo.addAttribute( 'tangent'  , tangA );
  geo.addAttribute( 'normal'   , normA );
  geo.addAttribute( 'uv'       , uvA   );
  geo.addAttribute( 'faceType' , typeA );

  return geo;

}

Hypercube.prototype.assignBufVec3 = function( buf , index , vec ){

  buf[ index + 0 ] = vec.x;
  buf[ index + 1 ] = vec.y;
  buf[ index + 2 ] = vec.z;

}

Hypercube.prototype.assignBufVec2 = function( buf , index , vec ){

  buf[ index + 0 ] = vec.x;
  buf[ index + 1 ] = vec.y;

}

Hypercube.prototype.assignBufFloat = function( buf , index , f ){

  buf[ index ] = f;

}
