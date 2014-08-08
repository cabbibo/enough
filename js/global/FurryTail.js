  

  function FurryTail( group , params ){

    G.renderer.render( G.scene , G.camera );
    
    this.group = group;
    this.page = this.group.page;

    this.params = _.defaults( params || {} , {

      id:                 Math.floor( Math.random() * 100000),
      type:               'test',
      
      size:               32,
      sim:                G.shaders.ss.furryTailSim,
      simulationUniforms: {},
      leader:             new THREE.Object3D(),
      lineGeo:            this.createLineGeo,
      audio:              this.group.audio,

      particleSprite:     G.TEXTURES.sprite_cabbibo,
      //THREE.ImageUtils.loadTexture('img/sprite/cabbibo.png'),
      color1:             new THREE.Vector3( 1 , 1 , 1 ),
      color2:             new THREE.Vector3( 1 , 1 , 1 ),
      color3:             new THREE.Vector3( 1 , 1 , 1 ),
      color4:             new THREE.Vector3( 1 , 1 , 1 ),
      
      // Interaction with other tails
      physicsParams:      {
        forceMultiplier:  1,
        maxVel:           2,
        dampening:      .99999
      },
    
      particleSize: 2.,
      //iriLookup: THREE.ImageUtils.loadTexture('img/iri/rainbow.png')

    });

    this.active = false;

    this.setParams( this.params );

    this.lineGeo;
    
    if( !G.mani ){ 
      this.lineGeo = this.createLineGeo() 
    }else{
      this.lineGeo = G.mani.lineGeo;//this.createLineGeo();
    }

    this.lineUniforms = {
      t_pos:{ type:"t" , value:null },
      t_oPos:{ type:"t" , value:null },
      t_ooPos:{ type:"t" , value:null },
      //t_audio:{ type:"t" , value:null },
      t_audio:G.t_audio,
      color1: { type:"v3" , value:this.color1 },
      color2: { type:"v3" , value:this.color2 },
      color3: { type:"v3" , value:this.color3 },
      color4: { type:"v3" , value:this.color4 },
    }

    this.particleUniforms = {
      t_pos:{ type:"t" , value:null },
      t_oPos:{ type:"t" , value:null },
      t_ooPos:{ type:"t" , value:null },
      t_sprite:{ type:"t", value:null },
      //t_audio:{ type:"t" , value:null },
      t_audio:G.t_audio,

      particleSize: { type:"f" , value: this.particleSize },
      dpr: G.dpr,
      color1: { type:"v3" , value:this.color1 },
      color2: { type:"v3" , value:this.color2 },
      color3: { type:"v3" , value:this.color3 },
      color4: { type:"v3" , value:this.color4 },
    }

   
    // Other Tails of the same type
    this.brethren = [];
  
    // Physics
    this.position   = this.leader.position;
    this.velocity   = new THREE.Vector3();  
    this.force      = new THREE.Vector3();  

/*
    this.position.set(

        (Math.random() - .5 ) * 100,
        (Math.random() - .5 ) * 100,
        (Math.random() - .5 ) * 100

    );

    this.velocity.set(

        (Math.random() - .5 ) * 4,
        (Math.random() - .5 ) * 4,
        (Math.random() - .5 ) * 4

    );*/

    this.velocity.normalize();
    this.velocity.multiplyScalar( this.physicsParams.maxVel );

    this.distanceForces = [];
    this.distanceInverseForces = [];
    this.distanceInverseSquaredForces = [];
    this.distanceSquaredForces = [];
    this.normalForces = [];
    this.steeringForces = [];
    this.springForces = [];
    this.collisionForces = [];


    this.renderer     = G.renderer; 

    this.physicsRenderer = new PhysicsRenderer( 
      this.size,
      this.sim,
      G.renderer 
    );

    this.particleUniforms.t_sprite.value = this.particleSprite;

    /*if( this.particleUniforms.t_audio){
      this.particleUniforms.t_audio.value = this.audio.texture;
    }
    
    if( this.lineUniforms.t_audio){
      this.lineUniforms.t_audio.value = this.audio.texture;
    }*/
 
    var mat = new THREE.ShaderMaterial({
      uniforms: this.particleUniforms,
      vertexShader: G.shaders.vs.furryParticles,
      fragmentShader: G.shaders.fs.furryParticles,
      transparent: true,
      depthWrite: false
    })

    //var geo = ParticleUtils.createLookupGeometry( this.size );

    this.particleGeometry;
     if( !G.mani ){ 
      this.particleGeo = ParticleUtils.createLookupGeometry( this.size ); 
    }else{
      this.particleGeo = G.mani.particleGeo;//this.createLineGeo();
    }


  
    this.physicsParticles  = new THREE.PointCloud( this.particleGeo , mat );
    this.physicsParticles.frustumCulled = false;
    var pR = this.physicsRenderer;
    
    pR.addBoundTexture( this.physicsParticles , 't_pos' , 'output' );
    pR.addBoundTexture( this.physicsParticles , 't_oPos' , 'oOutput' );
    pR.addBoundTexture( this.physicsParticles , 't_ooPos' , 'ooOutput' );
 
    var lineMat = new THREE.ShaderMaterial({
      uniforms: this.lineUniforms,
      vertexShader: G.shaders.vs.furryTail,
      fragmentShader: G.shaders.fs.furryTail,    
    });

    this.line = new THREE.Line( this.lineGeo , lineMat );
    this.line.type = THREE.LinePieces;

    this.line.frustumCulled = false;
    
    pR.addBoundTexture( this.line , 't_pos' , 'output' );
    pR.addBoundTexture( this.line , 't_oPos' , 'oOutput' );
    pR.addBoundTexture( this.line , 't_ooPos' , 'ooOutput' );


    var mesh = new THREE.Mesh( new THREE.SphereGeometry( 1 ) );
    //var pTexture = ParticleUtils.createPositionsTexture( this.size , mesh );

    this.pTexture;
    if( !G.mani ){ 
      var mesh = new THREE.Mesh( new THREE.SphereGeometry( 1 ) ); 
      this.pTexture = ParticleUtils.createPositionsTexture( this.size , mesh ); 
    }else{
      this.pTexture = G.mani.pTexture;//this.createLineGeo();
    }

    //if( this === G.mani ){
    this.physicsRenderer.reset( this.pTexture );
    //}
    this.applyUniforms();

    this.head = new FurryHead(
      this.page,
      this.leader , 
      this.group.audio,
      this.color1 , 
      this.color2 , 
      this.color3 , 
      this.color4  
    );

    this.physicsRenderer.addBoundTexture( this.head.physicsRenderer , 't_column' , 'output' );


    G.renderer.render( G.scene , G.camera );

  }


  FurryTail.prototype.setColors = function( color1 , color2 , color3 ){



  }


  FurryTail.prototype.activate = function(){

    this.page.scene.add( this.leader );
    this.page.scene.add( this.physicsParticles );
    this.page.scene.add( this.line );
    this.page.scene.add( this.leader );
    this.page.scene.add( this.head.mesh );    

    this.active = true;

  }

  FurryTail.prototype.deactivate = function(){

    console.log('HELLO');
    this.page.scene.remove( this.physicsParticles );
    this.page.scene.remove( this.line );
    this.page.scene.remove( this.leader );
    this.page.scene.remove( this.head.mesh );    

    this.active = false;

  }



  FurryTail.prototype.updatePhysics = function(){


    // attract to bait    *from group*
    // attract to center  *all flagella*
    // attract to breathren 
    // attract to group
    //
    //
    var pp = this.physicsParams;

    for( var i = 0; i < this.distanceForces.length; i++ ){

      var pos = this.distanceForces[i][0];
      var force = this.distanceForces[i][1];
      this.applyDistanceForce( pos , force ); 

    }

    for( var i = 0; i < this.distanceInverseForces.length; i++ ){

      var pos = this.distanceInverseForces[i][0];
      var force = this.distanceInverseForces[i][1];
      this.applyDistanceInverseForce( pos , force ); 

    }

    for( var i = 0; i < this.distanceInverseSquaredForces.length; i++ ){

      var pos = this.distanceInverseSquaredForces[i][0];
      var force = this.distanceInverseSquaredForces[i][1];
      this.applyDistanceInverseSquaredForce( pos , force ); 

    }

    for( var i = 0; i < this.distanceSquaredForces.length; i++ ){

      var pos = this.distanceSquaredForces[i][0];
      var force = this.distanceSquaredForces[i][1];
      this.applyDistanceSquaredForce( pos , force ); 

    }

    for( var i = 0; i < this.normalForces.length; i++ ){

      var pos = this.normalForces[i][0];
      var force = this.normalForces[i][1];
      this.applyNormalForce( pos , force ); 

    }

    for( var i = 0; i < this.springForces.length; i++ ){

      var pos = this.springForces[i][0];
      var force = this.springForces[i][1];
      var length = this.springForces[i][2];
      this.applySpringForce( pos , force , length ); 

    }

    for( var i = 0; i < this.collisionForces.length; i++ ){

      var pos = this.collisionForces[i][0];
      var radius = this.collisionForces[i][1];
      this.applyCollisionForce( pos , radius ); 

    }

    for( var i = 0; i < this.steeringForces.length; i++ ){

      var pos = this.steeringForces[i][0];
      var radius = this.steeringForces[i][1];
      this.applySteeringForce( pos , radius ); 

    }


    var finalForce = this.force.multiplyScalar( pp.forceMultiplier );
    this.velocity.add( finalForce );

    if( this.velocity.length() > pp.maxVel ){

      this.velocity.normalize();
      this.velocity.multiplyScalar( pp.maxVel );

    }



    this.position.add( this.velocity.clone().multiplyScalar( G.dT.value * 80 ));
    this.velocity.multiplyScalar( pp.dampening ); // turn to vector dampening

    this.force.set( 0 , 0 , 0);

  }

  FurryTail.prototype.updateTail = function(){
    this.physicsRenderer.update();
    this.head.update();
  }


  FurryTail.prototype.addDebugScene = function(){

    this.physicsRenderer.addDebugScene( scene );

  }


  FurryTail.prototype.applyUniforms = function(){

    var uO = this.simulationUniforms;

    for( var propt in uO ){
      this.physicsRenderer.setUniform( propt , uO[propt] );
    }

    this.physicsRenderer.setUniform( 't_audio' ,{
      type:"t",
      value: this.audio.texture
    });

    this.physicsRenderer.setUniform( 'leader' , { 
      type:"v3" , 
      value: this.position
    });

    this.physicsRenderer.setUniform( 'flow' , { type:"v3" , value: G.flow } );
    this.physicsRenderer.setUniform( 'dT' , G.dT );

  }

  FurryTail.prototype.setParams = function( params ){
    for( propt in params ){
      var param = params[propt];
      // To make sure that we are passing in objects
      if( typeof param === 'object' ){
        if( this[propt] ){
          for( propt1 in param ){
            var param1 = param[propt1]
            if( typeof param === 'object' ){
              if( this[propt][propt1] ){
                for( propt2 in param1 ){
                  var param2 = param[propt2]
                  this[propt][propt1][propt2] = param2
                }
              }else{
                this[propt][propt1] = param1;
              }
            }else{
              this[propt][propt1] = param[propt1]
            }
          }
        }else{
          this[propt] = param
        }
      }else{
        this[propt] = param
      }
    }
  }
  



  FurryTail.prototype.updateBrethren = function(){

    this.brethren = this.group.tails;

  }



  FurryTail.prototype.removeAllForces  = function(){

    this.distanceForces                 = [];
    this.distanceInverseForces          = [];
    this.distanceInverseSquaredForces   = [];  
    this.distanceSquaredForces          = [];
    this.normalForces                   = [];
    this.springForces                   = [];
    this.collisionForces                = [];
    this.steeringForces                 = [];

  }

  FurryTail.prototype.addDistanceForce = function( pos , power ){

    this.distanceForces.push( [ pos , power ] );

  }


  FurryTail.prototype.applyDistanceForce = function( pos , power ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();
    
    dif.normalize();
    dif.multiplyScalar( l * power );

    this.force.add( dif );
    
  }

  FurryTail.prototype.addDistanceInverseForce = function( pos , power ){

    this.distanceInverseForces.push( [ pos , power ] );

  }


  FurryTail.prototype.applyDistanceInverseForce = function( pos , power ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();
    
    dif.normalize();
    dif.multiplyScalar( power / l );

    this.force.add( dif );
    
  }

  FurryTail.prototype.addDistanceInverseSquaredForce = function( pos , power ){

    this.distanceInverseSquaredForces.push( [ pos , power ] );

  }


  FurryTail.prototype.applyDistanceInverseSquaredForce = function( pos , power ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();
    
    dif.normalize();
    dif.multiplyScalar( power / (l*l) );

    this.force.add( dif );
    
  }




  FurryTail.prototype.addDistanceSquaredForce = function( pos , power ){

    this.distanceSquaredForces.push( [ pos , power ] );

  }

  FurryTail.prototype.applyDistanceSquaredForce = function( pos , power ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();
    
    dif.normalize();
    dif.multiplyScalar( l * l * power );

    this.force.add( dif );


  }


  FurryTail.prototype.addNormalForce = function( pos , power ){

    this.normalForces.push( [ pos , power ] );

  }

  FurryTail.prototype.applyNormalForce = function( pos , power ){

     var dif = pos.clone().sub( this.position );
    var l   = dif.length();
    
    dif.normalize();
    dif.multiplyScalar(  power );

    this.force.add( dif );


  }


  FurryTail.prototype.addSpringForce = function( pos , power , length ){

    this.springForces.push( [ pos , power , length ] );

  }

  FurryTail.prototype.applySpringForce = function( pos , power , length ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();

    var lDif = l - length;
    
    dif.normalize();
    dif.multiplyScalar( lDif * power );

    this.force.add( dif );


  }

  FurryTail.prototype.addCollisionForce = function( pos , radius ){

    this.collisionForces.push([ pos , radius ]);

  }

  FurryTail.prototype.applyCollisionForce = function( pos , radius ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();

    if( l < radius ){

      var normal = dif.clone().normalize();
      normal.multiplyScalar( -1 );
      var direction = this.velocity.clone();

      var dot = direction.dot( normal );
      normal.multiplyScalar( -2 * dot );
      this.velocity.copy( direction.sub( normal ));
      this.velocity.multiplyScalar( -100000 );

      var newPos = dif.normalize().multiplyScalar( -radius );
      newPos.add( pos );
      this.position.copy( newPos );

    }

  }

  FurryTail.prototype.addSteeringForce = function( pos , amount ){

    this.steeringForces.push([ pos , amount ]);

  }

  FurryTail.prototype.applySteeringForce = function( pos , amount ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();

    if( l > 0 ){

      dif.normalize();

      dif.multiplyScalar( this.physicsParams.maxVel );

      dif.sub( this.velocity );

      this.force.add( dif.multiplyScalar( amount ) );    
    
    }else{


    }

  }

  FurryTail.prototype.createLineGeo = function(){

    var lineGeo = new THREE.BufferGeometry();

    var posBuffer = new THREE.BufferAttribute(  new Float32Array( 32 * 32 * 2 * 3 ) , 3 );
    var colBuffer = new THREE.BufferAttribute(  new Float32Array( 32 * 32 * 2 * 3 ) , 3 );
     
    lineGeo.addAttribute( 'position', posBuffer );
    lineGeo.addAttribute( 'color'   , colBuffer );
    
    var positions = lineGeo.getAttribute( 'position' ).array;
    var colors = lineGeo.getAttribute( 'color' ).array;
    var size = 1 / 32;
    var hSize = size / 2;

    for( var i = 0; i < 32; i ++ ){

      // Spine 
      var index = i * 3;

      var p1 = index * 2;
      var p2 = index * 2 + 3;

      positions[ p1 ] = 0 * size ;
      positions[ p1 + 1 ] = i * size ;
      positions[ p1 + 2 ] = 1;

      positions[ p2 ] = 0 * size ;
      positions[ p2 + 1 ] = (i + 1) * size;
      positions[ p2 + 2 ] = 1;

      colors[ p1 ]      = i;
      colors[ p1 + 1 ]  = 0;
      colors[ p1 + 2 ]  = 0;

      colors[ p2 ]      = i + 1;
      colors[ p2 + 1 ]  = 0;
      colors[ p2 + 2 ]  = 0;

      // Sub
      for( var j = 0; j < 4; j++ ){

        // Start these positions after all of our indices
        var startingIndex = 32 * 3;

        var columnStartingIndex = startingIndex + ( 32 * 3 * j);

        var index = (i * 3) + columnStartingIndex;

        var p1 = index * 2;
        var p2 = index * 2 + 3;
        

        positions[ p1 ] = 0 * size;
        positions[ p1 + 1 ] = i * size ;
        positions[ p1 + 2 ] = 1;

        positions[ p2 ]     = ( j + 1) * size;
        positions[ p2 + 1 ] = i  * size;
        positions[ p2 + 2 ] = .1;

        colors[ p1 ]      = (i +1) / size;
        colors[ p1 + 1 ]  = 0;
        colors[ p1 + 2 ]  = 0;

        colors[ p2 ]      = (i +1) / size;
        colors[ p2 + 1 ]  = 1;
        colors[ p2 + 2 ]  = 0;

        //positions[ i + 3 ] = Math.random() * 20;
    
      }


      // Sub Sub
      for( var j = 0; j < 4; j ++ ){
        for( var k = 0; k < 4; k++ ){

          var startingIndex = 5 * 32 * 3;
          var groupStartingIndex = startingIndex + ( 32 * 3 * 4 * (j) );
          var columnStartingIndex = groupStartingIndex + ( 32 * 3 * (k) );

          var index = ( i *3 ) + columnStartingIndex;

          var p1 = index * 2;
          var p2 = index * 2 + 3;

          positions[ p1 ] = ( j + 1 ) * size;
          positions[ p1 + 1 ] = i * size;
          positions[ p1 + 2 ] = .1;

          positions[ p2 ]     = ( (j * 4) + 5 + k) * size;
          positions[ p2 + 1 ] = i * size;
          positions[ p2 + 2 ] = .1;


          colors[ p1 ]      = i;
          colors[ p1 + 1 ]  = 1;
          colors[ p1 + 2 ]  = 0;

          colors[ p2 ]      = i;
          colors[ p2 + 1 ]  = 2;
          colors[ p2 + 2 ]  = 0;

        }
      }

      // Spine Bundle
      for( var j = 0; j < 11; j++ ){


        var startingIndex = 21 * 32 * 3;
        var columnStartingIndex = startingIndex + ( 32 * 3 * j );
        var index = columnStartingIndex + ( i * 3 );

        var p1 = index * 2;
        var p2 = index * 2 + 3;

        positions[ p1 ] = 0 * size;
        positions[ p1 + 1 ] = i * size;
        positions[ p1 + 2 ] = .1;

        positions[ p2 ]     = (21 + j ) * size;
        positions[ p2 + 1 ] = i * size;
        positions[ p2 + 2 ] = .1;

        colors[ p1 ]      =  i;
        colors[ p1 + 1 ]  =  0;
        colors[ p1 + 2 ]  =  0;

        colors[ p2 ]      =  i;
        colors[ p2 + 1 ]  =  3;
        colors[ p2 + 2 ]  =  0;



      }

    }


    return lineGeo;


  }




