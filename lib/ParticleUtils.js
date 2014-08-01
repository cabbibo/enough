var ParticleUtils = {


  /* From @mrdoob's Sporel Demo */
  createPositionsTexture: function( size , mesh ){

    var geometry = new THREE.Geometry();

    geometry.merge( mesh.geometry , mesh.matrix );

    var point = new THREE.Vector3();
    var facesLength = geometry.faces.length;

    var data = new Float32Array( size * size * 4 );

    for ( var i = 0, l = data.length; i < l; i += 4 ) {

      var face = geometry.faces[ Math.floor( Math.random() * facesLength ) ];

      var vertex1 = geometry.vertices[ face.a ];
      var vertex2 = geometry.vertices[ Math.random() > 0.5 ? face.b : face.c ];

      point.subVectors( vertex2, vertex1 );
      point.multiplyScalar( Math.random() );
      point.add( vertex1 );

      data[ i ] = point.x;
      data[ i + 1 ] = point.y;
      data[ i + 2 ] = point.z;
      data[ i + 3 ] = -1;

    }

    var positionsTexture = new THREE.DataTexture(
      data, 
      size, 
      size, 
      THREE.RGBAFormat, 
      THREE.FloatType 
    );

    positionsTexture.minFilter = THREE.NearestFilter;
    positionsTexture.magFilter = THREE.NearestFilter;
    positionsTexture.generateMipmaps = false;
    positionsTexture.needsUpdate = true;

    positionsTexture.mesh = mesh;

    return positionsTexture;

  },


  createFlatTexture: function( size ){


    var data = new Float32Array( size * size * 4 );

    for ( var i = 0, l = data.length; i < l; i += 4 ) {

      var y = Math.floor( (i/4) / size );
      var x = (i/4)  - (y * size);


      var theta = 2 * Math.PI * ( x / size );

      var posX = 100 * Math.cos( theta );
      var posZ = 100 * Math.sin( theta );

      /*var face = geometry.faces[ Math.floor( Math.random() * facesLength ) ];

      var vertex1 = geometry.vertices[ face.a ];
      var vertex2 = geometry.vertices[ Math.random() > 0.5 ? face.b : face.c ];

      point.subVectors( vertex2, vertex1 );
      point.multiplyScalar( Math.random() );
      point.add( vertex1 );*/

      data[ i ] = posX;
      data[ i + 1 ] = -(y/size)*100;
      data[ i + 2 ] = posZ;
      data[ i + 3 ] = 1;

    }

    var positionsTexture = new THREE.DataTexture(
      data, 
      size, 
      size, 
      THREE.RGBAFormat, 
      THREE.FloatType 
    );

    positionsTexture.minFilter = THREE.NearestFilter;
    positionsTexture.magFilter = THREE.NearestFilter;
    positionsTexture.generateMipmaps = false;
    positionsTexture.needsUpdate = true;

    return positionsTexture;

  },


  createLookupGeometry: function( size ){        
        
    var geo = new THREE.BufferGeometry();

   // geo.addAttribute( 'position', Float32Array , size * size , 3 );
  
    var positions = new Float32Array(  size * size * 3 );

    for ( var i = 0, j = 0, l = positions.length / 3; i < l; i ++, j += 3 ) {

      positions[ j     ] = ( i % size ) / size;
      positions[ j + 1 ] = Math.floor( i / size ) / size;
      //positions[ j + 2 ] = Math.sin( (i / size) * Math.PI );

    }

    var posA = new THREE.BufferAttribute( positions , 3 );
    geo.addAttribute( 'position', posA );



    return geo;
    
  }

}
