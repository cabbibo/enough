function Firework( page , params ){
  
  this.page = page;
  this.params = _.defaults( params || {} , {

    size: 16,
    audio: null,
    looper: null,
    start: new THREE.Vector3(),
    speedUp:500,
    speedDown: 6000,
   
    // for array renderer1
    depth: 64,
    joints: 4,
   // size: 16,
    sides: 6,
    time: G.dT,



  });

  this.p = this.params;

  this.p.jointSize = this.p.depth / this.p.joints;

  if( !this.params.audio ){ console.log('NO AUDIO' ); }


  this.size   = this.params.size;
  this.audio  = this.params.audio;


  this.start = this.params.start;



  /*
   
     HOVER OVER OBJECT


   */

  //TODO: inefficient geometry
  this.targetMarker = new THREE.Mesh( new THREE.IcosahedronGeometry( 2 , 2 ) , new THREE.MeshNormalMaterial() );

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

  //TODO: inefficient geometry
  this.base =new THREE.Mesh( new THREE.IcosahedronGeometry( 50 , 2 ) , this.baseMaterial );

  this.base.position.copy( this.start );

  this.base.hoverOver = this.hoverOver.bind( this );
  this.base.hoverOut  = this.hoverOut.bind( this );
  this.base.select    = this.select.bind( this );
 
  G.objectControls.add( this.base );


  // Setting up the direction of the firework 
  //this.base.add( this.targetMarker );
  this.target = this.targetMarker.position;
  this.direction = new THREE.Vector3();

  var marker= new THREE.Mesh( 
      new THREE.IcosahedronGeometry( 100 , 0 ) , 
      new THREE.MeshBasicMaterial()
  );



  


    /*
   
     

      ACTUAL FIREWORK

   */
   
  this.textureArray = [];

  // 
  this.uniforms = {

    dpr:            G.dpr,
    time:           G.timer,
    t_pos:          { type:"t"  , value: null },
    t_posArray :    { type:"tv" , value: this.textureArray },
    t_oPos:         { type:"t"  , value: null },
    t_audio:        { type:"t"  , value: this.audio.texture },
    t_sprite:       { type:"t"  , value: G.TEXTURES.sprite_flare},

    exploded:       { type:"f"  , value: 0 },
    explosion:      { type:"f"  , value: 0 },
    explosionType:  { type:"f"  , value: Math.random() },
    target:         { type:"v3" , value: this.target },
    direction:      { type:"v3" , value: this.direction },

    alive:          { type:"f"  , value: 0 },
    instant:        { type:"f"  , value: 0 },
     
    resolution:     { type:"v2" , value: new THREE.Vector2() },



  }


  var s = this.size;
  this.uniforms.resolution.value.set( s , s );
  //this.soulUniforms.predator.value.set( 10000000000 , 0 , 0 );



  var ss = G.shaders.ss.firework;
  this.soul = new PhysicsArrayRenderer(
    this.size , 
    this.params.depth,
    ss,
    G.renderer 
  );

  this.soul.setUniform( 'dT' , G.dT );
  this.soul.setUniform( 'time' , G.timer );
  
  this.soul.setUniform( 'target'        , this.uniforms.target        );
  this.soul.setUniform( 'exploded'      , this.uniforms.exploded      );
  this.soul.setUniform( 'alive'         , this.uniforms.alive         );
  this.soul.setUniform( 'direction'     , this.uniforms.direction     );
  this.soul.setUniform( 'explosion'     , this.uniforms.explosion     );
  this.soul.setUniform( 'explosionType' , this.uniforms.explosionType );
  this.soul.setUniform( 'instant'       , this.uniforms.instant       );


  this.alive = false;

  for( var i = 0; i < this.params.joints; i++ ){

    this.textureArray.push( this.soul.rt[i] );

  }

  var size    = this.params.size;
  var joints  = this.params.joints;
  var sides   = this.params.sides;

  this.geometries = CreateFlockingGeometry( size , joints , sides );

  this.baseMaterial.uniforms.alive = this.uniforms.alive;

  
  /*

     Firework tips
        
  */
  var vs = G.shaders.setValue( 
    G.shaders.vs.firework, 
    'DEPTH' ,
    this.params.joints  
  );

  var fs = G.shaders.fs.firework; 
  var mat = new THREE.ShaderMaterial({

    uniforms: this.uniforms,
    vertexShader: vs, 
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
 
  });

  var geo = this.geometries.particle( size ); 
  this.body = new THREE.PointCloud( geo , mat );




  /*

     Firework tails
        
  */


  var vs = G.shaders.setValue( 
    G.shaders.vs.fireworkLine, 
    'DEPTH' ,
    joints  
  );

  var fs = G.shaders.fs.fireworkLine


  var geo = this.geometries.line( size , joints );
  var mat  = new THREE.ShaderMaterial({

    uniforms: this.uniforms,
    vertexShader: vs, 
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
 
  });
 
  this.lines = new THREE.Line( geo , mat , THREE.LinePieces );

  

  

  /*
   
     Setting up the original position for the firework.

  */
  var mesh = new THREE.Mesh( new THREE.IcosahedronGeometry(10,2) );

  mesh.rotation.x = Math.PI / 2;
  
  this.posTexture = ParticleUtils.createPositionsTexture( this.size , mesh );
  
  this.soul.reset( this.posTexture );
   
  var t_start = { type:"t" , value: this.posTexture };
  this.soul.setUniform( 't_start' , t_start );


 
  this.base.add( this.lines ); 
  this.base.add( this.body );

  console.log('hello')
  console.log( this.audio )
  this.audio.turnOnFilter();
  this.audio.filter.frequency.value = 200;

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

  G.tmpV3.x = -this.start.x * Math.random() * .3;
  G.tmpV3.z =-this.start.z * Math.random() * .3;

  var e = new THREE.Vector3();
  e.copy( G.tmpV3 );


  var eTime = Math.random() * this.p.speedUp * .2 + this.p.speedUp;
  var dTime = Math.random() * this.p.speedDown * .2 + this.p.speedDown;
  this.explode( e , eTime , dTime , callback );



}

Firework.prototype.explode = function( end , timeToExplode , timeToDissolve , callback ){

  this.base.add( this.body );

  this.target.set( 0 , 0 , 0 );

  this.soul.reset( this.posTexture );

  this.uniforms.exploded.value  = 0.;
  this.uniforms.explosion.value = 0.;
  this.uniforms.alive.value     = 1.;

  this.uniforms.explosionType.value = Math.random();

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

  //console.log( 'TTE')
  //console.log( timeToExplode )
  this.tweenFilter( 4000 ,  timeToExplode  )

  tween.onComplete( function( t ){

    this.uniforms.exploded.value = 1.;
    this.uniforms.explosion.value = 1.;

    var s = { v: 1 }
    var e = { v: 0 }
    var t2 = new TWEEN.Tween( s ).to( e , timeToDissolve );

    this.tweenFilter( 200 ,   timeToDissolve )

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
    
    for( var i =0;i< this.params.joints; i++ ){
      this.textureArray[i] = this.soul.output[i * this.params.jointSize];
    }


   /// this.soul.update();
    
    if( this.uniforms.explosion.value == 1. ){
      
      //window.setTimeout( function(){
        this.uniforms.explosion.value = 0.;
      //}.bind( this ) , 10000 );
      
    }
  }

}

Firework.prototype.tweenFilter = function( newValue , l ){

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

Firework.prototype.filterDown = function(){
  this.tweenFilter( 350 , 200 );
}

Firework.prototype.filterUp = function(){
  this.tweenFilter( 3000 , 200 );
}


Firework.prototype.hoverOver = function(){

   
  if( this.alive === false ){
    
    this.randomExplosion();

  }

}

Firework.prototype.select = function(){

  if( this.alive === false ){
    
    this.randomExplosion();

  }

}

Firework.prototype.hoverOut = function(){

}

