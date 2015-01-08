function Firework( page , params ){
  
  this.page = page;
  this.params = _.defaults( params || {} , {

    size: 32,
    audio: null,
    vs: null,
    fs: null,
    ss: null,
    looper: null,
    start: new THREE.Vector3(),
    speedUp:1000,
    speedDown: 20000


  });

  this.p = this.params;


  if( !this.params.audio ){ console.log('NO AUDIO' ); }
  if( !this.params.vs ){ console.log('NO Vertex' ); }
  if( !this.params.fs ){ console.lo+ this.p.speedUp;
g('NO Fragment' ); }
  if( !this.params.ss ){ console.log('NO Simulation' ); }



  this.size   = this.params.size;
  this.audio  = this.params.audio;
 
  this.vs = this.params.vs;
  this.fs = this.params.fs;
  this.ss = this.params.ss;

  this.start = this.params.start;


  this.soul = new PhysicsRenderer( this.size , this.ss , G.renderer );

  this.soul.setUniform( 'dT' , G.dT );
  this.soul.setUniform( 'timer' , G.timer );

  var geo = this.createGeometry();

  this.targetMarker = new THREE.Mesh( new THREE.IcosahedronGeometry( 2 , 2 ) , new THREE.MeshNormalMaterial() );

  //scene.add( this.targetMarker );
  //
  //
  this.baseMaterial = new THREE.ShaderMaterial({

    uniforms:{
      t_normal:     { type:"t" , value: G.TEXTURES['normal_water'] },
      t_audio:      { type:"t" , value:this.audio.texture },
      dpr:          G.dpr,//value: new THREE.Vector2( w*dpr , h*dpr ) },
      timer:        G.timer,
      alive: { type:"f" , value: 0 }
    },

    vertexShader: G.shaders.vs.fireworkBase,
    fragmentShader: G.shaders.fs.fireworkBase,


  });
  this.base =new THREE.Mesh(  new THREE.IcosahedronGeometry( 50 , 2 ) , this.baseMaterial );

  console.log( this.base );
  // new THREE.Mesh(  new THREE.IcosahedronGeometry( 20 , 2 ) , new THREE.MeshNormalMaterial() );

  this.base.position.copy( this.start );

  this.base.hoverOver = this.hoverOver.bind( this );
  this.base.hoverOut  = this.hoverOut.bind( this );
  this.base.select    = this.select.bind( this );
 
  G.objectControls.add( this.base );

 
  this.base.add( this.targetMarker );
  this.target = this.targetMarker.position;
  this.direction = new THREE.Vector3();

  var marker= new THREE.Mesh( 
      new THREE.IcosahedronGeometry( 100 , 0 ) , 
      new THREE.MeshBasicMaterial()
  );

  //this.base.add( marker );
  console.log( 'THAIS');
  console.log( this.audio );
 
  this.uniforms = {

    time:           G.timer,
    t_pos:          { type:"t"  , value: null },
    t_oPos:         { type:"t"  , value: null },
    t_audio:        { type:"t"  , value: this.audio.texture },
    t_sprite:       { type:"t"  , value: G.TEXTURES.sprite_flare},

    exploded:       { type:"f"  , value: 0 },
    explosion:      { type:"f"  , value: 0 },
    explosionType:  { type:"f"  , value: .5 },
    target:         { type:"v3" , value: this.target },
    direction:      { type:"v3" , value: this.direction },

    alive:          { type:"f"  , value: 0 },
    instant:        { type:"f"  , value: 0 }

  }

this.baseMaterial.uniforms.alive = this.uniforms.alive;
 
  var mat = new THREE.ShaderMaterial({

    uniforms: this.uniforms,
    vertexShader: this.vs , 
    fragmentShader: this.fs,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
 
  });
 
  this.body = new THREE.PointCloud( geo , mat );
  
  this.soul.addBoundTexture( this.body , 't_pos' , 'output' );
  this.soul.addBoundTexture( this.body , 't_oPos' , 'oOutput' );

  var mesh = new THREE.Mesh( new THREE.BoxGeometry(1,1,1,10 ,10,10) );
  
  mesh.rotation.x = Math.PI / 2;
  var posTexture = ParticleUtils.createPositionsTexture( this.size , mesh );
  
  this.soul.reset( posTexture );

  var t_start = { type:"t" , value: posTexture };
  
  this.soul.setUniform( 't_start'       , t_start );
  this.soul.setUniform( 'target'        , this.uniforms.target    );
  this.soul.setUniform( 'exploded'      , this.uniforms.exploded  );
  this.soul.setUniform( 'alive'         , this.uniforms.alive     );
  this.soul.setUniform( 'direction'     , this.uniforms.direction );
  this.soul.setUniform( 'explosion'     , this.uniforms.explosion );
  this.soul.setUniform( 'explosionType' , this.uniforms.explosionType );
  this.soul.setUniform( 'instant'       , this.uniforms.instant );


  this.alive = false;

  //this.base.add( this.body );


}

Firework.prototype.add = function(){

  this.page.scene.add( this.base );

}

Firework.prototype.remove = function(){

  this.page.scene.remove( this.base );

}

Firework.prototype.randomExplosion = function( callback ){


  G.tmpV3.copy( this.start );
  G.tmpV3.multiplyScalar( -1. );
  
  G.tmpV3.y = 200;

 // G.tmpV3.x -= (Math.random()) * 300;
 // G.tmpV3.z += (Math.random() -.5 ) * 300;

  G.tmpV3.x = -this.start.x * Math.random() * .1;
  G.tmpV3.z =-this.start.z * Math.random() * .1;

  var e = new THREE.Vector3();
  e.copy( G.tmpV3 );


  var eTime = Math.random() * this.p.speedUp * .3 + this.p.speedUp;
  var dTime = Math.random() * this.p.speedDown * .3 + this.p.speedUp;
  this.explode( e , eTime , dTime , callback );



}

Firework.prototype.explode = function( end , timeToExplode , timeToDissolve , callback ){

  this.base.add( this.body );

  this.target.set( 0 , 0 , 0);

  this.uniforms.instant.value = 1;
  this.soul.update();
  this.soul.update();
  this.soul.update();
  this.uniforms.instant.value = 0;  

  this.uniforms.exploded.value  = 0.;
  this.uniforms.explosion.value = 0.;
  this.uniforms.alive.value     = 1.;

  this.uniforms.explosionType.value = 1.;//Math.random();

  this.alive = true;

  this.direction.copy( end );
  this.direction.normalize();


  var o = { x: this.target.x , y: this.target.y , z: this.target.z }
  var tween = new TWEEN.Tween( o )
    .to( end , timeToExplode )
    .easing( TWEEN.Easing.Linear.None )
  
  tween.onUpdate( function( t ){

  //  this.audio.gain.gain.value = t*t*t;
    this.target.set( o.x , o.y , o.z );

  }.bind( this ));

  tween.onComplete( function( t ){

    this.uniforms.exploded.value = 1.;
    this.uniforms.explosion.value = 1.;

    var s = { v: 1 }
    var e = { v: 0 }
    var t2 = new TWEEN.Tween( s ).to( e , timeToDissolve );

    t2.onUpdate( function(t){

      // this.audio.gain.gain.value = 1-(t*t*t);


      this.uniforms.alive.value = 1-t;

    }.bind( this ));

    t2.onComplete( function(){

      this.alive = false;

      this.uniforms.exploded.value = 0.;
      this.uniforms.explosion.value = 0.;
      this.uniforms.alive.value = 0.;

      this.base.remove( this.body );

    }.bind( this ));

    t2.start();
  
  }.bind( this ));

  tween.start();

}

Firework.prototype.debug = function( reducer ){

  var reducer = reducer || .1;
  this.soul.createDebugScene();

  this.soul.debugScene.scale.multiplyScalar( reducer );
  this.soul.addDebugScene( scene );

}




Firework.prototype.update = function(){

  if( this.alive ){
    this.soul.update();
    
    if( this.uniforms.explosion.value == 1. ){
      
      //window.setTimeout( function(){
        this.uniforms.explosion.value = 0.;
      //}.bind( this ) , 10000 );
      
    }
  }

}

Firework.prototype.hoverOver = function(){

   
  if( this.alive === false ){
    
    this.randomExplosion();

  }

}

Firework.prototype.select = function(){

  console.log('sss');
  console.log( this );
   
  if( this.alive === false ){
    
    this.randomExplosion();

  }

}

Firework.prototype.hoverOut = function(){

}


Firework.prototype.createGeometry = function(){

  var geo = new THREE.BufferGeometry();
  var positions = new Float32Array( this.size * this.size * 3 );
  var pos = new THREE.BufferAttribute( positions , 3 );

  geo.addAttribute( 'position' , pos );

  var hSize = .5 / this.size;
  for( var i =0; i < this.size; i++ ){
    for( var j = 0; j < this.size; j++ ){

      var index = ((i * this.size ) + j) * 3;

      var x = (i / this.size) + hSize;
      var y = (j / this.size) + hSize;

      positions[ index + 0 ] = x;
      positions[ index + 1 ] = y;
      positions[ index + 2 ] = index / 3;

    }
  }

  return geo;

}

