function TextCreator( totalSize ){


    this.params = {
   
      size:                 totalSize ,
      type:                    "20pt GeoSans", 
      color:    "rgba( 255 , 255 , 255 , 0.95 )",
      crispness:                            5.,
      margin:               totalSize / 10,  
      square:                               false


    }

    this.font = "GeoSans";
    
}

 TextCreator.prototype.createTexture = function( string , params ){

   
    var canvas  = document.createElement('canvas');

    /*canvas.style.position = 'fixed';
    canvas.style.zIndex = '999';
    document.body.appendChild( canvas );*/

    var ctx     = canvas.getContext( '2d' ); 
    var params  =  {
      
      color:      this.params.color,
      size:       this.params.size,
      crispness:  this.params.crispness,
      square:     this.params.square,
      margin:     this.params.size / 2

    }


    var size   = params.size;
    var color  = params.color;

    // This is the factor the canvas will be scaled 
    // up by, which basically equates to 'crispness'
    var scaleFactor = params.crispness;

    // To make sure that the text is crisp,
    // need to draw it large and scale down
    var fullSize = scaleFactor * size;


    // If you want a margin, you can define it in the params
    if( !params.margin )
      margin = size*.5;
    else
      margin = params.margin;

    // Gets how wide the tesxt is
    ctx.font      = fullSize + "pt " + this.font;
    var textWidth = ctx.measureText(string).width;

    // Can choose to make a square texture if we want to 
    if( !params.square ){
    
      canvas.width  = textWidth + margin;
      canvas.height = fullSize  + margin;

    }else{

      canvas.width  = textWidth + margin;
      canvas.height = textWidth + margin;

    }

    ctx.font      = fullSize  + "pt " + this.font;

    // Gives us a background instead of transparent background
    if( params.backgroundColor ) {
        ctx.fillStyle = params.backgroundColor;
        ctx.fillRect(
            canvas.width / 2 - textWidth / 2 - margin / 2, 
            canvas.height / 2 - fullSize / 2 - + margin / 2, 
            textWidth + margin, 
            fullSize + margin
        );
    }

    // Makes sure our text is centered
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(string, canvas.width / 2, canvas.height / 2);

    // Creates a texture
    var texture = new THREE.Texture(canvas);

    texture.scaledWidth  = canvas.width;
    texture.scaledHeight = canvas.height;

    if( texture.scaledWidth > texture.scaleHeight ){
      texture.scaledWidth  /= texture.scaledWidth;
      texture.scaledHeight /= texture.scaledWidth;
    }else{
      texture.scaledWidth  /= texture.scaledHeight;
      texture.scaledHeight /= texture.scaledHeight;
    }
    

    texture.needsUpdate = true;

    return texture;

  }

  TextCreator.prototype.createMesh = function( string , par ){

    var params  =  {
      
      color:      par.color || this.params.color,
      size:       par.size || this.params.size ,
      crispness:  par.crispness || this.params.crispness,
      margin:     par.margin    || this.params.margin
          
    } 


    var texture = this.createTexture( string , params );

    var material = new THREE.MeshBasicMaterial({
      map:          texture,
      transparent:  true,
      side:         THREE.DoubleSide,
      blending:     THREE.AdditiveBlending,
      depthwrite:   false,
      opacity:      1.,
      color:        0xffffFF
    });

    var geo = new THREE.PlaneGeometry( 
      texture.scaledWidth  / params.crispness, 
      texture.scaledHeight / params.crispness
    );

    var mesh = new THREE.Mesh(geo, material);
    mesh.scale.multiplyScalar( params.size );
    mesh.scaledWidth = texture.scaledWidth;
    mesh.scaledHeight = texture.scaledHeight;

    mesh.totalWidth = mesh.scaledWidth * params.size;
    mesh.totalHeight = mesh.scaledHeight * params.size;
   
    // Assigning the texture
    mesh.string = string;

    return mesh;

  }



