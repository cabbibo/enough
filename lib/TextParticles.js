

// TODO: Later Version, create texture to place particles 
// If you are using your own texture, 
// make sure that you are using your own letter indicies
  
  function TextParticles( params ){ 
   
    var params = params || {};

    this.pathToTexture  = params.pathToTexture  || "img/extras/ubuntuMono.png";
    this.letterWidth    = params.letterWidth    || 10;
    this.lineHeight     = params.lineHeight     || 16;
    this.lineLength     = params.lineLength     || 80;

    this.vertexShader   = params.vertexShader   || null;// TODO: default
    this.fragmentShader = params.fragmentShader || null;// TODO: default
    
    this.color          = params.color          || new THREE.Color(0xc0ffee);

    this.texture = G.TEXTURES[ 'ubuntuMono' ];
    this.texture.flipY = false;

    this.width = this.letterSize * this.lineLength; 

   // console.log('BEASDSADASV');

   // for( var l in unbuntuMono );
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

    particleSystem.frustumCulled = false; 
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
      
        data[ i * 4 + 0 ] = particles[i][1] * this.letterWidth * .8;
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
    var offsetA = new THREE.BufferAttribute( new Float32Array( particles.length * 2 ), 2);
    
    geometry.addAttribute( 'position'   , posA    ); 
    geometry.addAttribute( 'textCoord'  , coordA  ); 
    geometry.addAttribute( 'textOffset' , offsetA );
    
    var positions   = geometry.getAttribute( 'position' ).array;
  	var textCoords  = geometry.getAttribute( 'textCoord' ).array;
  	var textOffsets = geometry.getAttribute( 'textOffset' ).array;

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

      textCoords[  i * 4 + 0 ] = tc[0];
      textCoords[  i * 4 + 1 ] = tc[1];
      textCoords[  i * 4 + 2 ] = tc[2];
      textCoords[  i * 4 + 3 ] = tc[3];

      textOffsets[ i * 2 + 0 ] = tc[4];
      textOffsets[ i * 2 + 1 ] = tc[5];

    }

    return geometry;

  }

  //TODO: Make with and height of letter, for later use
  TextParticles.prototype.getTextCoordinates = function( letter ){
    
    var index;

    var charCode = letter.charCodeAt(0);

    var charString = "" + charCode;

    if( charCode == 8216 ){

      charCode = 39;
    }

    if( charCode == 8217 ){

      charCode = 39;
    }

    if( charCode == 8212 ){

      charCode = 45;

    }

    for( var l in ubuntuMono ){
    if( l == charCode )
      index = ubuntuMono[l];  
    }

    if( !index ){
     
      console.log('NO LETTER' );
      index = [0,0];

    }

    
    var left    = index[0] / 1024;
    var top     = index[1] / 1024;

    var width   = index[2] / 1024;
    var height  = index[3] / 1024;

    var xoffset = index[4] / 1024;
    var yoffset = index[5] / 1024;

    var array = [ left , top , width , height , xoffset , yoffset ];
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
    var opacity     = params.opacity      || 1;

    var attributes = {
      textCoord: { type:"v4" , value: null },
      textOffset: { type:"v2" , value: null },
    }

   
    var c = new THREE.Color( color );

    var windowSize = G.windowSize;
    var dpr       = window.devicePixelRatio || 1;

    var glyphWidth = ubuntuMono.glyphWidth  / 1024;
    var glyphHeight = ubuntuMono.glyphHeight / 1024;
    var glyphBelow = ubuntuMono.glyphBelow / 1024;

    var uniforms = {

      t_textCoord:{ type:"t"  , value: textCoord    },
      t_lookup:{    type:"t"  , value: lookup       },
      t_text:{      type:"t"  , value: texture      },
      color:{       type:"c"  , value: c            },
      textureSize:{ type:"f"  , value: lookup.size  },
      windowSize:{  type:"v2" , value: windowSize   },
      letterWidth:{ type:"f"  , value: letterWidth  },
      dpr:          G.dpr ,
      opacity:{     type:"f"  , value: opacity      },
      glyphWidth:{  type:"f"  , value: glyphWidth   }, 
      glyphHeight:{ type:"f"  , value: glyphHeight  }, 
      glyphBelow:{  type:"f"  , value: glyphBelow   },
  
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



var ubuntuMono = {

  glyphWidth: 80.5,
  glyphHeight: 145,
  glyphBelow:   29,

  //char     x      y    w     h     xoffset   yoffset 
  "0"   : [ 1016 , 972 , 4   , 4   , -1.500  , 1.500   ], 
  "8"   : [ 1016 , 968 , 4   , 4   , -1.500  , 1.500   ], 
  "9"   : [ 1016 , 964 , 4   , 4   , -1.500  , 1.500   ], 
  "13"  : [ 1016 , 960 , 4   , 4   , -1.500  , 1.500   ], 
  "29"  : [ 1016 , 956 , 4   , 4   , -1.500  , 1.500   ], 
  "32"  : [ 1016 , 952 , 4   , 4   , -1.500  , 1.500   ], 
  "33"  : [ 719  , 0   , 25  , 105 , 27.625  , 101.188 ], 
  "34"  : [ 745  , 966 , 42  , 44  , 19.250  , 110.875 ], 
  "35"  : [ 745  , 631 , 75  , 103 , 2.875   , 101.188 ], 
  "36"  : [ 271  , 0   , 67  , 131 , 7.188   , 113.125 ], 
  "37"  : [ 458  , 0   , 78  , 107 , 1.375   , 103.313 ], 
  "38"  : [ 609  , 421 , 75  , 107 , 3.500   , 103.500 ], 
  "39"  : [ 787  , 966 , 17  , 47  , 31.813  , 110.875 ], 
  "40"  : [ 538  , 780 , 48  , 143 , 16.688  , 114.438 ], 
  "41"  : [ 538  , 637 , 48  , 143 , 16.688  , 114.438 ], 
  "42"  : [ 678  , 961 , 66  , 63  , 7.688   , 101.188 ], 
  "43"  : [ 734  , 107 , 69  , 74  , 5.875   , 79.125  ], 
  "44"  : [ 771  , 27  , 36  , 49  , 22.438  , 23.875  ], 
  "45"  : [ 538  , 1005, 39  , 16  , 21.063  , 48.688  ], 
  "46"  : [ 842  , 990 , 27  , 28  , 27.000  , 24.188  ], 
  "47"  : [ 209  , 0   , 62  , 143 , 9.563   , 114.125 ], 
  "48"  : [ 609  , 751 , 69  , 108 , 5.875   , 103.500 ], 
  "49"  : [ 664  , 210 , 62  , 103 , 10.500  , 101.188 ], 
  "50"  : [ 884  , 313 , 66  , 106 , 7.688   , 103.500 ], 
  "51"  : [ 751  , 313 , 65  , 108 , 7.938   , 103.500 ], 
  "52"  : [ 944  , 734 , 73  , 103 , 4.313   , 101.188 ], 
  "53"  : [ 458  , 726 , 64  , 105 , 9.063   , 101.188 ], 
  "54"  : [ 891  , 421 , 67  , 106 , 7.188   , 101.563 ], 
  "55"  : [ 538  , 534 , 67  , 103 , 8.625   , 101.250 ], 
  "56"  : [ 609  , 859 , 68  , 108 , 6.688   , 103.500 ], 
  "57"  : [ 678  , 855 , 67  , 106 , 6.688   , 103.438 ], 
  "58"  : [ 744  , 0   , 27  , 80  , 27.000  , 76.188  ], 
  "59"  : [ 988  , 107 , 36  , 101 , 18.625  , 76.188  ], 
  "60"  : [ 877  , 955 , 69  , 68  , 6.375   , 74.625  ], 
  "61"  : [ 609  , 967 , 69  , 46  , 5.875   , 64.813  ], 
  "62"  : [ 947  , 952 , 69  , 68  , 6.375   , 74.625  ], 
  "63"  : [ 536  , 0   , 55  , 107 , 13.313  , 103.438 ], 
  "64"  : [ 75   , 0   , 72  , 127 , 4.938   , 103.438 ], 
  "65"  : [ 458  , 107 , 81  , 103 , -0.063  , 101.188 ], 
  "66"  : [ 684  , 313 , 67  , 105 , 7.188   , 102.000 ], 
  "67"  : [ 877  , 847 , 70  , 108 , 5.875   , 103.500 ], 
  "68"  : [ 684  , 421 , 69  , 105 , 7.188   , 102.188 ], 
  "69"  : [ 538  , 210 , 63  , 103 , 13.125  , 101.188 ], 
  "70"  : [ 963  , 631 , 60  , 103 , 13.125  , 101.188 ], 
  "71"  : [ 609  , 643 , 69  , 108 , 5.875   , 103.500 ], 
  "72"  : [ 895  , 528 , 70  , 103 , 5.750   , 101.188 ], 
  "73"  : [ 965  , 528 , 55  , 103 , 12.813  , 101.188 ], 
  "74"  : [ 458  , 831 , 62  , 105 , 7.188   , 101.188 ], 
  "75"  : [ 820  , 631 , 72  , 103 , 8.813   , 101.188 ], 
  "76"  : [ 601  , 210 , 63  , 103 , 13.125  , 101.188 ], 
  "77"  : [ 825  , 528 , 70  , 103 , 5.438   , 101.188 ], 
  "78"  : [ 458  , 416 , 66  , 103 , 7.375   , 101.188 ], 
  "79"  : [ 609  , 313 , 75  , 108 , 3.188   , 103.500 ], 
  "80"  : [ 458  , 622 , 65  , 104 , 10.250  , 102.000 ], 
  "81"  : [ 0    , 0   , 75  , 132 , 3.188   , 103.313 ], 
  "82"  : [ 822  , 421 , 69  , 104 , 7.375   , 102.000 ], 
  "83"  : [ 678  , 747 , 66  , 108 , 7.313   , 103.500 ], 
  "84"  : [ 892  , 631 , 71  , 103 , 4.750   , 101.188 ], 
  "85"  : [ 753  , 421 , 69  , 105 , 6.250   , 101.250 ], 
  "86"  : [ 458  , 313 , 80  , 103 , 0.563   , 101.188 ], 
  "87"  : [ 754  , 528 , 71  , 103 , 5.438   , 101.188 ], 
  "88"  : [ 678  , 528 , 76  , 103 , 2.500   , 101.188 ], 
  "89"  : [ 458  , 210 , 80  , 103 , 0.563   , 101.188 ], 
  "90"  : [ 816  , 313 , 68  , 103 , 7.188   , 101.188 ], 
  "91"  : [ 398  , 143 , 42  , 143 , 21.500  , 114.125 ], 
  "92"  : [ 147  , 0   , 62  , 143 , 9.750   , 114.125 ], 
  "93"  : [ 398  , 286 , 42  , 143 , 17.438  , 114.125 ], 
  "94"  : [ 648  , 0   , 71  , 58  , 4.938   , 101.188 ], 
  "95"  : [ 807  , 27  , 81  , 15  , -0.188  , -13.813 ], 
  "96"  : [ 811  , 990 , 31  , 32  , 24.688  , 113.125 ], 
  "97"  : [ 607  , 107 , 64  , 82  , 7.813   , 78.000  ], 
  "98"  : [ 745  , 734 , 66  , 117 , 9.938   , 113.125 ], 
  "99"  : [ 539  , 107 , 68  , 82  , 6.375   , 78.063  ], 
  "100" : [ 811  , 734 , 66  , 117 , 4.938   , 113.125 ], 
  "101" : [ 947  , 210 , 70  , 82  , 4.938   , 78.000  ], 
  "102" : [ 538  , 313 , 71  , 115 , 8.625   , 113.125 ], 
  "103" : [ 958  , 421 , 66  , 107 , 4.938   , 78.000  ], 
  "104" : [ 745  , 851 , 62  , 115 , 9.938   , 113.125 ], 
  "105" : [ 877  , 734 , 67  , 113 , 7.188   , 109.438 ], 
  "106" : [ 811  , 851 , 54  , 139 , 9.938   , 109.375 ], 
  "107" : [ 609  , 528 , 69  , 115 , 9.938   , 113.188 ], 
  "108" : [ 678  , 631 , 67  , 116 , 7.188   , 112.313 ], 
  "109" : [ 875  , 210 , 72  , 80  , 5.125   , 77.813  ], 
  "110" : [ 865  , 107 , 62  , 80  , 9.938   , 77.875  ], 
  "111" : [ 538  , 923 , 71  , 82  , 4.938   , 78.063  ], 
  "112" : [ 950  , 313 , 66  , 106 , 9.938   , 77.875  ], 
  "113" : [ 538  , 428 , 66  , 106 , 4.938   , 77.875  ], 
  "114" : [ 591  , 0   , 57  , 80  , 15.750  , 77.875  ], 
  "115" : [ 671  , 107 , 63  , 82  , 9.063   , 78.000  ], 
  "116" : [ 458  , 519 , 66  , 103 , 8.625   , 99.500  ], 
  "117" : [ 803  , 107 , 62  , 80  , 9.438   , 76.250  ], 
  "118" : [ 801  , 210 , 74  , 78  , 3.313   , 76.250  ], 
  "119" : [ 458  , 936 , 78  , 78  , 1.500   , 76.250  ], 
  "120" : [ 726  , 210 , 75  , 78  , 3.125   , 76.250  ], 
  "121" : [ 947  , 847 , 72  , 105 , 4.250   , 76.250  ], 
  "122" : [ 927  , 107 , 61  , 78  , 10.250  , 76.250  ], 
  "123" : [ 398  , 0   , 60  , 143 , 11.188  , 114.125 ], 
  "124" : [ 586  , 780 , 16  , 143 , 32.625  , 114.063 ], 
  "125" : [ 338  , 0   , 60  , 143 , 10.250  , 114.125 ], 
  "126" : [ 771  , 0   , 72  , 27  , 4.438   , 55.813  ], 

}
