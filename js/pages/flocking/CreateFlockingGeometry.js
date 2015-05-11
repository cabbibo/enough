
function CreateFlockingGeometry( size , depth , sides ){

  var createParticleGeometry = function( size ){

    var s2 = size * size;
    var geo = new THREE.BufferGeometry();

    var aPos= new THREE.BufferAttribute( new Float32Array( s2 * 3 ), 3 );
    geo.addAttribute( 'position', aPos );
   
    var positions = geo.attributes.position.array;

    for( var i = 0; i < size; i++ ){

      for( var j = 0; j < size; j++ ){

        var index = (( i * size ) + j ) * 3;

        positions[ index + 0 ] = i / size;
        positions[ index + 1 ] = j / size;

      }

    }

    return geo;

  }

  var createPredatorDebugGeometry = function( size ){

    var s2 = size * size;
    var geo = new THREE.BufferGeometry();

    var aPos= new THREE.BufferAttribute( new Float32Array( s2 * 3 * 2 ), 3 );
    geo.addAttribute( 'position', aPos );
   
    var positions = geo.attributes.position.array;

    for( var i = 0; i < size; i++ ){

      for( var j = 0; j < size; j++ ){

        var index = (( i * size ) + j ) * 3 * 2;

        positions[ index + 0 ] = i / size;
        positions[ index + 1 ] = j / size;
        positions[ index + 2 ] = 0;

        positions[ index + 3 ] = i / size;
        positions[ index + 4 ] = j / size;
        positions[ index + 5 ] = 1;

      }

    }

    return geo;

  }


  var createFishDebugGeometry = function( size ){

    var s2 = size * size;
    var geo = new THREE.BufferGeometry();

    var aPos= new THREE.BufferAttribute( new Float32Array( s2  * s2 * 3 ), 3 );
    var aPos2 = new THREE.BufferAttribute( new Float32Array( s2  * s2 * 3 ), 3 );
    
    geo.addAttribute( 'position', aPos );
    geo.addAttribute( 'position2', aPos2 );
   
    var positions = geo.attributes.position.array;
    var positions2 = geo.attributes.position2.array;

    for( var i = 0; i < size; i++ ){

      for( var j = 0; j < size; j++ ){


        // for each fish, we need to draw a connection
        // to every other fish
        
        for( var k = i; k < size; k++ ){
          for( var l = j; l < size; l++ ){

            var index = (((( i * size ) + j ) * s2) +((k-i) * size + (l-j))) * 3 * 2;

            positions[ index + 0 ] = i / size;
            positions[ index + 1 ] = j / size;
            positions[ index + 2 ] = 0;

            positions[ index + 3 ] = k / size;
            positions[ index + 4 ] = l / size;
            positions[ index + 5 ] = 1;


            positions2[ index + 0 ] = k / size;
            positions2[ index + 1 ] = l / size;
            positions2[ index + 2 ] = 1;
            
            positions2[ index + 3 ] = i / size;
            positions2[ index + 4 ] = j / size;
            positions2[ index + 5 ] = 0;


          }
        }


      }

    }

    return geo;

  }


  var createLineGeometry = function( size , depth ){

    var s2 = size * size;
    var geo = new THREE.BufferGeometry();

    var aPos= new THREE.BufferAttribute( new Float32Array( s2 * 2 * (depth-1) * 3 ), 3 );
    geo.addAttribute( 'position', aPos );
   
    var positions = geo.attributes.position.array;

    for( var i = 0; i < size; i++ ){

      for( var j = 0; j < size; j++ ){

        for( var k = 0; k < depth-1; k++ ){ 
         
          var index = (( i * size*(depth-1) ) + j*(depth-1)  ) * 2  * 3;

          index += k * 2 * 3;
          //console.log( k+1 );

          positions[ index + 0 ] = i / size;
          positions[ index + 1 ] = j / size;
          positions[ index + 2 ] = k;

          positions[ index + 3 ] = i / size;
          positions[ index + 4 ] = j / size;
          positions[ index + 5 ] = k+1;

          //console.log( positions[ index + 0] );
        }

      }

    }

    return geo;

  }



  // Don't need UV because can use info to easily calculate
  var createRibbonGeometry = function( size , depth ){

    var s2 = size * size;
    var geo = new THREE.BufferGeometry();

    var totalVerts =  s2 * 2 * (depth-1) * 6;
    //console.log( 'Total Verts: ' + totalVerts );
    var aPos  = new THREE.BufferAttribute( new Float32Array( totalVerts * 3 ), 3 );
    var aUV   = new THREE.BufferAttribute( new Float32Array( totalVerts * 2 ), 2 );
    //var aInfo = new THREE.BufferAttribute( new Float32Array( totalVerts * 2 ), 2 );
   
    geo.addAttribute( 'position', aPos );
    geo.addAttribute( 'uv', aUV );
    //geo.addAttribute( 'info', aInfo );
   
    var positions = geo.attributes.position.array;
    var uvs       = geo.attributes.uv.array;
    //var info      = geo.attributes.info.array;


    //
    for( var i = 0; i < size; i++ ){
      for( var j = 0; j < size; j++ ){

        for( var k = 0; k < depth-1; k++ ){

          var whichRibbon = (( i * size ) + j ) * ( depth - 1);
          var index = whichRibbon;

          index += k;

          var vertIndex = index * 6;

          var pIndex = vertIndex * 3;
          var iIndex = vertIndex * 2;
          //console.log( k+1 );

          var newK = k + .5;

          // TRIANGLE 1

          positions[ pIndex + 0   ] = i / size;
          positions[ pIndex + 1   ] = j / size;
          positions[ pIndex + 2   ] = newK/(depth+1);

          uvs[ iIndex + 0 ]        = newK/(depth+1); 
          uvs[ iIndex + 1 ]        = 1;

          positions[ pIndex + 3   ] = i / size;
          positions[ pIndex + 4   ] = j / size;
          positions[ pIndex + 5   ] = newK/(depth+1);

          uvs[ iIndex + 2 ]        = newK/(depth+1); 
          uvs[ iIndex + 3 ]        = -1;


          positions[ pIndex + 6   ] = i / size;
          positions[ pIndex + 7   ] = j / size;
          positions[ pIndex + 8   ] = (newK+1)/(depth+1);

          uvs[ iIndex + 4 ]        = (newK+1)/(depth+1); 
          uvs[ iIndex + 5 ]        = 1;

           // TRIANGLE 2

          positions[ pIndex + 9   ] = i / size;
          positions[ pIndex + 10  ] = j / size;
          positions[ pIndex + 11  ] = (newK+1)/(depth+1);
    
          uvs[ iIndex + 6 ]        = (newK+1)/(depth+1); 
          uvs[ iIndex + 7 ]        = 1;

          positions[ pIndex + 12  ] = i / size;
          positions[ pIndex + 13  ] = j / size;
          positions[ pIndex + 14  ] = newK/(depth+1);

          uvs[ iIndex + 8 ]        = newK/(depth+1); 
          uvs[ iIndex + 9 ]        = -1;

          positions[ pIndex + 15  ] = i / size;
          positions[ pIndex + 16  ] = j / size;
          positions[ pIndex + 17  ] = (newK+1)/(depth+1);

          uvs[ iIndex + 10 ]       = (newK+1)/(depth+1); 
          uvs[ iIndex + 11 ]       = -1;

        }

      }

    }

    return geo;

  }


  // Don't need UV because can use info to easily calculate
  var createTubeGeometry = function( size , depth , sides){

    var s2 = size * size;
    var geo = new THREE.BufferGeometry();


    var sides = sides || 3;

    var totalVerts =  s2 * (depth-1) * 6 * sides;
    console.log( 'Total Verts: ' + totalVerts );
    var aPos  = new THREE.BufferAttribute( new Float32Array( totalVerts * 3 ), 3 );
    var aUV   = new THREE.BufferAttribute( new Float32Array( totalVerts * 2 ), 2 );
    //var aInfo = new THREE.BufferAttribute( new Float32Array( totalVerts * 2 ), 2 );
   
    geo.addAttribute( 'position', aPos );
    geo.addAttribute( 'uv', aUV );
    //geo.addAttribute( 'info', aInfo );
   
    var positions = geo.attributes.position.array;
    var uvs       = geo.attributes.uv.array;
    //var info      = geo.attributes.info.array;


    //
    for( var i = 0; i < size; i++ ){
      for( var j = 0; j < size; j++ ){

        for( var k = 0; k < depth-1; k++ ){

          var whichRibbon = (( i * size ) + j ) * ( depth - 1)  * sides;
          var index = whichRibbon;

          index += k * sides;

          var newK = k + .5;

          for( var l = 0; l < sides; l ++ ){

            var vertIndex = index;
            vertIndex += l;
            vertIndex *= 6;

            

            var pIndex = vertIndex * 3;
            var iIndex = vertIndex * 2;

            var t = l / sides;

            var up = (l+1) % sides;
            var t1 = up / sides;

            // TRIANGLE 1
            positions[ pIndex + 0   ] = i / size;
            positions[ pIndex + 1   ] = j / size;
            positions[ pIndex + 2   ] = t;

            uvs[ iIndex + 0 ]        = newK/(depth+1); 
            uvs[ iIndex + 1 ]        = t;

            positions[ pIndex + 3   ] = i / size;
            positions[ pIndex + 4   ] = j / size;
            positions[ pIndex + 5   ] = t1;

            uvs[ iIndex + 2 ]        = newK/(depth+1); 
            uvs[ iIndex + 3 ]        = t1;


            positions[ pIndex + 6   ] = i / size;
            positions[ pIndex + 7   ] = j / size;
            positions[ pIndex + 8   ] = t;

            uvs[ iIndex + 4 ]        = (newK+1)/(depth+1); 
            uvs[ iIndex + 5 ]        = t;


            // TRIANGLE 2
            positions[ pIndex + 9   ] = i / size;
            positions[ pIndex + 10  ] = j / size;
            positions[ pIndex + 11  ] = t;
      
            uvs[ iIndex + 6 ]        = (newK+1)/(depth+1); 
            uvs[ iIndex + 7 ]        = t;

            positions[ pIndex + 12  ] = i / size;
            positions[ pIndex + 13  ] = j / size;
            positions[ pIndex + 14  ] = t1;

            uvs[ iIndex + 8 ]        = newK/(depth+1); 
            uvs[ iIndex + 9 ]        = t1;

            positions[ pIndex + 15  ] = i / size;
            positions[ pIndex + 16  ] = j / size;
            positions[ pIndex + 17  ] = t1;

            uvs[ iIndex + 10 ]       = (newK+1)/(depth+1); 
            uvs[ iIndex + 11 ]       = t1;



          }
         
        }

      }

    }

    return geo;

  }



  var geometries = {

    line :           createLineGeometry,
    tube :           createTubeGeometry,
    ribbon :         createRibbonGeometry,
    particle :       createParticleGeometry,
    fishDebug :      createFishDebugGeometry,
    predatorDebug :  createPredatorDebugGeometry, 


 }


  return geometries;
}
