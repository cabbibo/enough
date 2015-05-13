function LightRays( start , end , spread , numOf){

  var numOf = numOf || 39;

  var floor = -400;
  var width = 100;
  var totalVerts = numOf * 3 * 2;
  var pos = new Float32Array( numOf * 3 * 2 * 3 );
  var uv = new Float32Array( numOf * 3 * 2 * 2 );

  var startingPoint = start.clone();
  var centerPos = new THREE.Vector3(100 , floor , 0);

  for( var i = 0; i < numOf; i++ ){

    var pos2 = new THREE.Vector3();

    pos2.x = (Math.random() - .5 ) * 800;
    pos2.z = (Math.random() - .5 ) * 150;
    pos2.y = floor;

    dir = pos2.clone();
    dir.sub( startingPoint );

    up = pos2.clone();
    up.sub( centerPos );

    
   // var upVector = new THREE.Vector3( 0 , 0 ,1);

    var upVectorProj = up.dot( dir );
    var upVectorPara = dir.clone().multiplyScalar( upVectorProj );
    var upVectorPerp = up.clone().sub( upVectorPara );

    var basisX = upVectorPerp.normalize();
    var basisY = dir.clone().cross( basisX );
   

    var point1 = startingPoint;
    var point2 = startingPoint;

    var point3 = pos2.clone().add( basisY.multiplyScalar(  width));
    var point4 = pos2.clone().add( basisY.multiplyScalar( -width));  

    var index = i * 3 * 2;

    // Tri 1
    pos[ index * 3 + 0  ] = point1.x;
    pos[ index * 3 + 1  ] = point1.y;
    pos[ index * 3 + 2  ] = point1.z;

    pos[ index * 3 + 3  ] = point4.x;
    pos[ index * 3 + 4  ] = point4.y;
    pos[ index * 3 + 5  ] = point4.z;

    pos[ index * 3 + 6  ] = point2.x;
    pos[ index * 3 + 7  ] = point2.y;
    pos[ index * 3 + 8  ] = point2.z;


    // Tri2
    pos[ index * 3 + 9  ] = point4.x;
    pos[ index * 3 + 10 ] = point4.y;
    pos[ index * 3 + 11 ] = point4.z;

    pos[ index * 3 + 12 ] = point1.x;
    pos[ index * 3 + 13 ] = point1.y;
    pos[ index * 3 + 14 ] = point1.z;

    pos[ index * 3 + 15 ] = point3.x;
    pos[ index * 3 + 16 ] = point3.y;
    pos[ index * 3 + 17 ] = point3.z;

    uv[ index * 2 + 0 ] = i / numOf;
    uv[ index * 2 + 1 ] = 0;
    uv[ index * 2 + 2 ] = i / numOf;
    uv[ index * 2 + 3 ] = 1;


  }
 


  
  
  var geo = new THREE.BufferGeometry();

  var posA = new THREE.BufferAttribute( pos , 3 );
  var uvA = new THREE.BufferAttribute( uv , 2 );
  //var normA = new THREE.BufferAttribute( norm , 3 );

  geo.addAttribute( 'position' , posA );
  //geo.addAttribute( 'uv' , uvA );
  //geo.addAttribute( 'normal' , normA );

  var mat = new THREE.MeshBasicMaterial({
    color:0xffddaa,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite:false,
    opacity: .06,
    map: G.t_audio.value,
    side: THREE.DoubleSide
  });


  var mesh = new THREE.Mesh( geo , mat );
  return mesh;
}
