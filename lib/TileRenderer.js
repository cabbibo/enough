THREE.renderTiledScene = function( renderer, scene , camera, numCols, numRows , title , callback ){
  
  var numCols           = numCols   || 3;
  var numRows           = numRows   || 3;
  var title             = title     || 'TiledImage';
  var callback          = callback  ||  function(){ console.log('done') }

  var totalWidth        = renderer.domElement.width  * numCols;
  var totalHeight       = renderer.domElement.height * numRows;

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
  var imgData = renderer.domElement.toDataURL();  

  var a = document.createElement('a');
  a.href = imgData;
  a.download = title + "_full.png";
  a.click();
  
  var imageData = [];

  for( var i = 0; i < cameras.length; i++ ){

    var x = Math.floor( i / numCols );
    var y = i % numRows;

    var params = {};
    params.x          = x;
    params.y          = y;
    params.renderer   = renderer;
    params.camera     = cameras[i];
    params.scene      = scene;
    params.imagedData = imageData;
    params.title      = title;

    window.setTimeout( function(){
      
      this.renderer.render( this.scene , this.camera );
      
      var imgData = this.renderer.domElement.toDataURL();      

      //this.imageData.push( imgData );

      var a = document.createElement('a');

      a.href = imgData;

      a.download = this.title + "_"+this.x+"_"+this.y+".png";
      a.click();

    }.bind( params ) , i * 3000 );

  }

  return imageData;

}

