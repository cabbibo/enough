function CoralBase( coral ){

  this.coral = coral;
  this.coralPosition = coral.position;
  this.coralData = coral.data;

 // var geo = new THREE.PlaneBufferGeometry( 2000 , 2000 , 100 , 100 );
  var geo = this.createGeometry(  150 , 20 , 50 );


    
  this.uniforms = {

    coral: { type: "v3" , value:this.coralPosition },
    coralData: { type: "v4" , value:this.coralData },
    mani: { type:"v3" , value:G.mani.position }

  }


//  console.log( G.shaders.vs.coralBase );
  
  var mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader:  G.shaders.vs.coralBase,
    fragmentShader: G.shaders.fs.coralBase,
    //side: THREE.DoubleSide
  });


  this.body = new THREE.Mesh( geo , mat );

 // this.body = new THREE.Mesh( geo , mat );
  //this.body.rotation.x = - Math.PI /2;

  this.body.position.y = -500;

}

CoralBase.prototype.createGeometry = function( radius , radialSegments , tanSegments ){

  var totalVerts=  radialSegments * ( tanSegments-1 ) * 3 * 2;
  var positions = new Float32Array( totalVerts * 3 );

  var geo = new THREE.BufferGeometry();
  var innerRadius = 0;
  var outerRadius = radius; 
  for( var  i = 0; i < radialSegments; i ++ ){

     for( var j = 0; j < (tanSegments-1) ; j++ ){
  
        var rIn   = innerRadius + ( outerRadius - innerRadius ) * ( j / tanSegments);
        var rOut  = innerRadius + ( outerRadius - innerRadius ) *  ((j+1) / tanSegments);
        var tDown = (i / radialSegments ) * 2 * Math.PI;
        var tUp   = (((i+1)%radialSegments) / radialSegments ) * 2 * Math.PI;


        var x1 = rIn * Math.cos( tDown );
        var z1 = rIn * Math.sin( tDown );

        var x2 = rOut * Math.cos( tDown );
        var z2 = rOut * Math.sin( tDown );

        var x3 = rOut * Math.cos( tUp );
        var z3 = rOut * Math.sin( tUp );

        var x4 = rIn * Math.cos( tUp );
        var z4 = rIn * Math.sin( tUp );

        var index = ((( tanSegments-1) * i ) + j) * 3  * 2 * 3

        
        positions[ index + 0 ] = x4;
        positions[ index + 1 ] = rIn / radius;
        positions[ index + 2 ] = z4;

        positions[ index + 3 ] = x2;
        positions[ index + 4 ] = rOut / radius;
        positions[ index + 5 ] = z2;

        positions[ index + 6 ] = x1;
        positions[ index + 7 ] = rIn / radius;
        positions[ index + 8 ] = z1;

        positions[ index + 9  ] = x3;
        positions[ index + 10 ] = rOut / radius;
        positions[ index + 11 ] = z3;

        positions[ index + 12 ] = x2;
        positions[ index + 13 ] = rOut / radius;
        positions[ index + 14 ] = z2;

        positions[ index + 15 ] = x4;
        positions[ index + 16 ] = rIn / radius;
        positions[ index + 17 ] = z4;

      }

   }



  var aPos = new THREE.BufferAttribute( positions , 3 ); 
  geo.addAttribute( 'position', aPos );

  return geo;



}
