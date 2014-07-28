
function CrystalGeo( height , width , numOf , extraHeight ){

  extraHeight = extraHeight || 0;

  var geometry = new THREE.BufferGeometry();

  var totalNum = (numOf+1) * 6 * 6 * 3 ;
 
  var aPos  = new THREE.BufferAttribute(new Float32Array( totalNum ), 3);
  var aNorm = new THREE.BufferAttribute(new Float32Array( totalNum ), 3);
  var aID   = new THREE.BufferAttribute(new Float32Array( totalNum /3), 1);
 
  geometry.addAttribute( 'position', aNorm ); 
  geometry.addAttribute( 'normal', aPos );
  geometry.addAttribute( 'id', aID );

  var positions = geometry.getAttribute( 'position' ).array;
  var normals   = geometry.getAttribute( 'normal' ).array;
  var ids       = geometry.getAttribute( 'id' ).array;

  var directionPower = [0,0,0,0,0,0];

  
  var baseArray = [];
  
  for( var i = 0; i < numOf+1; i++ ){
   

    var posXY = [];
    var newHeight = height;
    var sqr = .7;
    if( i == 0 ){

      posXY[0] = 0;
      posXY[1] = 0;

    }else{
      
      // Figure out which direction we are placing the crystal in
      var which = Math.floor(  Math.random() * 6 );

      directionPower[which] ++;

      sqr = Math.sqrt( directionPower[which] );
      newHeight = (height * ( Math.random() * .3 +.7)) /(sqr);
    
      if( newHeight > (height * .9) ){

        newHeight = height * .9;

      }
      posXY = Math.toCart( width * sqr , (which/6) * 2 * Math.PI );
     
      var posXYExtra = Math.toCart( width / sqr, ( i / 6 ) * 2 * Math.PI );

      posXY[0] += posXYExtra[0];
      posXY[1] += posXYExtra[1];

    }
    

    
    baseArray.push( [ posXY , -newHeight ] );
    
    var z     = 0;
    
    var index = i * 6 * 12 * 3;
    

    var p1 = new THREE.Vector3();
    var p2 = new THREE.Vector3();
    var p3 = new THREE.Vector3();
  
    //  Column

    for( var j = 0; j < 6; j++ ){

      
      var id = i / (numOf + 1);
      //var newHeight = height * Math.random();

      var subPosXY1 = Math.toCart( width  / (2*sqr) , (j/6) * 2 * Math.PI );
      var subPosXY2 = Math.toCart( width / (2*sqr) , ((j+1)/6) * 2 * Math.PI );

      fPosX1 = posXY[0] + subPosXY1[0];
      fPosY1 = posXY[1] + subPosXY1[1];

      fPosX2 = posXY[0] + subPosXY2[0];
      fPosY2 = posXY[1] + subPosXY2[1];

      var finalIndex = index + j * 12 * 3;
     
      var h1 = 0;
      var h2 = -newHeight;


      //Bottom
      
      p1.set( fPosX1   ,  fPosY1  , h1 );
      p2.set( fPosX2   ,  fPosY2  , h1 );
      p3.set( posXY[0] , posXY[1] , h1 );

      assignAttributes( finalIndex , p1 , p2 , p3  , id );


      // Middle

      p1.set( fPosX1 ,  fPosY1  , h1 );
      p2.set( fPosX2 ,  fPosY2  , h2 );
      p3.set( fPosX2 ,  fPosY2  , h1 );

      assignAttributes( finalIndex + 9 , p1 , p2 , p3, id  );

      p1.set( fPosX1   ,  fPosY1  , h2 );
      p2.set( fPosX2   ,  fPosY2  , h2 );
      p3.set( fPosX1   ,  fPosY1  , h1 );

      assignAttributes( finalIndex + 18 , p1 , p2 , p3, id  );




      // Top
      //
      p1.set( fPosX2   ,  fPosY2   , h2 );
      p2.set( fPosX1   ,  fPosY1   , h2 );
      p3.set( posXY[0] ,  posXY[1] , h2 - extraHeight );

      assignAttributes( finalIndex + 27 , p1 , p2 , p3, id );


    }


    function assignAttributes( index , p1 , p2 , p3  , id ){

      var indexID = index / 3;

      ids[ indexID + 0 ] = id;
      ids[ indexID + 1 ] = id;
      ids[ indexID + 2 ] = id;
      //ids[ indexID + 0 ] = Math.random();
      //ids[ indexID + 1 ] = Math.random();
      //ids[ indexID + 2 ] = Math.random();

      positions[ index + 0  ] = p1.x  
      positions[ index + 1  ] = p1.y 
      positions[ index + 2  ] = p1.z 
      
      positions[ index + 3  ] = p2.x 
      positions[ index + 4  ] = p2.y 
      positions[ index + 5  ] = p2.z 

      positions[ index + 6  ] = p3.x 
      positions[ index + 7  ] = p3.y 
      positions[ index + 8  ] = p3.z 


      var n1 = p1.clone();
      var n2 = p2.clone();
      var n3 = p3.clone();

      var d = new THREE.Vector3();

      n2.sub( n1 );
      n3.sub( n1 );

      d.crossVectors( n2 , n3 );
      d.normalize();

      p3.sub( p2 );
      p1.sub( p2 );

      p3.normalize();
      p1.normalize();

      p3.cross( p1 );

      p3.multiplyScalar( 1 );

      //console.log( p2 );

      normals[ index + 0  ] = d.x; 
      normals[ index + 1  ] = d.y;
      normals[ index + 2  ] = d.z;
      
      normals[ index + 3  ] = d.x;
      normals[ index + 4  ] = d.y;
      normals[ index + 5  ] = d.z;

      normals[ index + 6  ] = d.x;
      normals[ index + 7  ] = d.y; 
      normals[ index + 8  ] = d.z; 

    }


  }



 /* geometry.computeFaceNormals();
  geometry.computeVertexNormals();*/

  geometry.baseData = baseArray;

  return geometry;

}


Math.toCart = function( r , t ){

  var x = r * Math.cos( t );
  var y = r * Math.sin( t );

  return [ x , y ];

}
