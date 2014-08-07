THREE.renderTiledScene = function( renderer, scene , camera, numCols, numRows , title ){
  
  var numCols           = numCols || 3;
  var numRows           = numRows || 3;
  var title             = title   || 'TiledImage';

  var totalWidth        = renderer.domElement.width  * numCols;
  var totalHeight       = renderer.domElement.height * numRows;

  G.dpr.value *= numCols;

  // Creating a canvas to stitch all the images in.
  // This is the canvas which will be our final output image
  var stitchedCanvas         = document.createElement( 'canvas' );

  // Setting up the stitchedCanvas so it will be the size of
  // our total image
  stitchedCanvas.width   = totalWidth  ;
  stitchedCanvas.height  = totalHeight ;

  // scc = stitchedCanvasContext
  // used for drawing our new data
  var scc = stitchedCanvas.getContext( '2d' );


  // Sets up an array that will hold all the different cameras
  // That while write every 'tile'
  var cameras = [];


   // setting up cameras
  for( var i = 0 ; i < numCols; i++ ){
  
    for( var j = 0; j < numRows; j++ ){

      // Mimics the camera passed into the tileRenderer
      var cam = new THREE.PerspectiveCamera(
        camera.fov,
        camera.aspect,
        camera.near,
        camera.far
      )

      camera.add( cam );

      cam.setViewOffset(
        totalWidth ,
        totalHeight ,
        renderer.domElement.width  * i,
        renderer.domElement.height * j,
        renderer.domElement.width      ,
        renderer.domElement.height    
      );

      cameras.push( cam );

    }

  }

  renderer.render( scene ,camera );
    
  //console logs the regular image for comparison
  imgData = renderer.domElement.toDataURL();  

  var a = document.createElement('a');
  a.href = imgData;
  a.download = title + "_full.png";
  a.click();
  
  var imageData = [];

  var drawn = 0;

  for( var i = 0; i < cameras.length; i++ ){

    var x = Math.floor( i / numCols );
    var y = i % numRows;

    renderer.render( scene , cameras[i] );

    var info = {

      scc: scc,
      x: x,
      y: y,
      renderer: renderer

    }

    
    //var fTitle = title + "_"+x+"_"+y+".png";
    //renderer.domElement.mozGetAsFile(title + "_"+x+"_"+y+".png");
    renderer.domElement.toBlob( function( blob ){

    //saveAs(blob, this)
    //
  
      var url = URL.createObjectURL( blob );

      var image = document.createElement('img');
      image.src = url;

      document.body.appendChild( image );

      image.onload = function(){
        
        this.scc.drawImage( 
          image,
          this.renderer.domElement.width * this.x , 
          this.renderer.domElement.height * this.y     
        );


        drawn ++;

        if( drawn === cameras.length ){

          document.body.appendChild( stitchedCanvas );
          stitchedCanvas.toBlob( function( blob ){
            saveAs( blob , title + ".png" );
          });


        }

      }.bind( this );


    }.bind( info ));
    
   // imgData = renderer.domElement.toDataURL();      

    //imageData.push( imgData );

  
  }
  return imageData;

}

