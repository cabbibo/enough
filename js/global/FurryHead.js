
  function FurryHead( page , leader , audio ,  color1 , color2 , color3 , color4 ){


    this.page = page;
    this.size = 32;
    this.sim = G.shaders.ss.furryHeadSim;
    this.leader = leader;

    this.physicsRenderer = new PhysicsRenderer(
      this.size,
      this.sim,
      G.renderer
    );

    this.physicsRenderer.setUniform( 't_audio' , {
      type:"t",
      value:audio.texture
    });

    this.physicsRenderer.setUniform( 't_column' , {
      type:"t",
      value:null
    });


    this.physicsRenderer.setUniform( 'leader' , { 
      type:"v3" , 
      value:this.leader.position
    });

    this.physicsRenderer.setUniform( 'dT' , G.dT );

    this.physicsRenderer.setUniform( 'timer' , G.timer );



    var t_normal = G.TEXTURES.norm_moss;


    var uniforms = {
      
      t_normal: { type:"t"  , value: t_normal           },
      //t_audio:  { type:"t"  , value: audio.texture      },
      t_audio:  G.t_audio,
      t_pos:    { type:"t"  , value: null               },
      lightPos: { type:"v3" , value: this.page.position },
      color1:   { type:"v3" , value: color1             },
      color2:   { type:"v3" , value: color2             },
      color3:   { type:"v3" , value: color3             },
      color4:   { type:"v3" , value: color4             },

    }

    var material = new THREE.ShaderMaterial({

      uniforms: uniforms,
      vertexShader: G.shaders.vs.furryHead,
      fragmentShader: G.shaders.fs.furryHead,
      side: THREE.DoubleSide

    });
   
    this.geo;
    if( !G.mani ){
      this.geo = this.createGeo( this.size );
    }else{
      this.geo = G.mani.head.geo;
    }

    var m = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh( this.geo , material );

    this.mesh.frustumCulled = false;

    var pR = this.physicsRenderer;
    
    pR.addBoundTexture( this.mesh , 't_pos' , 'output' );

    var mesh = new THREE.Mesh( new THREE.BoxGeometry( 5 , 5 , 5) );
    var pTexture = this.createPosTexture( this.size );

    this.pTexture;
    if( !G.mani ){ 
      var mesh = new THREE.Mesh( new THREE.BoxGeometry( 5 , 5 , 5) );
      this.pTexture = this.createPosTexture( this.size );
    }else{
      this.pTexture = G.mani.head.pTexture;//this.createLineGeo();
    }   
    
    this.physicsRenderer.reset( this.pTexture );
   
  }

  FurryHead.prototype.update = function(){

    this.physicsRenderer.update();
  }


  FurryHead.prototype.createGeo = function( size ){

    var geo = new THREE.BufferGeometry();

    var subSize = (size) * (size-1);

    var posA = new THREE.BufferAttribute( new Float32Array( subSize * 6 * 3 ), 3 );
    var normA = new THREE.BufferAttribute( new Float32Array( subSize * 6 * 3 ), 3 );

    geo.addAttribute( 'position', posA ); 
    geo.addAttribute( 'normal', normA ); 
  
    var positions = geo.getAttribute( 'position' ).array;
    var normals = geo.getAttribute( 'normal' ).array;

    var uvArray = [];
    for( var i = 0; i < size; i++ ){
      for( var j = 0; j < size-1; j++ ){

        if( i < size-1){
          var x = (i+.5) / size;
          var y = (j+.5) / size;
        }else{
          var x = 10000; //.5 / size;
          var y = (j+.5) / size;
        }

        uvArray.push( [ x , y ] );
      }
    }

    for( var i=0; i < uvArray.length; i++ ){

      var x = uvArray[i][0];
      var y = uvArray[i][1];


      // Tri 1

      var index = i * 6 * 3;
     // var i = //TODO: index
     //
     
      if( x != 10000 ){

        positions[ index + 0 ] = x - (.5 / size); 
        positions[ index + 1 ] = y + (.5 / size); 
        positions[ index + 2 ] = 0; 

        positions[ index + 3 ] = x - ( .5 / size );
        positions[ index + 4 ] = y - ( .5 / size) ; 
        positions[ index + 5 ] = 0;

        positions[ index + 6 ] = x + (.5 / size); 
        positions[ index + 7 ] = y + (.5 / size); 
        positions[ index + 8 ] = 0; 

        positions[ index + 9 ] = x + (.5 / size); 
        positions[ index + 10 ] = y + (.5 / size); 
        positions[ index + 11 ] = 0; 

        positions[ index + 12 ] = x - ( .5 / size );
        positions[ index + 13 ] = y - ( .5 / size) ; 
        positions[ index + 14 ] = 0;

        positions[ index + 15 ] = x + (.5 / size); 
        positions[ index + 16 ] = y - (.5 / size); 
        positions[ index + 17 ] = 0;


        normals[ index + 0 ] = x - (.5 / size); 
        normals[ index + 1 ] = y + (.5 / size); 
        normals[ index + 2 ] = 0; 

        normals[ index + 3 ] = x - ( .5 / size );
        normals[ index + 4 ] = y - ( .5 / size) ; 
        normals[ index + 5 ] = 0;

        normals[ index + 6 ] = x + (.5 / size); 
        normals[ index + 7 ] = y + (.5 / size); 
        normals[ index + 8 ] = 0; 

        normals[ index + 9 ] = x + (.5 / size); 
        normals[ index + 10 ] = y + (.5 / size); 
        normals[ index + 11 ] = 0; 

        normals[ index + 12 ] = x - ( .5 / size );
        normals[ index + 13 ] = y - ( .5 / size) ; 
        normals[ index + 14 ] = 0;

        normals[ index + 15 ] = x + (.5 / size); 
        normals[ index + 16 ] = y - (.5 / size); 
        normals[ index + 17 ] = 0; 

      }else{

        positions[ index + 0 ] = 1 - (.5 / size); 
        positions[ index + 1 ] = y + (.5 / size); 
        positions[ index + 2 ] = 0; 

        positions[ index + 3 ] = 1 - ( .5 / size );
        positions[ index + 4 ] = y - ( .5 / size) ; 
        positions[ index + 5 ] = 0;

        positions[ index + 6 ] = 0 + (.5 / size); 
        positions[ index + 7 ] = y + (.5 / size); 
        positions[ index + 8 ] = 0; 

        positions[ index + 9 ] = 0 + (.5 / size); 
        positions[ index + 10 ] = y + (.5 / size); 
        positions[ index + 11 ] = 0; 

        positions[ index + 12 ] = 1 - ( .5 / size );
        positions[ index + 13 ] = y - ( .5 / size) ; 
        positions[ index + 14 ] = 0;

        positions[ index + 15 ] = 0 + (.5 / size); 
        positions[ index + 16 ] = y - (.5 / size); 
        positions[ index + 17 ] = 0;


        normals[ index + 0 ] = 1 - (.5 / size); 
        normals[ index + 1 ] = y + (.5 / size); 
        normals[ index + 2 ] = 0; 

        normals[ index + 3 ] = 1 - ( .5 / size );
        normals[ index + 4 ] = y - ( .5 / size) ; 
        normals[ index + 5 ] = 0;

        normals[ index + 6 ] = 0 + (.5 / size); 
        normals[ index + 7 ] = y + (.5 / size); 
        normals[ index + 8 ] = 0; 

        normals[ index + 9 ] = 0 + (.5 / size); 
        normals[ index + 10 ] = y + (.5 / size); 
        normals[ index + 11 ] = 0; 

        normals[ index + 12 ] = 1 - ( .5 / size );
        normals[ index + 13 ] = y - ( .5 / size) ; 
        normals[ index + 14 ] = 0;

        normals[ index + 15 ] = 0 + (.5 / size); 
        normals[ index + 16 ] = y - (.5 / size); 
        normals[ index + 17 ] = 0; 



      }
      
      /*
      positions[ i + 3 ] = x + ( .5 / size );
      positions[ i + 4 ] = y - ( .5 / size) ; 
      positions[ i + 5 ] = 0;
      */

      // Tri 2

    }
 
    return geo;
  
  
  };


  FurryHead.prototype.createPosTexture = function( size ){


    var data = new Float32Array( size * size * 4 );

    for ( var i = 0, l = data.length; i < l; i += 4 ) {

      var y = Math.floor( (i/4) / size );
      var x = (i/4)  - (y * size);


      var theta = 2 * Math.PI * ( x / size );

      var r =( .1 * Math.random() + .9) * 1;
      var posX = r * Math.cos( theta );
      var posZ = r * Math.sin( theta );

      /*var face = geometry.faces[ Math.floor( Math.random() * facesLength ) ];

      var vertex1 = geometry.vertices[ face.a ];
      var vertex2 = geometry.vertices[ Math.random() > 0.5 ? face.b : face.c ];

      point.subVectors( vertex2, vertex1 );
      point.multiplyScalar( Math.random() );
      point.add( vertex1 );*/

      data[ i ] = posX;
      data[ i + 1 ] = posZ;
      data[ i + 2 ] = -(1 - (y/size))*100;
      data[ i + 3 ] = 1;

    }

    var positionsTexture = new THREE.DataTexture(
      data, 
      size, 
      size, 
      THREE.RGBAFormat, 
      THREE.FloatType 
    );

    positionsTexture.minFilter = THREE.NearestFilter;
    positionsTexture.magFilter = THREE.NearestFilter;
    positionsTexture.generateMipmaps = false;
    positionsTexture.needsUpdate = true;

    return positionsTexture;

  };
