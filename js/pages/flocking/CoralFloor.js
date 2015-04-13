function CoralFloor( coral ){

  this.coral = coral;
  this.coralPositions = [];
  this.coralData = [];
  
  for( var i = 0; i < this.coral.length; i++ ){
    this.coralPositions.push( this.coral[i].position );
    this.coralData.push( this.coral[i].data );
  }
  

 // var geo = new THREE.PlaneBufferGeometry( 2000 , 2000 , 100 , 100 );
  var geo = this.createGeometry( 100 , 200 , 200 );
    
  this.uniforms = {

    coral: { type: "v3v" , value:this.coralPositions },
    coralData: { type: "v4v" , value:this.coralData },
    mani: { type:"v3" , value:G.mani.position }

  }

  var fs = G.shaders.setValue( 
    G.shaders.fs.coralFloor, 
    'SIZE' ,
    this.coral.length  
  ); 

  var vs = G.shaders.setValue( 
    G.shaders.vs.coralFloor, 
    'SIZE' ,
    this.coral.length  
  ); 

  var mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    side: THREE.DoubleSide
  });


  this.body = new THREE.Mesh( geo , mat );
  //this.body.rotation.x = - Math.PI /2;

  this.body.position.y = -500;

}

CoralFloor.prototype.createGeometry = function( radius  , radialSegments , tanSegments ){

  var totalVerts=  radialSegments * tanSegments * 3 * 2;
  var positions = new Float32Array( totalVerts * 3 );

  var innerRadius = 0;
  var outRadius = radius;

  var geo = new THREE.BufferGeometry();

  for( var  i = 0; i < radialSegments; i ++ ){

     for( var j = 0; j < tanSegments ; j++ ){
  
        var rIn   = innerRadius + ( outerRadius - innerRadius ) *  j / tanSegments;
        var rOut  = innerRadius + ( outerRadius - innerRadius ) *  (j+1) / tanSegments;
        var tDown = (i / radialSegments ) * 2 * Math.PI;
        var tUp   = (i / radialSegments ) * 2 * Math.PI;


        var x1 = rIn * Math.cos( tDown );
        var z1 = rIn * Math.sin( tDown );

        var x2 = rOut * Math.cos( tDown );
        var z2 = rOut * Math.sin( tDown );

        var x3 = rOut * Math.cos( tUp );
        var z3 = rOut * Math.sin( tUp );

        var x4 = rIn * Math.cos( tUp );
        var z4 = rIn * Math.sin( tUp );

        var index = (( tanSegments * i ) + j) * 3  * 2 * 3
        
        positions[ index + 0 ] = x1;
        positions[ index + 1 ] = rIn / outerRAdi;
        positions[ index + 2 ] = z1;

        positions[ index + 3 ] = x2;
        positions[ index + 4 ] = 0;
        positions[ index + 5 ] = z2;

        positions[ index + 6 ] = x3;
        positions[ index + 7 ] = 0;
        positions[ index + 8 ] = z3;

        positions[ index + 9  ] = x2;
        positions[ index + 10 ] = 0;
        positions[ index + 11 ] = z2;

        positions[ index + 12 ] = x3;
        positions[ index + 13 ] = 0;
        positions[ index + 14 ] = z3;

        positions[ index + 15 ] = x4;
        positions[ index + 16 ] = 0;
        positions[ index + 17 ] = z4;

      }

   }



  var aPos = new THREE.BufferAttribute( positions , 3 ); 
  geo.addAttribute( 'position', aPos );

  return geo;



}
