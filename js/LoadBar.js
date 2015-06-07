function LoadBar(){
	
	//this.ring2 = new THREE.Mesh( this.createRingGeo(1) , ringMat );

	this.percentLoaded = { type:"f" , value: 0 }
	this.time = { type:"f" , value: 0 }

  this.lightPos = { type:"v3" , value: new THREE.Vector3() }
	this.loadRing = [];

  this.lookPosition = new THREE.Vector3();
  this.ending = false;

  this.transparency = { type:"f" , value: 1 }



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

  this.percentMesh = this.createPercentMesh();



  this.onMouseMove = this.onMouseMove.bind( this );
  window.addEventListener( 'mousemove'   , this.onMouseMove  , false );


  this.addText();


}

LoadBar.prototype.onMouseMove = function( e ){

  this.lookPosition.x = 2 * e.clientX - G.w / 2
  this.lookPosition.y = -2 * ( e.clientY - (G.h / 2 ))
  this.lookPosition.z = 50

  this.lookPosition.applyQuaternion( G.camera.quaternion )


}


LoadBar.prototype.start = function(){

	G.v1.set( 0 , 0 , -400 );
	G.v1.applyQuaternion( G.camera.quaternion );
	G.v1.add( G.camera.position );
  G.v2.set( -200 , 0 , 0 );
  G.v2.applyQuaternion( G.camera.quaternion )
  G.v1.add( G.v2 );

	this.ring.position.copy( G.v1 );
	this.ring.lookAt( G.camera.position );

  this.center.position.copy( G.v1 );
  this.center.lookAt( G.camera.position );

  this.percentMesh.position.copy( G.v1 );
  this.percentMesh.lookAt( G.camera.position );

	G.scene.add( this.ring );
  G.scene.add( this.center );
  G.scene.add( this.percentMesh );

}

LoadBar.prototype.addText = function(){

  this.loadBarInfo = document.createElement('div');
  document.body.appendChild( this.loadBarInfo );

  this.loadBarInfo.id = 'loadBarInfo'

  this.loadInfoDiv = document.createElement('div');

  var p = Math.floor( this.percentLoaded.value * 100 )
  

  var forward = [
      "<p>It’s difficult to describe the joy that I found from picking up a picture book and reading it cover to cover. They let me explore galaxies, ride dinosaurs, slay dragons. They let me dig deep down into my own being as I wished upon a magic pebble, boarded a train bound for the north, or soared through the sky on a plane made from dough.</p>",
      "<p>I know I can never recreate the splendor, magnificence, or beauty that I found in these majestic works, but I hope that this project will still remind you of the wonder you found in these moments. Those times when you could be anything, go anywhere, and find magic in the most fragile of places.</p>"
  ].join("\n");

  this.loadInfoDiv.innerHTML = "<h1>Foreword</h1>"
  this.loadInfoDiv.innerHTML += "<p>"
  this.loadInfoDiv.innerHTML += forward
  this.loadInfoDiv.innerHTML += "<br/>"
 // this.loadInfoDiv.innerHTML += ""


  this.loadInfoDiv.innerHTML += "Runtime : 20 - 30 min <br/>"
  this.loadInfoDiv.innerHTML += "Interaction : Click Logo to switch pages <br/>"
  this.loadInfoDiv.innerHTML += "Requirements : Headphones<br/><br/>"
  this.loadInfoDiv.id = 'experienceInfo'
  this.loadBarInfo.appendChild( this.loadInfoDiv );
  var dpr = window.devicePixelRatio || 1;
  this.loadInfoDiv.style.fontSize = ( window.innerWidth * dpr ) / 160

  var offset = -this.loadBarInfo.clientHeight / 2 

  this.loadBarInfo.style.marginTop = offset + "px"
  //console.log( this.loadBarInfo.clientHeight )




  //element.id = 

}


LoadBar.prototype.removeText = function(){

  document.body.removeChild( this.loadBarInfo )

}
LoadBar.prototype.update = function(){

	this.time.value += .1


  

  if( !this.ending ){


    G.v1.set( 0 , 0 , -600 );
    G.v1.applyQuaternion( G.camera.quaternion );
    G.v1.add( G.camera.position );
    G.v2.set( -200 , 0 , 0 );
    G.v2.applyQuaternion( G.camera.quaternion )
    G.v1.add( G.v2 );

    this.ring.position.copy( G.v1 );
    this.center.position.copy( G.v1 );

    G.v1.copy( this.lookPosition );
    G.v1.add( G.camera.position )

    this.ring.lookAt( G.v1 );
    this.center.lookAt( G.v1 );

    this.center.updateMatrixWorld();
    
    this.center.material.uniforms.iModelMat.value.getInverse( this.center.matrixWorld );


    this.updatePercentMesh();

  }

  this.lightPos.value.copy( G.camera.position )

}

LoadBar.prototype.updatePercentMesh = function(){

  G.v1.set( 0 , 0 , 50 );
  G.v1.applyQuaternion( this.center.quaternion );
  G.v1.add( this.center.position );
  this.percentMesh.position.copy( G.v1 );

  G.v1.copy( this.percentMesh.position );
  G.v2.copy(G.camera.position )
  G.v2.sub( G.v1 );
  G.v2.multiplyScalar( .1 );
  G.v1.add( G.v2 );

  this.percentMesh.rotation.setFromRotationMatrix( G.camera.matrixWorld )


}

LoadBar.prototype.createPercentMesh = function(){
    
    var canvas  = document.createElement('canvas');


    var fullSize = 30000;
    var margin = 40;

    var ctx     = canvas.getContext( '2d' ); 


    ctx.font      = fullSize / 100 + "pt GeoSans";
    var textWidth = ctx.measureText("100%").width;

    canvas.width  = textWidth + margin;
    canvas.height = fullSize / 100 + margin;

   
    // Creates a texture
    var texture = new THREE.Texture(canvas);


    this.updatePercentTexture( '0', canvas , ctx , texture , textWidth )


    var mesh = new THREE.Mesh( 
      new THREE.PlaneBufferGeometry( 1 , 1 ), 
      new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthwrite: false

      })
    );

    mesh.scale.y = canvas.height;
    mesh.scale.x = canvas.width;
    mesh.scale.multiplyScalar( .1 );

    mesh.texture = texture;
    mesh.canvas = canvas;
    mesh.ctx = ctx;
    mesh.textWidth = textWidth;

    return mesh;




}

LoadBar.prototype.updatePercentTexture = function( percent , canvas , ctx , texture , textWidth ){

    var string = percent + "%"

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


LoadBar.prototype.onLoad = function( percent ){


	//console.log( percent )
	this.percentLoaded.value = percent


  G.onResize();

  var p = Math.floor( Math.min( 1 , this.percentLoaded.value ) * 100 )

  this.updatePercentTexture( 
    p , 
    this.percentMesh.canvas , 
    this.percentMesh.ctx , 
    this.percentMesh.texture , 
    this.percentMesh.textWidth
  );



}

LoadBar.prototype.onFinishedLoad = function(){

  this.startButton = document.createElement('div')
  this.startButton.id = 'startButton'
  this.startButton.innerHTML = 'BEGIN'

  this.startButton.addEventListener( 'click' , this.onStartButtonClick.bind(this) , false );

  this.loadBarInfo.appendChild( this.startButton )


}

LoadBar.prototype.onStartButtonClick = function( ){

  var time = G.loadBarTransitionTime
  this.ending = true;
  window.removeEventListener( 'mousemove'   , this.onMouseMove  , false );

  //this.tweenToCamera(time * 10);

  this.loadBarInfo.style.display = "none"

  //console.log( this.loadBarInfo.style )
  document.body.style.cursor = "none"

  G.scene.remove( this.ring )
  G.scene.remove( this.center )
  G.scene.remove( this.percentMesh )
/*  $( this.loadBarInfo ).fadeOut(time,function(){
    document.body.style.cursor = "none"
  }.bind( this ));*/
   G.fullscreenIt();

  window.setTimeout( function(){
   
    if( !G.loaded ){ G.loaded = true }
    G.scene.add( G.cursor );
    //G.rHand.particles.resetRand( 1000 );
    G.rHand.particles.activate();
    G.onResize();
    G.onResize();



  },2000);


}

LoadBar.prototype.tweenToCamera = function( time ){

  var s = { x : 0 }
  var e = { x : 1 }
  var tween = new G.tween.Tween( s ).to( e , time  );
  this.posDif = G.camera.position.clone();
  G.v1.set( 0 , 0 , -200 );
  G.v1.applyQuaternion( G.camera.quaternion );
  this.posDif.add( G.v1 );

  this.endPos =  this.posDif.clone();

  this.secondTween = G.camera.position.clone();
  this.secondTween.sub( this.endPos )


  this.endLook=  this.posDif.clone();
  this.endLook.add( G.v1 );


  this.posDif.sub( this.center.position );


  this.startPos = this.center.position.clone();


  var tweenTime1 = .2
  tween.onUpdate( function( t ){

    if( t < tweenTime1 ){

      G.v1.copy( this.startPos )
      G.v2.copy( this.posDif );
      G.v2.multiplyScalar( t / tweenTime1 );
      G.v1.add( G.v2 );

      this.center.position.copy( G.v1 );
      this.ring.position.copy( G.v1 );
    //  this.percentMesh.position.copy( G.v1 );

      //console.log( this.endPos );
      this.center.lookAt( this.endLook );
      this.ring.lookAt( this.endLook );
     // this.percentMesh.lookAt( this.endLook );
    }else{


      var t =( t - tweenTime1 ) / ( 1 - tweenTime1 );
      var t = Math.sqrt( t );

    
      G.v1.copy(this.endPos);
      G.v2.copy( this.secondTween );
      G.v2.multiplyScalar( t );
      G.v1.add( G.v2 );1

     

      this.center.position.copy( G.v1 );
      this.ring.position.copy( G.v1 );
      //this.percentMesh.position.copy( G.v1 );

      this.center.lookAt( this.endLook );
      this.ring.lookAt( this.endLook );
      //this.percentMesh.lookAt( this.endLook );

      if( t > .8 ){
        if( !G.loaded ){ G.loaded = true }

        //console.log(( 1 - t ) * 5 )

        this.transparency.value = ( 1 - t ) * 5;
       // this.center.material.opacity = ( 1 - t ) * 5;
      }

    }

  }.bind( this ));

  tween.onComplete( function( t ){
    G.scene.remove( this.ring )
    G.scene.remove( this.center )
   
  }.bind( this ));

  G.scene.remove( this.percentMesh )
  tween.start();

}


LoadBar.prototype.createRingGeo = function( size ){

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
  geo.addAttribute( 'id' 	     , idA   );

  return geo;

}

LoadBar.prototype.createCenterGeo = function( size ){

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

LoadBar.prototype.assignBufVec3 = function( buf , index , vec ){

  buf[ index + 0 ] = vec.x;
  buf[ index + 1 ] = vec.y;
  buf[ index + 2 ] = vec.z;

}

LoadBar.prototype.assignBufVec2 = function( buf , index , vec ){

  buf[ index + 0 ] = vec.x;
  buf[ index + 1 ] = vec.y;

}

LoadBar.prototype.assignBufFloat = function( buf , index , f ){

  buf[ index ] = f;

}

