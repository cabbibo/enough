          
  function createLineGeo(){

    var lineGeo = new THREE.BufferGeometry();
    lineGeo.addAttribute( 'position', new Float32Array( 32 * 32 * 2 * 3 ), 3 );
    lineGeo.addAttribute( 'color'   , new Float32Array( 32 * 32 * 2 * 3 ), 3 );
    var positions = lineGeo.getAttribute( 'position' ).array;
    var colors = lineGeo.getAttribute( 'color' ).array;

    var size = 1 / 32;
    var hSize = size / 2;

    for( var i = 0; i < 32; i ++ ){

      // Spine 
      var index = i * 3;

      var p1 = index * 2;
      var p2 = index * 2 + 3;

      positions[ p1 ] = 0 * size ;
      positions[ p1 + 1 ] = i * size ;
      positions[ p1 + 2 ] = 1;

      positions[ p2 ] = 0 * size ;
      positions[ p2 + 1 ] = (i + 1) * size;
      positions[ p2 + 2 ] = 1;

      colors[ p1 ]      = i;
      colors[ p1 + 1 ]  = 0;
      colors[ p1 + 2 ]  = 0;

      colors[ p2 ]      = i + 1;
      colors[ p2 + 1 ]  = 0;
      colors[ p2 + 2 ]  = 0;

      // Sub
      for( var j = 0; j < 4; j++ ){

        // Start these positions after all of our indices
        var startingIndex = 32 * 3;

        var columnStartingIndex = startingIndex + ( 32 * 3 * j);

        var index = (i * 3) + columnStartingIndex;

        var p1 = index * 2;
        var p2 = index * 2 + 3;
        

        positions[ p1 ] = 0 * size;
        positions[ p1 + 1 ] = i * size ;
        positions[ p1 + 2 ] = 1;

        positions[ p2 ]     = ( j + 1) * size;
        positions[ p2 + 1 ] = i  * size;
        positions[ p2 + 2 ] = .1;

        colors[ p1 ]      = (i +1) / size;
        colors[ p1 + 1 ]  = 0;
        colors[ p1 + 2 ]  = 0;

        colors[ p2 ]      = (i +1) / size;
        colors[ p2 + 1 ]  = 1;
        colors[ p2 + 2 ]  = 0;

        //positions[ i + 3 ] = Math.random() * 20;
    
      }


      // Sub Sub
      for( var j = 0; j < 4; j ++ ){
        for( var k = 0; k < 4; k++ ){

          var startingIndex = 5 * 32 * 3;
          var groupStartingIndex = startingIndex + ( 32 * 3 * 4 * (j) );
          var columnStartingIndex = groupStartingIndex + ( 32 * 3 * (k) );

          var index = ( i *3 ) + columnStartingIndex;

          var p1 = index * 2;
          var p2 = index * 2 + 3;

          positions[ p1 ] = ( j + 1 ) * size;
          positions[ p1 + 1 ] = i * size;
          positions[ p1 + 2 ] = .1;

          positions[ p2 ]     = ( (j * 4) + 5 + k) * size;
          positions[ p2 + 1 ] = i * size;
          positions[ p2 + 2 ] = .1;


          colors[ p1 ]      = i;
          colors[ p1 + 1 ]  = 1;
          colors[ p1 + 2 ]  = 0;

          colors[ p2 ]      = i;
          colors[ p2 + 1 ]  = 2;
          colors[ p2 + 2 ]  = 0;

        }
      }

      // Spine Bundle
      for( var j = 0; j < 11; j++ ){


        var startingIndex = 21 * 32 * 3;
        var columnStartingIndex = startingIndex + ( 32 * 3 * j );
        var index = columnStartingIndex + ( i * 3 );

        var p1 = index * 2;
        var p2 = index * 2 + 3;

        positions[ p1 ] = 0 * size;
        positions[ p1 + 1 ] = i * size;
        positions[ p1 + 2 ] = .1;

        positions[ p2 ]     = (21 + j ) * size;
        positions[ p2 + 1 ] = i * size;
        positions[ p2 + 2 ] = .1;

        colors[ p1 ]      =  i;
        colors[ p1 + 1 ]  =  0;
        colors[ p1 + 2 ]  =  0;

        colors[ p2 ]      =  i;
        colors[ p2 + 1 ]  =  3;
        colors[ p2 + 2 ]  =  0;



      }

    }


    return lineGeo;

  }



