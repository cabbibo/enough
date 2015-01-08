function Mountains( params ){

  var p = _.defaults( params || {} , {

    radius: 0,


    randHeight: 0.0,//5.2,
    randRadius: 0.0,//.4,
    randWidth: 0.0,//4.9,
    width: 300,
    height: 10,
    material: new THREE.MeshNormalMaterial(),
    numOf: 1,
    detail: 10,



  });
  var material = new THREE.MeshNormalMaterial();

  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();
  var v3 = new THREE.Vector3();
  var v4 = new THREE.Vector3();

  var c1 = new THREE.Vector3();
  var c2 = new THREE.Vector3();

  var normal = new THREE.Vector3();

  var geo = new THREE.BufferGeometry();

  var size = p.numOf * p.detail * p.detail * 3 * 2;

  var pos  = new THREE.BufferAttribute( new Float32Array( size * 3 ) , 3 );
  var norm = new THREE.BufferAttribute( new Float32Array( size * 3 ) , 3 );
  var uv   = new THREE.BufferAttribute( new Float32Array( size * 2 ) , 2 );

  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'normal' , norm );
  geo.addAttribute( 'uv' , uv );
  
  var positions = pos.array;
  var normals   = norm.array;
  var uvs       = uv.array;

 
  var center = p.detail/2;// p.detail / 2;
  for( var i = 0; i < p.numOf; i++ ){

    var mountainIndex = i * p.detail * p.detail * 3 * 2;
    var mountainTheta = ( i / p.numOf ) * 2 * Math.PI;

    var seed = Math.random();
    var mRadius = 0;//p.radius + p.radius * p.randRadius * seed;
    var mHeight = p.height + p.height * p.randHeight * seed ;
    var mWidth  = p.width + p.width * p.randWidth * seed;

    var x = mRadius * Math.cos( mountainTheta );
    var y = 0;
    var z = mRadius * Math.sin( mountainTheta );

    var mountainPosition = [ x , 0 , z ];

    var mt = mountainTheta;
    var mountainBasis = [
      [Math.cos( mt ), Math.sin( mt )],
      [-Math.sin( mt ) , Math.cos( mt )]
    ];

    var mb = mountainBasis;
    var mp = mountainPosition;

    for( var j = 0; j < p.detail; j++ ){
      for( var k = 0; k < p.detail; k++ ){

        var index = mountainIndex + ( j * p.detail + k ) * 3 * 2;
        var fIndex = index * 3;
        var uvIndex = index * 2;

        // center
        var jC = 1 - ((Math.abs( j-center ) * 2 ) / p.detail);
        var kC = 1 - ((Math.abs( k-center )* 2   ) / p.detail);

        // center up
        var jU = 1 - ((Math.abs( (j+1)-center ) * 2 ) / p.detail)
        var kU = 1 - ((Math.abs( (k+1)-center )* 2  ) / p.detail);

        var JC = 1 - (j-center*2)/p.detail;
        var KC = 1 - (k-center*2)/p.detail;

        var JU = 1 - ((j+1)-center*2)/p.detail;
        var KU = 1 - ((k+1)-center*2)/p.detail;

 
        var x = mp[0] + mWidth * ( JC * mb[0][0] + KC * mb[1][0] );
        var z = mp[2] + mWidth * ( JC * mb[0][1] + KC * mb[1][1] );

        var y = getHeight( jC , kC , mHeight );

        v1.set( x , y , z );

        var x = mp[0] + mWidth * ( JC * mb[0][0] + KU * mb[1][0] );
        var z = mp[2] + mWidth * ( JC * mb[0][1] + KU * mb[1][1] );
       
        var y = getHeight( jC , kU , mHeight );

        v2.set( x , y , z );

        var x = mp[0] + mWidth * ( JU * mb[0][0] + KC * mb[1][0] );
        var z = mp[2] + mWidth * ( JU * mb[0][1] + KC * mb[1][1] );

        var y = getHeight( jU , kC , mHeight );

        v3.set( x , y , z );

        var x = mp[0] + mWidth * ( JU * mb[0][0] + KU * mb[1][0] );
        var z = mp[2] + mWidth * ( JU * mb[0][1] + KU * mb[1][1] );

        var y = getHeight( jU , kU , mHeight );

        v4.set( x , y , z )


          
        positions[ fIndex + 0 ]   = v1.x-p.width*1.5;
        positions[ fIndex + 1 ]   = v1.y-p.height;
        positions[ fIndex + 2 ]   = v1.z-p.width*1.5;

        positions[ fIndex + 3 ]   = v2.x-p.width*1.5;
        positions[ fIndex + 4 ]   = v2.y-p.height;
        positions[ fIndex + 5 ]   = v2.z-p.width*1.5;
        
        positions[ fIndex + 6 ]   = v3.x-p.width*1.5;
        positions[ fIndex + 7 ]   = v3.y-p.height;
        positions[ fIndex + 8 ]   = v3.z-p.width*1.5;

        positions[ fIndex + 9 ]   = v3.x-p.width*1.5;
        positions[ fIndex + 10 ]  = v3.y-p.height;
        positions[ fIndex + 11 ]  = v3.z-p.width*1.5;

        positions[ fIndex + 12 ]  = v2.x-p.width*1.5;
        positions[ fIndex + 13 ]  = v2.y-p.height;
        positions[ fIndex + 14 ]  = v2.z-p.width*1.5;

        positions[ fIndex + 15 ]  = v4.x-p.width*1.5;
        positions[ fIndex + 16 ]  = v4.y-p.height;
        positions[ fIndex + 17 ]  = v4.z-p.width*1.5;

        c1.copy( v2 ).sub( v1 ).normalize();
        c2.copy( v3 ).sub( v1 ).normalize();
        normal.crossVectors( c1 , c2 );

        normals[ fIndex + 0 ] = normal.x;
        normals[ fIndex + 1 ] = normal.y;
        normals[ fIndex + 2 ] = normal.z;

        normals[ fIndex + 3 ] = normal.x;
        normals[ fIndex + 4 ] = normal.y;
        normals[ fIndex + 5 ] = normal.z;

        normals[ fIndex + 6 ] = normal.x;
        normals[ fIndex + 7 ] = normal.y;
        normals[ fIndex + 8 ] = normal.z;
        
        c1.copy( v3 ).sub( v4 ).normalize();
        c2.copy( v2 ).sub( v4 ).normalize();
        normal.crossVectors( c1 , c2 );

        normals[ fIndex + 9 ] = normal.x;
        normals[ fIndex + 10 ] = normal.y;
        normals[ fIndex + 11 ] = normal.z;

        normals[ fIndex + 12 ] = normal.x;
        normals[ fIndex + 13 ] = normal.y;
        normals[ fIndex + 14 ] = normal.z;

        normals[ fIndex + 15 ] = normal.x;
        normals[ fIndex + 16 ] = normal.y;
        normals[ fIndex + 17 ] = normal.z;


        uvs[ uvIndex + 0 ] = j / p.detail;
        uvs[ uvIndex + 1 ] = k / p.detail;
        
        uvs[ uvIndex + 2 ] = j / p.detail;
        uvs[ uvIndex + 3 ] = (k+1) / p.detail;

        uvs[ uvIndex + 4 ] = (j+1) / p.detail;
        uvs[ uvIndex + 5 ] = k / p.detail;

        uvs[ uvIndex + 6 ] = (j+1) / p.detail;
        uvs[ uvIndex + 7 ] = k / p.detail;

        uvs[ uvIndex + 8 ] = j / p.detail;
        uvs[ uvIndex + 9 ] = (k+1) / p.detail;

        uvs[ uvIndex + 10 ] = (j+1) / p.detail;
        uvs[ uvIndex + 11 ] = (k+1) / p.detail;

        
        /*uvs[ uvIndex + 0 ] = Math.random();
        uvs[ uvIndex + 1 ] = Math.random();
        uvs[ uvIndex + 2 ] = Math.random();
        uvs[ uvIndex + 3 ] = Math.random();
        uvs[ uvIndex + 4 ] = Math.random();
        uvs[ uvIndex + 5 ] = Math.random();
        uvs[ uvIndex + 6 ] = Math.random();
        uvs[ uvIndex + 7 ] = Math.random();
        uvs[ uvIndex + 8 ] = Math.random();
        uvs[ uvIndex + 9 ] = Math.random();
        uvs[ uvIndex + 10 ] = Math.random();
        uvs[ uvIndex + 11 ] = Math.random();*/



       // asbasfbasfbasbasgads ()13234f12[
        //console.log( fIndex );
      
      }
    }

  }


  var mesh = new THREE.Mesh( 
    geo,
    p.material
  );

  mesh.position.x -= p.width


  return mesh;

  function getHeight( x , y , h , seed ){

    var seed = seed || Math.sin( h ) 
   
    var s = Math.sin( x * 20. * h )+seed;
    var t = Math.sin( s * 20. );

    var a = Math.sin( y * t * 20. )+seed;
    var b = Math.sin( a * 20. );

    var q = Math.sin( b * x );
    var w = Math.sin( t * y );

    var f = Math.sin( q + w );

    var fH = Math.max( -10. , (x + y)-1 )
    return (fH * h) + h * .3 * f;

  }


}


