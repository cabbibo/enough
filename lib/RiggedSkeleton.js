 function RiggedSkeleton( controller , camera , params ){

    var params = params || {};


    // How large the hand is
    this.handSize     = params.handSize     || 1000;
    
    // How far the hand can move
    this.movementSize = params.movementSize || 100;

    // If the hand is place based on camera, or 0
    this.absolute     = params.absolute     || false;
    

    this.camera       = camera;
    this.controller   = controller;
  
    // A flat array of all bones
    this.bones = [];

    this.baseMatrixLeft = new THREE.Matrix4(
       0 ,  0 , 1 , 0,
       0 , -1 , 0 , 0,
      -1 ,  0 , 0 , 0, 
       0 ,  0 , 0 , 1
    );

    this.baseMatrixRight = new THREE.Matrix4(
       0 ,  0 , -1 , 0,
       0 , -1 ,  0 , 0,
      -1 ,  0 ,  0 , 0, 
       0 ,  0 ,  0 , 1
    );

    this.tmpMatrix    = new THREE.Matrix4();
    this.tmpQuat      = new THREE.Quaternion();

    this.fingerTypes  = [ 
      
      "thumb"   , 
      "index"   , 
      "middle"  , 
      "ring"    , 
      "pinky" 
    
    ];


    this.hand         = new THREE.Object3D();
    this.fingers      = this.createFingers();

    this.scaledMeshes       = [];
   

  }


  /*
  
     API

  */

  RiggedSkeleton.prototype.addToScene = function( scene ){

    scene.add( this.hand );

  }

  RiggedSkeleton.prototype.removeFromScene = function( scene ){

    scene.remove( this.hand );

  }

  RiggedSkeleton.prototype.addHandMesh = function( mesh ){

    this.hand.add( mesh.clone() );

  }


  RiggedSkeleton.prototype.addMeshToAll = function( mesh ){

    for( var i = 0; i < this.fingers.length; i++ ){

      var finger = this.fingers[i];

      this.addFingerMesh( mesh , finger.type );

    }

  }

  RiggedSkeleton.prototype.addFingerMesh = function( mesh , fingerType ){

    for( var i = 0; i < this.fingers.length; i++ ){

      var finger = this.fingers[i];

      if( finger.type === fingerType ){

        if( fingerType !== 'thumb' ){
          finger.metacarpal.add(    mesh.clone() );
        }
        finger.proximal.add(      mesh.clone() );
        finger.intermediate.add(  mesh.clone() );
        finger.distal.add(        mesh.clone() );
        finger.tip.add(           mesh.clone() );
      
      }

    }

  }


  /*

     Add a mesh to a specific joint type, 
    if a finger is also specified, than it will be added to that finger

  */
  RiggedSkeleton.prototype.addJointMesh = function( mesh , jointType , fingerType ){

    for( var i = 0; i < this.fingers.length; i++ ){

      var finger = this.fingers[i];

      if( fingerType ){

        if( fingerType === finger.type ){

          finger[jointType].add( mesh.clone() );

        }

      }else{

        finger[jointType].add( mesh.clone() );

      }

    }

  }

  /*

     A scaled mesh is one that will be updated every frame, so that its 'length' matches
     the 'length' of the finger joint, as compared to the handSize

  */
  RiggedSkeleton.prototype.addScaledMesh = function( object , params ){

    var params      = params || {};
    var fingerType  = params.fingerType   || 'middle';
    var jointType   = params.jointType    || 'distal';
    var direction   = params.direction    || 'z' ;
    
    var centered   = true;
    if( params.centered !== undefined ){
      centered = params.centered;
    }
    
    var length      = params.length;

    if( !length ){

      length = this.getLengthOfObject( object , direction );

    }

    if( direction === 'x' ){

      object.rotation.y = Math.PI / 2;

    }else if( direction === 'y' ){

      object.rotation.x = -Math.PI / 2;

    }


    newObject         = object.clone();

    newObject.jointType   = jointType;
    newObject.fingerType  = fingerType;
    newObject.length      = length;
    newObject.direction   = direction; 
    newObject.centered    = centered;

    for( var i = 0; i < this.fingers.length; i++ ){

      if( this.fingers[i].type === fingerType ){

        this.fingers[i][ jointType ].add( newObject );
        this.fingers[i][ jointType ].scaledMeshes.push( newObject );

      }


    }

  }


  RiggedSkeleton.prototype.addScaledFingerMesh = function( object , fingerType , params ){

    var params = params || {};

    params.fingerType = fingerType;


    if( fingerType  !== 'thumb' ){
    
      params.jointType = 'metacarpal'
      this.addScaledMesh( object , params );

    }

    params.jointType = 'proximal'
    this.addScaledMesh( object , params );

    params.jointType = 'intermediate'
    this.addScaledMesh( object , params );

    params.jointType = 'distal'
    this.addScaledMesh( object , params );


  }


  RiggedSkeleton.prototype.addScaledJointMesh = function( object , jointType , params ){

    var params = params || {};

    params.jointType = jointType;

    for( var i = 0; i < this.fingerTypes.length; i++ ){

      var fingerType = this.fingerTypes[i];

      params.fingerType = fingerType;

      if( !( fingerType === 'thumb' && jointType === 'metacarpal' ) ){
      
        this.addScaledMesh( object , params );

      }


    }

  }

 
  RiggedSkeleton.prototype.addScaledMeshToAll = function( object , params ){

    var params = params || {};


    for( var i = 0; i < this.fingerTypes.length; i++ ){

      this.addScaledFingerMesh( object , this.fingerTypes[i] , params );

    }


  }



  /*
  
     Initialization Functions

  */

  RiggedSkeleton.prototype.createFingers = function(){


    var fingers = [];


    for( var i = 0; i < 5; i++ ){

      var type    = this.fingerTypes[ i ];
      var finger  = this.createFinger( type );

      fingers.push( finger );

    }

    return fingers;


  }

  /*

     Creates a finger by recursively placing 
     each joint on the one above it

  */
  RiggedSkeleton.prototype.createFinger = function( type ){

    var metacarpal    = new THREE.Object3D();
    var proximal      = new THREE.Object3D();
    var intermediate  = new THREE.Object3D();
    var distal        = new THREE.Object3D();
    var tip           = new THREE.Object3D();

    metacarpal.scaledMeshes   = [];
    proximal.scaledMeshes     = [];
    intermediate.scaledMeshes = [];
    distal.scaledMeshes       = [];
    tip.scaledMeshes          = [];

    // push all the bones!
    this.bones.push(  metacarpal    );
    this.bones.push(  proximal      );
    this.bones.push(  intermediate  );
    this.bones.push(  distal        );
    this.bones.push(  tip           );

    this.hand.add(    metacarpal    );
    metacarpal.add(   proximal      );
    proximal.add(     intermediate  );
    intermediate.add( distal        );
    distal.add(       tip           );

    var finger = {

      metacarpal    : metacarpal,
      proximal      : proximal,
      intermediate  : intermediate,
      distal        : distal,
      tip           : tip,
     
      type          : type

    }

    return finger;

  }


  /*
  

     UPDATE


  */

  RiggedSkeleton.prototype.updateFingerRig = function( frameHand , frameFinger , ourFinger ){

    // Setting references to all of the leap.js bones 
    var m = frameFinger.bones[0]; // metacarpal
    var p = frameFinger.bones[1]; // proximal
    var i = frameFinger.bones[2]; // intermediate
    var d = frameFinger.bones[3]; // distal

    // To position the metal carpal, 
    // we compare its position to the palm position
    // and apply the palms rotation to that position
    //

     // Saving our hand matrix for easy access
    var hMatrix = this.hand.matrix;

    var metaPos = this.threeDif( frameHand.palmPosition , m.prevJoint );
    metaPos.multiplyScalar( this.scaledSize );
    
    ourFinger.metacarpal.position = metaPos;

    var quat = new THREE.Quaternion();
    quat.setFromRotationMatrix( hMatrix.clone().transpose() );

    ourFinger.metacarpal.position.applyQuaternion( quat ); 



    // The remaining fingers can just be placed using z

    ourFinger.metacarpal.length   = m.length * this.scaledSize;
    ourFinger.proximal.length     = p.length * this.scaledSize;
    ourFinger.intermediate.length = i.length * this.scaledSize;
    ourFinger.distal.length       = d.length * this.scaledSize;
    ourFinger.tip.length          = 0;//t.length * this.scaledSize;

    ourFinger.proximal.position.z     = - ourFinger.metacarpal.length;
    ourFinger.intermediate.position.z = - ourFinger.proximal.length;
    ourFinger.distal.position.z       = - ourFinger.intermediate.length;
    ourFinger.tip.position.z          = - ourFinger.distal.length;

    this.updateScaledMeshes( ourFinger.metacarpal   );
    this.updateScaledMeshes( ourFinger.proximal     );
    this.updateScaledMeshes( ourFinger.intermediate );
    this.updateScaledMeshes( ourFinger.distal       );
    this.updateScaledMeshes( ourFinger.tip          );

    /*
     
      To rotate each finger properly, 
     
      we first get the proper matrix from the basis
      that leap.js provides,
    
      than get a relative rotation by comparing 
      that with the previous rotation

    */

    // METACARPAL ROTATION
    
    var mMatrix = this.matrixFromBasis( m.basis , frameHand.type );

    var mRelRot = new THREE.Matrix4();
    mRelRot.multiplyMatrices( hMatrix.clone().transpose() , mMatrix );
    
    ourFinger.metacarpal.rotation.setFromRotationMatrix(mRelRot);


    // PROXIMAL ROTATION
    
    var pMatrix = this.matrixFromBasis( p.basis , frameHand.type );

    var pRelRot = new THREE.Matrix4();
    pRelRot.multiplyMatrices( mMatrix.clone().transpose() , pMatrix );
    
    ourFinger.proximal.rotation.setFromRotationMatrix(pRelRot);


    // INTERMEDIATE ROTATION
    
    var iMatrix = this.matrixFromBasis( i.basis , frameHand.type );

    var iRelRot = new THREE.Matrix4();
    iRelRot.multiplyMatrices( pMatrix.clone().transpose() , iMatrix );
    
    ourFinger.intermediate.rotation.setFromRotationMatrix(iRelRot);


    // DISTAL ROTATION
    
    var dMatrix = this.matrixFromBasis( d.basis , frameHand.type );

    var dRelRot = new THREE.Matrix4();
    dRelRot.multiplyMatrices( iMatrix.clone().transpose() , dMatrix );
    
    ourFinger.distal.rotation.setFromRotationMatrix(dRelRot);

    
    // NOTE: the tip should not be rotated, or it will lead to 
    // streching in the mesh! ( or other general weirdness );
  
  }

  RiggedSkeleton.prototype.update = function( type ){

    this.frame = this.controller.frame();

    var hand;

    if( !type ){

      type = 0;

    }

    if( typeof type == 'string' ){

      if( this.frame.hands[1] ){

        if( this.frame.hands[1].type === type ){
      
          hand = this.frame.hands[1];
  
        }

      }

      // If there are two of the same type of hand, override...
      // sry ;)
      if( this.frame.hands[0] ){

        if( this.frame.hands[0].type === type ){
      
          hand = this.frame.hands[0];
  
        }

      }

    }else{

      if( this.frame.hands[type] ){
        hand = this.frame.hands[type];
      }


    }


    if( hand ){


      
      var pPalm           = hand.palmPosition;
      this.leapToCamera( this.hand.position , this.camera, pPalm , this.movementSize );

      //console.log( this.frame.hands[0]);

      // TODO: is this the best way to scale?
      /*var frameHand       = hand;
      var frameFingers    = this.orderFingers( frameHand );
 
      var pPalm           = frameHand.palmPosition;
     
      if( this.absolute ){
     
        this.hand.position = this.leapToScene( pPalm , this.movementSize );

      }else{

        this.leapToCamera( this.hand.position , this.camera, pPalm , this.movementSize );

        this.cameraInverse = new THREE.Matrix4().extractRotation( this.camera.matrixWorldInverse);

        this.hand.matrix.multiply( this.cameraInverse );


      }

      for( var i = 0; i < this.fingers.length; i++ ){

        var frameFinger = frameFingers[i];
        var finger      = this.fingers[i];

        if( frameFinger.type === 3 ){

          this.getHandLength(frameFinger);

        }

        // Updates each finger to have the proper rotations
        this.updateFingerRig( frameHand ,  frameFinger , finger );

      }*/

    }else{

      this.hand.position.copy( G.camera.position );

    }

  }



  /*
   
     UTILS

  */
  RiggedSkeleton.prototype.getHandLength = function( finger ){

    this.handLength = 0;
    for( var i = 0; i < finger.bones.length; i++ ){

      this.handLength += finger.bones[i].length;

    }

    this.scaledSize = this.handSize / this.handLength;

  }

// need to know if basis is left or right handed
  RiggedSkeleton.prototype.matrixFromBasis = function( b , type ){
   
    var m = new THREE.Matrix4()
      
    if( type == 'left'){
      
      m.set(

        -b[0][0] , b[1][0] , b[2][0] , 0 ,
        -b[0][1] , b[1][1] , b[2][1] , 0 ,
        -b[0][2] , b[1][2] , b[2][2] , 0 ,
              0  ,      0  ,      0  , 1

      );

    }else{
      
      m.set(

        b[0][0] , b[1][0] , b[2][0] , 0 ,
        b[0][1] , b[1][1] , b[2][1] , 0 ,
        b[0][2] , b[1][2] , b[2][2] , 0 ,
             0  ,      0  ,      0  , 1

      );

    }

    return m;

  }

 



  // Gets a difference between two leap vectors, in three
  
  RiggedSkeleton.prototype.threeDif = function( pos1 , pos2 ){

    var p1 = this.leapToScene( pos1 );
    var p2 = this.leapToScene( pos2 );

    return p2.sub( p1 );

  }



  // Converts from leap position to scene position
  
  RiggedSkeleton.prototype.leapToScene = function( position , size ){

    var p = this.frame.interactionBox.normalizePoint( position );

    var size = size || this.frame.interactionBox.size[0];

    p[0] -= .5;
    p[1] -= .5;
    p[2] -= .5;

    p[0] *= size;
    p[1] *= size;
    p[2] *= size;

    var pos = new THREE.Vector3().fromArray( p );

    return pos;

  }

  RiggedSkeleton.prototype.leapToCamera = function( vector , camera , position , size ){

    var v = this.leapToScene( position , size );

    v.z -= size;
    v.applyMatrix4( camera.matrix );

    vector.copy( v );

    return v;

  }

  // Makes sure our fingers are properly ordered
  
  RiggedSkeleton.prototype.orderFingers = function( hand ){

    var fingers = hand.fingers.sort( function( f1 , f2 ){ 
      return f1.type < f2.type ? -1 : 1 
    });

    return fingers

  }

  // When we pass in a scaled mesh, attempts to compute the bounding box
  // from: http://stackoverflow.com/questions/15492857/any-way-to-get-a-bounding-box-from-a-three-js-object3d
  RiggedSkeleton.prototype.computeBoundingBox = function( object ){
    
    
    if (object instanceof THREE.Object3D){
     
      var minX = 0;
      var minY = 0;
      var minZ = 0;
      var maxX = 0;
      var maxY = 0;
      var maxZ = 0;
      
      object.traverse (function (mesh){
        
        if (mesh instanceof THREE.Mesh){
            
            mesh.geometry.computeBoundingBox();
            var bBox = mesh.geometry.boundingBox;

            var pos = mesh.position;
            // compute overall bbox
            minX = Math.min( minX , bBox.min.x + pos.x );
            minY = Math.min( minY , bBox.min.y + pos.y );
            minZ = Math.min( minZ , bBox.min.z + pos.z );
            maxX = Math.max( maxX , bBox.max.x + pos.x );
            maxY = Math.max( maxY , bBox.max.y + pos.y );
            maxZ = Math.max( maxZ , bBox.max.z + pos.z );
        }
      
      });

      var bBox_min = new THREE.Vector3( minX , minY , minZ );
      var bBox_max = new THREE.Vector3( maxX , maxY , maxZ );
      var bBox_new = new THREE.Box3( bBox_min , bBox_max );
     
      return bBox_new;
    
    }

  }


  RiggedSkeleton.prototype.getLengthOfObject = function( object , direction ){

    var boundingBox = this.computeBoundingBox( object );

    var length = boundingBox.max[direction] - boundingBox.min[direction] 

    return Math.abs( length );


  }

  RiggedSkeleton.prototype.updateScaledMeshes = function( joint ){

    for( var i = 0; i < joint.scaledMeshes.length; i++ ){

      var mesh = joint.scaledMeshes[i];

      var newScale  = joint.length / mesh.length;

      //console.log( newScale );

      mesh.scale.x = newScale;
      mesh.scale.y = newScale;
      mesh.scale.z = newScale;

      if( mesh.centered  ){
      
        mesh.position.z = - ( mesh.length * newScale )  /  2;
      
      }else{
      

      }

    }

  }



  // TODO
  RiggedSkeleton.prototype.exportToSkinnedMesh = function( skinnedMesh ){


  }

