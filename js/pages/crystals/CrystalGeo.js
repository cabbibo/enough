
function CrystalGeo( height , width , numOf , extraHeight ){

  extraHeight = extraHeight || 0;

  var geometry = new THREE.BufferGeometry();

  var totalNum = (numOf+1) * 6 * 6 ;
 
  var aPos  = new THREE.BufferAttribute(new Float32Array( totalNum * 3 ), 3);
  var aNorm = new THREE.BufferAttribute(new Float32Array( totalNum * 3 ), 3);
  var aUV   = new THREE.BufferAttribute(new Float32Array( totalNum * 2 ), 2);
  var aID   = new THREE.BufferAttribute(new Float32Array( totalNum * 1 ), 1);
  var aEdge = new THREE.BufferAttribute(new Float32Array( totalNum * 1 ), 1);
 
  geometry.addAttribute( 'position', aNorm ); 
  geometry.addAttribute( 'normal', aPos );
  geometry.addAttribute( 'uv', aUV );
  geometry.addAttribute( 'id', aID );
  geometry.addAttribute( 'edge', aEdge );

  var positions = geometry.getAttribute( 'position' ).array;
  var normals   = geometry.getAttribute( 'normal' ).array;
  var uvs       = geometry.getAttribute( 'uv' ).array;
  var ids       = geometry.getAttribute( 'id' ).array;
  var edges     = geometry.getAttribute( 'edge' ).array;

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

    var a_p = [ p1 , p2 , p3 ];
  
  
    var uv1 = new THREE.Vector2();
    var uv2 = new THREE.Vector2();
    var uv3 = new THREE.Vector2();

    var a_uv = [ uv1 , uv2 , uv3 ];

    var a_e = [ 0 , 0 , 0 ];

    for( var j = 0; j < 6; j++ ){

      
      var id =   i/(numOf+1); 
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


      var t = (( j + 0 )  / 6) * Math.PI * 10
      var uvX1 = Math.abs( Math.cos( t ) );
      
      var t = (( j + 1 )  / 6) * Math.PI * 10
      var uvX2 = Math.abs( Math.cos( t ) );

      var t = (( j + .5 )  / 6) * Math.PI * 10
      var uvXC = Math.abs( Math.cos( t ) );

     // var uvX1 = (( j+ 0) %6)/6;
     // var uvX2 = (( j+ 1) %6)/6;
     //  var uvXC = (( j+ .5) %6)/6;
       

      //Bottom
      
      p1.set( fPosX1   ,  fPosY1  , h1 );
      p2.set( fPosX2   ,  fPosY2  , h1 );
      p3.set( posXY[0] , posXY[1] , h1 );

     
      var x1 = (( j + 1 ) % 6 / 6)

      uv1.set( uvX1 , 0 );
      uv2.set( uvX2 , 0 );
      uv3.set( uvXC , 0 );

      a_e = [ 1 , 1 , 0 ];

      assignAttributes( finalIndex , a_p , a_uv , a_e , id);


      // Middle

      p1.set( fPosX1 ,  fPosY1  , h1 );
      p2.set( fPosX2 ,  fPosY2  , h2 );
      p3.set( fPosX2 ,  fPosY2  , h1 );
     
      uv1.set( uvX1 , 0  );
      uv2.set( uvX2 , .9 );
      uv3.set( uvX2 , 0  );

      a_e = [ 1 , 1 , 1 ]

      assignAttributes( finalIndex + 9 , a_p , a_uv , a_e , id);

      p1.set( fPosX1   ,  fPosY1  , h2 );
      p2.set( fPosX2   ,  fPosY2  , h2 );
      p3.set( fPosX1   ,  fPosY1  , h1 );

      uv1.set( uvX1 , .9 );
      uv2.set( uvX2 , .9 );
      uv3.set( uvX1 , 0  );

      a_e = [ 1 , 1 , 1 ]

      assignAttributes( finalIndex + 18 , a_p , a_uv , a_e , id );




      // Top
      //
      p1.set( fPosX2   ,  fPosY2   , h2 );
      p2.set( fPosX1   ,  fPosY1   , h2 );
      p3.set( posXY[0] ,  posXY[1] , h2 - extraHeight );

      uv1.set( uvX2 , .9 );
      uv2.set( uvX1 , .9 );
      uv3.set( uvXC , 1  );

      a_e = [ 1 , 1 , 0 ]


      assignAttributes( finalIndex + 27 , a_p , a_uv , a_e , id );


    }


    function assignAttributes( index , a_p , a_uv , a_e , id ){

      var indexID = index / 3;

      ids[ indexID + 0 ] = id;
      ids[ indexID + 1 ] = id;
      ids[ indexID + 2 ] = id;
      
      edges[ indexID + 0 ] = a_e[0];
      edges[ indexID + 1 ] = a_e[1];
      edges[ indexID + 2 ] = a_e[2];

      var indexUV = ( index / 3 ) * 2;

      uvs[ indexUV + 0 ] = a_uv[0].x;
      uvs[ indexUV + 1 ] = a_uv[0].y;
      
      uvs[ indexUV + 2 ] = a_uv[1].x;
      uvs[ indexUV + 3 ] = a_uv[1].y;
      
      uvs[ indexUV + 4 ] = a_uv[2].x;
      uvs[ indexUV + 5 ] = a_uv[2].y;


      //ids[ indexID + 0 ] = Math.random();
      //ids[ indexID + 1 ] = Math.random();
      //ids[ indexID + 2 ] = Math.random();

      positions[ index + 0  ] = a_p[0].x  
      positions[ index + 1  ] = a_p[0].y 
      positions[ index + 2  ] = a_p[0].z 
      
      positions[ index + 3  ] = a_p[1].x 
      positions[ index + 4  ] = a_p[1].y 
      positions[ index + 5  ] = a_p[1].z 

      positions[ index + 6  ] = a_p[2].x 
      positions[ index + 7  ] = a_p[2].y 
      positions[ index + 8  ] = a_p[2].z 


      a_p[1].sub( a_p[0] );
      a_p[2].sub( a_p[0] );

      a_p[0].crossVectors( a_p[1] , a_p[2] );
      a_p[0].normalize();


      //console.log( p2 );

      normals[ index + 0  ] = a_p[0].x; 
      normals[ index + 1  ] = a_p[0].y;
      normals[ index + 2  ] = a_p[0].z;
      
      normals[ index + 3  ] = a_p[0].x;
      normals[ index + 4  ] = a_p[0].y;
      normals[ index + 5  ] = a_p[0].z;

      normals[ index + 6  ] = a_p[0].x;
      normals[ index + 7  ] = a_p[0].y; 
      normals[ index + 8  ] = a_p[0].z; 

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
