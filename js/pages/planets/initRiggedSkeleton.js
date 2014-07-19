  
function initRiggedSkeleton(mesh){
  
  
  riggedSkeleton = new RiggedSkeleton( controller , {

    movementSize: 1000,
    handSize: 100
    
  });

/*  var mesh = new THREE.Mesh(
    new THREE.BoxGeometry( 30 , 30  , 100 ),
    new THREE.MeshNormalMaterial({color:0xcc9999})
  );*/

  riggedSkeleton.addScaledJointMesh( mesh , 'metacarpal' );
  riggedSkeleton.addScaledJointMesh( mesh , 'distal' );
  riggedSkeleton.addScaledJointMesh( mesh , 'intermediate' );
  riggedSkeleton.addScaledJointMesh( mesh , 'proximal' );

  riggedSkeleton.addToScene( scene );

   riggedSkeleton1 = new RiggedSkeleton( controller , {

    movementSize: 1000,
    handSize: 100
    
  });

 /* var mesh = new THREE.Mesh(
    new THREE.BoxGeometry( 30 , 30  , 100 ),
    new THREE.MeshBasicMaterial({color:0xcc9999})
  );*/

  riggedSkeleton1.addScaledJointMesh( mesh , 'metacarpal' );
  riggedSkeleton1.addScaledJointMesh( mesh , 'distal' );
  riggedSkeleton1.addScaledJointMesh( mesh , 'intermediate' );
  riggedSkeleton1.addScaledJointMesh( mesh , 'proximal' );

  riggedSkeleton1.addToScene( scene );




}
