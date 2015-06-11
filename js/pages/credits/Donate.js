function Donate( text , location , size ){
  
  this.size = size;
  this.text = text;
  this.location = location;
  //this.ring2 = new THREE.Mesh( this.createRingGeo(1) , ringMat );

  this.percentLoaded = { type:"f" , value: 0 }
  this.time = { type:"f" , value: 0 }
  this.transparency = { type:"f" , value: 1 }
  this.loadRing = [];
  this.lightPos = { type:"v3" , value: new THREE.Vector3() }

  this.lookPosition = new THREE.Vector3();
  this.ending = false;

  var u = {
    
    time:this.time,
    stepDepth:{ type:"f" , value: 6. },
    brightness:{type:"f",value: 1 },
    oscillationSize:{ type:"f" , value: .0004 },
    noiseSize: { type:"f" , value: 3. },
    lightPos:{ type:"v3" , value:this.lookPosition },
    
    iModelMat:{ type:"m4" , value: new THREE.Matrix4() },
    percentLoaded: this.percentLoaded,
    transparency: this.transparency,

  }

  var a = {
    faceType: { type:"f" , value:null }
  }



  var ringMat = new THREE.ShaderMaterial({
    uniforms:u,
    attributes:{
      id:{type:"f", value:null},
      faceType:{type:"f", value:null},
    },
    vertexShader: loadBarShader.vsRing,
    fragmentShader: loadBarShader.fsRing,
    side: THREE.DoubleSide,
   // blending: THREE.AdditiveBlending,
    transparent: true,
  });


  this.ring = new THREE.Mesh( this.createRingGeo(100) , ringMat )





  var centerMat = new THREE.ShaderMaterial({
    vertexShader: loadBarShader.vs,
    fragmentShader: loadBarShader.fs,
    uniforms: u,
    attributes: a,
    side: THREE.DoubleSide,
    transparent: true,
   // blending: THREE.AdditiveBlending,
  });
  this.center = new THREE.Mesh( this.createCenterGeo( 50 ), centerMat );

  this.donateMesh = this.createDonateMesh( size );



}

Donate.prototype.start = function( scene , position ){

  /*G.v1.set( 0 , 0 , -00 );
  G.v1.applyQuaternion( G.camera.quaternion );
  G.v1.add( G.camera.position );
  G.v2.set( -200 , 0 , 0 );
  G.v2.applyQuaternion( G.camera.quaternion )
  G.v1.add( G.v2 );*/

  G.v1.copy( position )

  this.ring.position.copy( G.v1 );
  this.ring.lookAt( G.camera.position );

  this.center.position.copy( G.v1 );
  this.center.lookAt( G.camera.position );

  this.donateMesh.position.copy( G.v1 );
  this.donateMesh.lookAt( G.camera.position );

  this.donateMesh.hoverOver = this.hoverOver.bind( this );
  this.donateMesh.hoverOut  = this.hoverOut.bind( this );
  this.donateMesh.select    = this.select.bind( this );

  this.ring.hoverOver = this.hoverOver.bind( this );
  this.ring.hoverOut  = this.hoverOut.bind( this );
  this.ring.select    = this.select.bind( this );  

  this.center.hoverOver = this.hoverOver.bind( this );
  this.center.hoverOut  = this.hoverOut.bind( this );
  this.center.select    = this.select.bind( this );

  
  G.objectControls.add( this.ring )
  G.objectControls.add( this.center )
  G.objectControls.add( this.donateMesh )


  scene.add( this.ring );
  scene.add( this.center );
  scene.add( this.donateMesh );

}


Donate.prototype.hoverOver = function(){

  this.percentLoaded.value = 1;


}


Donate.prototype.hoverOut = function(){

  this.percentLoaded.value = 0;


}

Donate.prototype.select = function(){

  window.open( this.location )


  // Making it so that object gets hovered out, so interrstections
  // dont break
  G.v1.set( 1 , 0 , 0 );
  G.v1.applyQuaternion( G.camera.quaternion );
  G.v1.add( G.camera.position );
  G.objectControls.checkForIntersections( G.v1 )

}
Donate.prototype.update = function(){

  this.time.value += .1

  if( !this.ending ){


    G.v1.copy( G.iTextPoint.relative );
    this.ring.lookAt( G.v1 );
    this.center.lookAt( G.v1 );

    this.updateDonateMesh();

        this.center.updateMatrixWorld();
    
    this.center.material.uniforms.iModelMat.value.getInverse( this.center.matrixWorld );



  }

  
}

Donate.prototype.updateDonateMesh = function(){

  G.v1.set( 0 , 0 ,this.size / 2 );
  G.v1.applyQuaternion( this.center.quaternion );
  G.v1.add( this.center.position );
  this.donateMesh.position.copy( G.v1 );

  G.v1.copy( this.donateMesh.position );
  G.v2.copy(G.camera.position )
  G.v2.sub( G.v1 );
  G.v2.multiplyScalar( .1 );
  G.v1.add( G.v2 );

  this.donateMesh.rotation.setFromRotationMatrix( G.camera.matrixWorld )


}

Donate.prototype.createDonateMesh = function(size){
    
    var canvas  = document.createElement('canvas');


    var fullSize = 30000;
    var margin = 40;

    var ctx     = canvas.getContext( '2d' ); 


    ctx.font      = fullSize / 100 + "pt GeoSans";
    var textWidth = ctx.measureText( this.text ).width;

    canvas.width  = textWidth + margin;
    canvas.height = fullSize / 100 + margin;

   
    // Creates a texture
    var texture = new THREE.Texture(canvas);


    this.updateDonateTexture( this.text , canvas , ctx , texture , textWidth )


    var mesh = new THREE.Mesh( 
      new THREE.PlaneBufferGeometry( 1 , 1 ), 
      new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false

      })
    );

    mesh.scale.y = canvas.height;
    mesh.scale.x = canvas.width;
    mesh.scale.multiplyScalar( .1  * (size / 100));

    mesh.texture = texture;
    mesh.canvas = canvas;
    mesh.ctx = ctx;
    mesh.textWidth = textWidth;

    return mesh;




}

Donate.prototype.updateDonateTexture = function( string , canvas , ctx , texture , textWidth ){

    var fullSize = 30000;
    var margin = 10;

    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(
        canvas.width / 2 - textWidth / 2 - margin / 2, 
        canvas.height / 2 - fullSize / 2 - + margin / 2, 
        textWidth + margin, 
        fullSize + margin
    );

    // Makes sure our text is centered
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.font      = fullSize / 100 + "pt GeoSans";
    ctx.fillText( string , canvas.width / 2, canvas.height / 2);


    texture.needsUpdate = true;


}





Donate.prototype.createRingGeo = function( size ){

  var innerR = size * .8;
  var outerR = size;
  var faces = [];

  var segments = 40;

  for( var i  = 0; i < segments; i++ ){

    var t  =  2 * Math.PI * i  / segments;
    var tU =  2 * Math.PI * (i +.4) / segments;

    var xDoIn = Math.sin( t  ) * innerR;
    var xUpIn = Math.sin( tU ) * innerR;
    var yDoIn = Math.cos( t  ) * innerR;
    var yUpIn = Math.cos( tU ) * innerR;

    var xDoOu = Math.sin( t  ) * outerR;
    var xUpOu = Math.sin( tU ) * outerR;
    var yDoOu = Math.cos( t  ) * outerR;
    var yUpOu = Math.cos( tU ) * outerR;

    var f = [
      [ xUpIn , yUpIn , 0 ],
      [ xDoIn , yDoIn , 0 ],
      [ xDoOu , yDoOu , innerR - outerR ],
      [ xUpOu , yUpOu , innerR - outerR ]
    ]

    faces.push( f );

    //console.log( i );
    //console.log( f );
    //console.log( 'pysh' );

  }



  var s = size * .35;
  for( var i  = 0; i < segments * 2; i++ ){

    var t = 2 * Math.PI * i  / (segments * 2);
    var tU =  2 * Math.PI * (i+1) / (segments * 2);

    var xDoIn = Math.sin( t  ) * s * 2;
    var xUpIn = Math.sin( tU ) * s * 2;
    var yDoIn = Math.cos( t  ) * s * 2;
    var yUpIn = Math.cos( tU ) * s * 2;

    var xDoOu = Math.sin( t  ) * s * 2.1;
    var xUpOu = Math.sin( tU ) * s * 2.1;
    var yDoOu = Math.cos( t  ) * s * 2.1;
    var yUpOu = Math.cos( tU ) * s * 2.1;

    var f = [
      [ xUpIn , yUpIn , -s * .3 ],
      [ xDoIn , yDoIn , -s * .3 ],
      [ xDoOu , yDoOu , -s * .4 ],
      [ xUpOu , yUpOu , -s * .4 ]
    ]

    faces.push( f );

  }


  var positions  = new Float32Array( faces.length * 6 * 3 );
  var normals    = new Float32Array( faces.length * 6 * 3 );
  var tangents   = new Float32Array( faces.length * 6 * 3 );
  var types      = new Float32Array( faces.length * 6 * 1 );
  var ids        = new Float32Array( faces.length * 6 * 1 );
  var uvs        = new Float32Array( faces.length * 6 * 2 );


  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();
  var v3 = new THREE.Vector3();
  var v4 = new THREE.Vector3();

  var uv1 = new THREE.Vector2();
  var uv2 = new THREE.Vector2();
  var uv3 = new THREE.Vector2();
  var uv4 = new THREE.Vector2();

  
  var tmpV1 = new THREE.Vector3();
  var tmpV2 = new THREE.Vector3();

  var norm = new THREE.Vector3();
  var tang = new THREE.Vector3();
 
  for( var i = 0 ; i < faces.length; i++ ){

   // console.log('I : '+ i)

    var faceIndex = i * 6;
    var vertIndex = faceIndex * 3;
    var typeIndex = faceIndex * 1;
    var uvIndex   = faceIndex * 2;
    var face = faces[i];

    v1.set( face[0][0] , face[0][1] , face[0][2] );
    v2.set( face[1][0] , face[1][1] , face[1][2] );
    v3.set( face[2][0] , face[2][1] , face[2][2] );
    v4.set( face[3][0] , face[3][1] , face[3][2] );

   /* v1.multiplyScalar( size );
    v2.multiplyScalar( size );
    v3.multiplyScalar( size );
    v4.multiplyScalar( size );*/


    tmpV1.copy( v2 );
    tmpV2.copy( v2 );
    tmpV1.sub( v1 );
    tmpV2.sub( v3 );
  
    norm.crossVectors( tmpV1 , tmpV2 );
    norm.normalize(); 

    // any vec in the plane should do, as long as it is
    // shared across all attributes 
    tang.copy( v2 );
    tang.sub( v1 );
    tang.normalize();


    uv1.set( 0 , 0 );
    uv2.set( 0 , 1 );
    uv3.set( 1 , 1 );
    uv4.set( 1 , 0 );

    
    this.assignBufVec2( uvs , uvIndex + 0  , uv1 );
    this.assignBufVec2( uvs , uvIndex + 2  , uv3 );
    this.assignBufVec2( uvs , uvIndex + 4  , uv2 );
    this.assignBufVec2( uvs , uvIndex + 6  , uv4 );
    this.assignBufVec2( uvs , uvIndex + 8  , uv3 );
    this.assignBufVec2( uvs , uvIndex + 10 , uv1 );


    this.assignBufVec3( positions , vertIndex + 0  , v1 ); 
    this.assignBufVec3( positions , vertIndex + 3  , v3 ); 
    this.assignBufVec3( positions , vertIndex + 6  , v2 ); 
    this.assignBufVec3( positions , vertIndex + 9  , v4 ); 
    this.assignBufVec3( positions , vertIndex + 12 , v3 ); 
    this.assignBufVec3( positions , vertIndex + 15 , v1 );

    this.assignBufVec3( normals , vertIndex + 0  , norm ); 
    this.assignBufVec3( normals , vertIndex + 3  , norm ); 
    this.assignBufVec3( normals , vertIndex + 6  , norm ); 
    this.assignBufVec3( normals , vertIndex + 9  , norm );
    this.assignBufVec3( normals , vertIndex + 12 , norm );
    this.assignBufVec3( normals , vertIndex + 15 , norm );

    this.assignBufVec3( tangents , vertIndex + 0  , tang ); 
    this.assignBufVec3( tangents , vertIndex + 3  , tang ); 
    this.assignBufVec3( tangents , vertIndex + 6  , tang ); 
    this.assignBufVec3( tangents , vertIndex + 9  , tang ); 
    this.assignBufVec3( tangents , vertIndex + 12 , tang ); 
    this.assignBufVec3( tangents , vertIndex + 15 , tang ); 

    var type ;
    if( i < 40  ){
      //console.log('TYPE: 0');
      type = 0;
    }else{
      //console.log('TYPE: 1');
      type = 1;
    }

    this.assignBufFloat( types , typeIndex + 0, type ); 
    this.assignBufFloat( types , typeIndex + 1, type ); 
    this.assignBufFloat( types , typeIndex + 2, type ); 
    this.assignBufFloat( types , typeIndex + 3, type ); 
    this.assignBufFloat( types , typeIndex + 4, type ); 
    this.assignBufFloat( types , typeIndex + 5, type ); 

    this.assignBufFloat( ids , typeIndex + 0, i ); 
    this.assignBufFloat( ids , typeIndex + 1, i ); 
    this.assignBufFloat( ids , typeIndex + 2, i ); 
    this.assignBufFloat( ids , typeIndex + 3, i ); 
    this.assignBufFloat( ids , typeIndex + 4, i ); 
    this.assignBufFloat( ids , typeIndex + 5, i ); 


  } 

  var geo = new THREE.BufferGeometry();

  var posA  = new THREE.BufferAttribute( positions , 3 );
  var tangA = new THREE.BufferAttribute( tangents  , 3 );
  var normA = new THREE.BufferAttribute( normals   , 3 );
  var uvA   = new THREE.BufferAttribute( uvs       , 2 );
  var typeA = new THREE.BufferAttribute( types     , 1 );
  var idA   = new THREE.BufferAttribute( ids       , 1 );

  geo.addAttribute( 'position' , posA  );
  geo.addAttribute( 'tangent'  , tangA );
  geo.addAttribute( 'normal'   , normA );
  geo.addAttribute( 'uv'       , uvA   );
  geo.addAttribute( 'faceType' , typeA );
  geo.addAttribute( 'id'       , idA   );

  return geo;

}

Donate.prototype.createCenterGeo = function( size ){

  var circleR = 0 ;
  var polyR = size;
  var faces = [];

  var segments = 1;
  var poly = 6;

  for( var i  = 0; i < segments; i++ ){

    var t = 2 * Math.PI * (i-2)  / segments;

    var cX = Math.sin( t ) * circleR;
    var cY = Math.cos( t ) * circleR;
    var centerP = [ cX , cY , 0 ] 

    for( var j = 0; j < poly; j++ ){

      var t = 2 * Math.PI * j  / poly 
      var tU =  2 * Math.PI * (j+1) / poly

      var xCenter = cX;
      var yCenter = cY;
      var zCenter = 0;

      var xOutDo = cX + Math.sin( t  ) * polyR;
      var yOutDo = cY + Math.cos( t  ) * polyR;
      var xOutUp = cX + Math.sin( tU ) * polyR;
      var yOutUp = cY + Math.cos( tU ) * polyR;

      var f = [
        [ xCenter , yCenter , polyR /2],
        [ xOutDo , yOutDo  , -polyR /2],
        [ xOutUp , yOutUp  , -polyR /2],
      ]

      faces.push( f );

    }

  }


  var positions  = new Float32Array( faces.length * 3 * 3 );
  var normals    = new Float32Array( faces.length * 3 * 3 );
  var tangents   = new Float32Array( faces.length * 3 * 3 );
  var types      = new Float32Array( faces.length * 3 * 1 );
  var uvs        = new Float32Array( faces.length * 3 * 2 );


  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();
  var v3 = new THREE.Vector3();

  var uv1 = new THREE.Vector2();
  var uv2 = new THREE.Vector2();
  var uv3 = new THREE.Vector2();

  
  var tmpV1 = new THREE.Vector3();
  var tmpV2 = new THREE.Vector3();

  var norm = new THREE.Vector3();
  var tang = new THREE.Vector3();
 
  for( var i = 0 ; i < faces.length; i++ ){


    var faceIndex = i * 3;
    var vertIndex = faceIndex * 3;
    var typeIndex = faceIndex * 1;
    var uvIndex   = faceIndex * 2;
    var face = faces[i];

    v1.set( face[0][0] , face[0][1] , face[0][2] );
    v2.set( face[1][0] , face[1][1] , face[1][2] );
    v3.set( face[2][0] , face[2][1] , face[2][2] );

   /* v1.multiplyScalar( size );
    v2.multiplyScalar( size );
    v3.multiplyScalar( size );
    v4.multiplyScalar( size );*/


    tmpV1.copy( v2 );
    tmpV2.copy( v2 );
    tmpV1.sub( v1 );
    tmpV2.sub( v3 );
  
    norm.crossVectors( tmpV1 , tmpV2 );
    norm.normalize(); 

    // any vec in the plane should do, as long as it is
    // shared across all attributes 
    tang.copy( v2 );
    tang.sub( v1 );
    tang.normalize();


    uv1.set( 0 , 0 );
    uv2.set( 0 , 1 );
    uv3.set( 1 , 1 );

    
    this.assignBufVec2( uvs , uvIndex + 0  , uv1 );
    this.assignBufVec2( uvs , uvIndex + 2  , uv3 );
    this.assignBufVec2( uvs , uvIndex + 4  , uv2 );


    this.assignBufVec3( positions , vertIndex + 0  , v1 ); 
    this.assignBufVec3( positions , vertIndex + 3  , v3 ); 
    this.assignBufVec3( positions , vertIndex + 6  , v2 ); 

    this.assignBufVec3( normals , vertIndex + 0  , norm ); 
    this.assignBufVec3( normals , vertIndex + 3  , norm ); 
    this.assignBufVec3( normals , vertIndex + 6  , norm ); 

    this.assignBufVec3( tangents , vertIndex + 0  , tang ); 
    this.assignBufVec3( tangents , vertIndex + 3  , tang ); 
    this.assignBufVec3( tangents , vertIndex + 6  , tang ); 

    var type ;
    if( i < 6 ){
      //console.log('TYPE: 0');
      type = 0;
    }else if( i >= 6 && i < 12 ){
     // console.log('TYPE: 1');
      type = 1;
    }else{
      //console.log('TYPE: 2');
      type = 2;
    }

    this.assignBufFloat( types , typeIndex + 0, type ); 
    this.assignBufFloat( types , typeIndex + 1, type ); 
    this.assignBufFloat( types , typeIndex + 2, type ); 


  } 

  var geo = new THREE.BufferGeometry();

  var posA  = new THREE.BufferAttribute( positions , 3 );
  var tangA = new THREE.BufferAttribute( tangents  , 3 );
  var normA = new THREE.BufferAttribute( normals   , 3 );
  var uvA   = new THREE.BufferAttribute( uvs       , 2 );
  var typeA = new THREE.BufferAttribute( types     , 1 );

  geo.addAttribute( 'position' , posA  );
  geo.addAttribute( 'tangent'  , tangA );
  geo.addAttribute( 'normal'   , normA );
  geo.addAttribute( 'uv'       , uvA   );
  geo.addAttribute( 'faceType' , typeA );

  return geo;

}

Donate.prototype.assignBufVec3 = function( buf , index , vec ){

  buf[ index + 0 ] = vec.x;
  buf[ index + 1 ] = vec.y;
  buf[ index + 2 ] = vec.z;

}

Donate.prototype.assignBufVec2 = function( buf , index , vec ){

  buf[ index + 0 ] = vec.x;
  buf[ index + 1 ] = vec.y;

}

Donate.prototype.assignBufFloat = function( buf , index , f ){

  buf[ index ] = f;

}
