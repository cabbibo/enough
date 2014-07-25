
function CrystalGeo( height , width , numOf ){
 
  var geometry = new THREE.BufferGeometry();

  var totalNum = (numOf+1) * 6 * 6 * 3 ;
 
  var aPos  = new THREE.BufferAttribute(new Float32Array( totalNum ), 3);
  var aNorm = new THREE.BufferAttribute(new Float32Array( totalNum ), 3);
 
  geometry.addAttribute( 'position', aNorm ); 
  geometry.addAttribute( 'normal', aPos );

  var positions = geometry.getAttribute( 'position' ).array;
  var normals   = geometry.getAttribute( 'normal' ).array;

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
    
  
    //  Column

    for( var j = 0; j < 6; j++ ){

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
      positions[ finalIndex + 0  ] = fPosX1;
      positions[ finalIndex + 1  ] = fPosY1;
      positions[ finalIndex + 2  ] = h1;
      
      positions[ finalIndex + 3  ] = fPosX2;
      positions[ finalIndex + 4  ] = fPosY2;
      positions[ finalIndex + 5  ] = h1;

      positions[ finalIndex + 6  ] = posXY[0];
      positions[ finalIndex + 7  ] = posXY[1];
      positions[ finalIndex + 8  ] = h1;



      // Middle
      positions[ finalIndex + 9  ] = fPosX1;
      positions[ finalIndex + 10 ] = fPosY1;
      positions[ finalIndex + 11 ] = h1;

      positions[ finalIndex + 12 ] = fPosX1;
      positions[ finalIndex + 13 ] = fPosY1;
      positions[ finalIndex + 14 ] = h2;
      
      positions[ finalIndex + 15 ] = fPosX2;
      positions[ finalIndex + 16 ] = fPosY2;
      positions[ finalIndex + 17 ] = h1;

      positions[ finalIndex + 18 ] = fPosX1;
      positions[ finalIndex + 19 ] = fPosY1;
      positions[ finalIndex + 20 ] = h2;
     
      positions[ finalIndex + 21 ] = fPosX2;
      positions[ finalIndex + 22 ] = fPosY2;
      positions[ finalIndex + 23 ] = h2;

      positions[ finalIndex + 24 ] = fPosX2;
      positions[ finalIndex + 25 ] = fPosY2;
      positions[ finalIndex + 26 ] = h1;



      // Top
      positions[ finalIndex + 27 ] = fPosX2;
      positions[ finalIndex + 28 ] = fPosY2;
      positions[ finalIndex + 29 ] = h2;

      positions[ finalIndex + 30 ] = fPosX1;
      positions[ finalIndex + 31 ] = fPosY1;
      positions[ finalIndex + 32 ] = h2;
      
      positions[ finalIndex + 33 ] = posXY[0];
      positions[ finalIndex + 34 ] = posXY[1];
      positions[ finalIndex + 35 ] = h2 - (height/20);



    }


  }



  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  geometry.baseData = baseArray;

  return geometry;

}


Math.toCart = function( r , t ){

  var x = r * Math.cos( t );
  var y = r * Math.sin( t );

  return [ x , y ];

}
