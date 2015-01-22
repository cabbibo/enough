function Coral( page , audio , position ){
    

  this.active = false;

  this.uniforms = {

    active:{type:"f" ,value:0 },
    t_audio:{type:"t" , value: audio.audioTexture.texture }


  }
  
  this.body = new THREE.Mesh( G.GEOS.icosahedron , G.MATS.basic );
  this.body.position.copy( position );
  this.body.scale.multiplyScalar( 4. );
  
  
  this.audio = audio;
  this.audio.updateTexture = true;
  this.audio.updateAnalyser = true;

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
  for( var i = 0; i < 10; i++ ){
    geometry.vertices.push( new THREE.Vector3(5 , 0 , 0));
  }

  console.log( G.shaders.vs.coralEmanator );
  console.log( G.shaders.fs.coralEmanator );
  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: G.shaders.vs.coralEmanator,
    fragmentShader: G.shaders.fs.coralEmanator,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  });

  this.emanator = new THREE.PointCloud( geometry, material );

  this.body.add( this.emanator );
  
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

      console.log('BOO');
      v.x = 0;

    }

  }


  
  g.verticesNeedUpdate = true;


  


}

Coral.prototype.hoverOver = function(){

  if( !this.active ){
    this.audio.turnOffFilter();
  }


}

Coral.prototype.hoverOut = function(){

  if( !this.active ){
    this.audio.turnOnFilter();
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
  this.audio.turnOffFilter();

}

Coral.prototype.deactivate = function(){

  
  this.active = false;
  this.uniforms.active.value = 0;
  this.audio.turnOnFilter();


}
