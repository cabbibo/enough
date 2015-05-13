function Coral( page , audio , position ){
    

  this.active = false;

  this.uniforms = {

    active:{type:"f" ,value:0 },
    hovered:{type:"f" ,value:0 },
    timer:G.timer,
    t_audio:{type:"t" , value: audio.audioTexture.texture },
    t_matcap:{type:"t" , value: G.TEXTURES[ "matcapMetal" ] },
    lightPos:{ type:"v3" , value: G.mani.position }

  }
 
  var geo = G.GEOS.icosahedronDense;

  var mat = new THREE.ShaderMaterial({
    uniforms:       this.uniforms,
    vertexShader:   G.shaders.vs.coral,
    fragmentShader: G.shaders.fs.coral,
    transparent: true,
    side: THREE.DoubleSide,
   // depthWrite:false
  });

  this.body = new THREE.Mesh( geo , mat );
  this.body.position.copy( position );
  this.body.scale.multiplyScalar( 40. );

 // var g = G.GEOS.icosahedron;
  var m = new THREE.MeshBasicMaterial();
  this.center = new THREE.Mesh( geo , m );
  //this.centerOBJ.position.y += 100;
  this.center.scale.multiplyScalar( .3 );
  //
  this.center.rotation.x = Math.PI / 4;
  this.center.rotation.y = Math.PI / 4;
  this.center.rotation.z = Math.PI / 4;
  this.body.add( this.center );
    
  this.audio = audio;
  this.audio.updateTexture = true;
  this.audio.updateAnalyser = true;
  this.audio.updateAverageVolume = true;

  this.average =  0;

  this.data = new THREE.Vector4();


  G.objectControls.add( this.body );

  this.body.hoverOver = this.hoverOver.bind( this );
  this.body.hoverOut  = this.hoverOut.bind( this );
  this.body.select    = this.select.bind( this );

  this.position = this.body.position;

  this.emanator;

  var uniforms = {

    active:   this.uniforms.active,
    t_audio:  this.uniforms.t_audio,

  }

  var geometry = new THREE.Geometry();
  for( var i = 0; i < 3; i++ ){
    geometry.vertices.push( new THREE.Vector3(5 , 0 , 0));
  }

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: G.shaders.vs.coralEmanator,
    fragmentShader: G.shaders.fs.coralEmanator,
    blending: THREE.AdditiveBlending,
    transparent: true,
    //depthWrite: false
  });

  this.emanator = new THREE.PointCloud( geometry, material );

  this.body.add( this.emanator );

  page.scene.add( this.body );
  page.scene.updateMatrixWorld();

  G.tmpV3.set( 0,0,0);
  G.tmpV3.setFromMatrixPosition( this.body.matrixWorld );

  this.data.x = G.tmpV3.x;
  this.data.y = G.tmpV3.y;
  this.data.z = G.tmpV3.z;
  this.data.w = this.average;

  this.audio.turnOnFilter();
  
}

Coral.prototype.update = function(){

  var g = this.emanator.geometry;

  var l = this.audio.analyser.array.length;
 // console.log( l );
  for( var i = 0; i < g.vertices.length; i++ ){

    var index = Math.floor((i / g.vertices.length) * l);
    var audioPower = this.audio.analyser.array[index]

    //console.log( index );
    var v = g.vertices[i];
    v.x +=  10 * audioPower/256;
    if( audioPower !== 0 ){

     // console.log( audioPower );
    }
   // console.log( audioPower/256 );
    if( v.x > 500 ){
      v.x = 0;
    }

  }

  this.average= this.audio.averageVolume;
  this.data.w = this.average;

  
  g.verticesNeedUpdate = true;


  


}

Coral.prototype.hoverOver = function(){

  this.center.material.color.setRGB( 1 , 1,1);
  this.uniforms.hovered.value = 1.;
  if( !this.active ){

    this.filterUp();
   // this.audio.turnOffFilter();
  }


}

Coral.prototype.tweenFilter = function( newValue , l ){

  var s = { v : this.audio.filter.frequency.value } 
  var e = { v : newValue }
  var tween = new G.tween.Tween( s ).to( e , l );

  this.tweenTMP = s;
  tween.audio = this.audio
  tween.onUpdate(function(){
    this.audio.filter.frequency.value = this.tweenTMP.v;
  }.bind( this));

  tween.start();

}

Coral.prototype.filterDown = function(){
  this.tweenFilter( 350 , 100 );
}

Coral.prototype.filterUp = function(){
  this.tweenFilter( 3000 , 100 );
}


Coral.prototype.hoverOut = function(){
  this.uniforms.hovered.value = 0.;

  this.center.material.color.setRGB( .3 , .3,.3);

  if( !this.active ){
    this.filterDown(); 
  }



}

Coral.prototype.select = function(){

  if( !this.active ){
    this.activate();
  }else{
    this.deactivate();
  }

}

Coral.prototype.activate = function(){

  this.active = true;
  this.uniforms.active.value = 1;
  //this.audio.turnOffFilter();
  
    this.filterUp(); 
  

}

Coral.prototype.deactivate = function(){

  
  this.active = false;
  this.uniforms.active.value = 0;
  //this.audio.turnOnFilter();
  this.filterDown();


}
