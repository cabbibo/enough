

// TODO: Later Version, create texture to place particles 
// If you are using your own texture, 
// make sure that you are using your own letter indicies
  
  function TextParticles( params ){ 
   
    var params = params || {};

    this.pathToTexture  = params.pathToTexture  || "../img/extras/signDistance.png";
    this.letterWidth    = params.letterWidth    || 10;
    this.lineHeight     = params.lineHeight     || 12;
    this.lineLength     = params.lineLength     || 80;

    this.vertexShader   = params.vertexShader   || null;// TODO: default
    this.fragmentShader = params.fragmentShader || null;// TODO: default
    
    this.color          = params.color          || new THREE.Color(0xc0ffee);

    this.texture = THREE.ImageUtils.loadTexture( this.pathToTexture );
    this.texture.flipY = false;

    this.width = this.letterSize * this.lineLength; 

  }

  TextParticles.prototype.createDebugMesh = function( texture , size ){

    var size = size || 50;
    var geo = new THREE.PlaneGeometry( size , size );
    var mat = new THREE.MeshBasicMaterial({
      map: texture
    });

    var mesh = new THREE.Mesh( geo , mat );

    return mesh;

  }


  TextParticles.prototype.createTextParticles = function( string, params ){

    var particles = this.createParticles( string );
    var lookup    = this.createLookupTexture( particles );
    var textCoord = this.createTextCoordTexture( particles );
    var geometry  = this.createGeometry( particles , true );
  
    var material  = this.createMaterial(  lookup , textCoord , params );

    var particleSystem = new THREE.PointCloud( geometry , material );

    
    this.lookupTexture = lookup;

    particleSystem.size = lookup.size;

    return particleSystem;

  }




  // TODO: Make it so that you can pass letter width here

  TextParticles.prototype.createParticles = function( string ){

    var particles = [];

    var lineArray = string.split("\n");
    var counter = [0,0]; // keeps track of where we are

    for( var i = 0; i < lineArray.length; i++ ){

      counter[0] = 0;
      counter[1] ++;

      var wordArray = lineArray[i].split(" ");

      for( var j = 0; j < wordArray.length; j++ ){

        var word = wordArray[j];
        var letters = word.split("");
        var l = letters.length;

        // Makes sure we don't go over line width
        var newL = counter[0] + l;
        if( newL > this.lineLength ){
          counter[0] = 0;
          counter[1] ++;
        }

        // Push a new particle for each place
        for( var k = 0; k < letters.length; k ++ ){
          particles.push( [letters[k] , counter[0] , counter[1]] );
          counter[0] ++;
        }

        counter[0] ++;
      }
    }


    return particles;

  }

  

  TextParticles.prototype.createLookupTexture = function( particles ){

    var size = Math.ceil( Math.sqrt( particles.length ));

    var maxWidth  = 0;
    var maxHeight = 0;

    var data = new Float32Array( size * size * 4 );

    for( var i = 0; i < size*size; i++ ){

      if( particles[i] ){
      
        data[ i * 4 + 0 ] = particles[i][1] * this.letterWidth;
        data[ i * 4 + 1 ] = -particles[i][2] * this.lineHeight;
        data[ i * 4 + 2 ] = 0; // packing in textCoord 
        data[ i * 4 + 3 ] = 0; // just cuz!

      }

    }

    var f = THREE.RGBAFormat;
    var t = THREE.FloatType;
    
    var texture = new THREE.DataTexture( data , size, size, THREE.RGBAFormat , THREE.FloatType );
   
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    texture.size = size;
    texture.flipY = false;

    return texture;
  
  }

  TextParticles.prototype.createTextCoordTexture = function( particles ){

    var size = Math.ceil( Math.sqrt( particles.length ));

    var maxWidth  = 0;
    var maxHeight = 0;

    var data = new Float32Array( size * size * 4 );

    for( var i = 0; i < size*size; i++ ){

      if( particles[i] ){
     
        tc = this.getTextCoordinates( particles[i][0] );
        
        data[ i * 4 + 0 ] = tc[0];
        data[ i * 4 + 1 ] = tc[1];
        data[ i * 4 + 2 ] = tc[2]; // packing in textCoord 
        data[ i * 4 + 3 ] = tc[3]; // just cuz!

      }

    }

    var f = THREE.RGBAFormat;
    var t = THREE.FloatType;
    
    var texture = new THREE.DataTexture( data , size, size, THREE.RGBAFormat , THREE.FloatType );
   
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    texture.size = size;
    texture.flipY = false;

    return texture;
  
  }


  TextParticles.prototype.createGeometry = function( particles , lookup ){

    var geometry = new THREE.BufferGeometry();
  
    var posA    = new THREE.BufferAttribute( new Float32Array( particles.length * 3 ), 3);
    var coordA  = new THREE.BufferAttribute( new Float32Array( particles.length * 4 ), 4);
    
    geometry.addAttribute( 'position', posA ); 
    geometry.addAttribute( 'textCoord', coordA ); 
    
    var positions   = geometry.getAttribute( 'position' ).array;
  	var textCoords  = geometry.getAttribute( 'textCoord' ).array;

    var lookupWidth = Math.ceil( Math.sqrt( particles.length ) ); 


    for( var i = 0; i < particles.length; i++ ){
      
      if( lookup ){

        var x =             i % lookupWidth   ;
        var y = Math.floor( i / lookupWidth ) ;

        //console.log( x + " , " + y );
        positions[ i * 3 + 0 ] = x / lookupWidth;
        positions[ i * 3 + 1 ] = y / lookupWidth; 
        positions[ i * 3 + 2 ] = 0; 

      }else{

        positions[ i * 3 + 0 ] = particles[i][1] * this.letterWidth;
        positions[ i * 3 + 1 ] = -particles[i][2] * this.lineHeight; 
        positions[ i * 3 + 2 ] = 0; 

      }
        

      tc = this.getTextCoordinates( particles[i][0] );

      textCoords[ i * 4 + 0 ] = tc[0];
      textCoords[ i * 4 + 1 ] = tc[1];
      textCoords[ i * 4 + 2 ] = tc[2];
      textCoords[ i * 4 + 3 ] = tc[3];

    }

    return geometry;

  }

  //TODO: Make with and height of letter, for later use
  TextParticles.prototype.getTextCoordinates = function( letter ){
    
    var index;

    for( var l in letterIndicies ){
      if( l == letter )
        index = letterIndicies[l];  
    }

    if( !index )
      index = [0,0];

    var left = (32 * (index[0]) ) / 512; 
    var top  = (32 * (index[1]) ) / 256;

    var bottom = top + ( 16 / 512 );
    var right = left + ( 16 / 512 );

    var array = [ left , top , bottom , right ];
    return array

  }

 
  // Passing a lookup through
  TextParticles.prototype.createMaterial = function( lookup , textCoord , params ){

    var params = params || {};

    var texture     = params.texture      || this.texture;
    var lookup      = params.lookup       || lookup;
    var textCoord   = params.textCoord    || textCoord;
    var color       = params.color        || this.color;
    var letterWidth = params.letterWidth  || this.letterWidth;

    var attributes = {
      textCoord: { type:"v4" , value: null },
    }

   
    var c = new THREE.Color( color );

    var windowSize = new THREE.Vector2( window.innerWidth , window.innerHeight );
    var dpr       = window.devicePixelRatio || 1;

    var uniforms = {

      t_textCoord:{ type:"t"  , value: textCoord    },
      t_lookup:{    type:"t"  , value: lookup       },
      t_text:{      type:"t"  , value: texture      },
      color:{       type:"c"  , value: c            },
      textureSize:{ type:"f"  , value: lookup.size  },
      windowSize:{  type:"v2" , value: windowSize   },
      letterWidth:{ type:"f"  , value: letterWidth  },
      dpr:{         type:"f"  , value: dpr          },
      
  
    }

    var vert  = params.vertexShader   || this.vertexShader;
    var frag  = params.fragmentShader || this.fragmentShader;
    var attr  = params.attributes     || attributes;
    var unif  = params.uniforms       || uniforms;

    var blend = params.blending       || THREE.AdditiveBlending;
    var depth = params.depthWrite     || false;
    var trans = params.transparent    || true;

    material = new THREE.ShaderMaterial({

      uniforms:           unif,
      attributes:         attr,
      vertexShader:       vert,
      fragmentShader:     frag,

      transparent:        trans,
      depthWrite:         depth,
      blending:           blend

    });


    return material;


  }



  var letterIndicies = {
    A:[1,2],B:[2,2],C:[3,2],D:[4,2],E:[5,2],F:[6,2],G:[7,2],
    H:[8,2],I:[9,2],J:[10,2],K:[11,2],L:[12,2],M:[13,2],
    N:[14,2],O:[15,2],P:[0,3],Q:[1,3],R:[2,3],S:[3,3],
    T:[4,3],U:[5,3],V:[6,3],W:[7,3],X:[8,3],Y:[9,3],
    Z:[10,3],a:[1,4],b:[2,4],c:[3,4],d:[4,4],e:[5,4],
    f:[6,4],g:[7,4],h:[8,4],i:[9,4],j:[10,4],k:[11,4],
    l:[12,4],m:[13,4],n:[14,4],o:[15,4],p:[0,5],q:[1,5],
    r:[2,5],s:[3,5],t:[4,5],u:[5,5],v:[6,5],w:[7,5],x:[8,5],
    y:[9,5],z:[10,5],"!":[1,0],'"':[2,0],'#':[3,0],
    '$':[4,0],'%':[5,0],'&':[6,0],"'":[7,0],"(":[8,0],
    ")":[9,0],"*":[10,0],"+":[11,0],",":[12,0],"-":[13,0],
    ".":[14,0],"/":[15,0],"0":[0,1],"1":[1,1],"2":[2,1],
    "3":[3,1],"4":[4,1],"5":[5,1],"6":[6,1],"7":[7,1],
    "8":[8,1],"9":[9,1],":":[10,1],";":[11,1],"<":[12,1],
    "=":[13,1],">":[14,1],"?":[15,1],"@":[0,2],"[":[11,3],
    "]":[13,3],"^":[14,3],"_":[15,3],"{":[11,5],"|":[12,5],
    "}":[13,5],"~":[14,5],
  }

