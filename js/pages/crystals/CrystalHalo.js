function CrystalHalo( height , baseData , audioTexture){

  this.geometry = this.createGeometry( height , baseData );

  this.t_audio = audioTexture;
  this.uniforms = {



  }

  this.material = this.createMaterial();

  this.mesh = new THREE.Line( this.geometry , this.material , THREE.LinePieces );

}

CrystalHalo.prototype.createMaterial = function(){

  this.uniforms = {
    t_audio: this.t_audio
  }

  var material = new THREE.ShaderMaterial({

    uniforms: this.uniforms,
    vertexShader: G.shaders.vertexShaders.crystalHalo,
    fragmentShader: G.shaders.fragmentShaders.crystalHalo,
    linewidth: 3

  });

  return material;

}

CrystalHalo.prototype.createGeometry = function( height , baseData ){

  var geometry = new THREE.BufferGeometry();

  var numOfMain = 3;

  var totalCircles = numOfMain + 5;//Math.floor( Math.random() * 6 ) + 4 + numOfMain;
  var vertsPerCircle = 1000;

  var totalVerts = totalCircles * vertsPerCircle;
  var total = totalVerts * 3 * 2;
  var uvTot = totalVerts * 2 * 2;

  var aPos =  new THREE.BufferAttribute(  new Float32Array( total ), 3  );
  var aUv =  new THREE.BufferAttribute(  new Float32Array( uvTot ), 2  );
  geometry.addAttribute( 'position', aPos ); 
  geometry.addAttribute( 'uv' , aUv);

  var positions = geometry.getAttribute( 'position' ).array;
  var uvs = geometry.getAttribute( 'uv' ).array;


  // Main
  for( var i = 0; i < numOfMain; i++ ){

    var newH =  -height - (20 * i ) 
    var loc = new THREE.Vector3( 0 , 0 ,  newH * 1.5 );

    var points = this.createCircle( loc ,  (3000 * ( numOfMain - i )) / newH  , vertsPerCircle );

    var circle = i / totalCircles;
    var circleN = (i+1)/totalCircles;

    for( var j = 0; j < points.length; j++ ){

      var vert = ( j + (i) * vertsPerCircle );
      var index = vert * 3 * 2;
      var iUV =  vert * 2 * 2;

      var up = j + 1;
      if( up == points.length ) up = 0;

      var vertUp = ( up + (i) * vertsPerCircle );
      

      positions[ index + 0 ] = points[j].x;
      positions[ index + 1 ] = points[j].y;
      positions[ index + 2 ] = points[j].z;

      positions[ index + 3 ] = points[up].x;
      positions[ index + 4 ] = points[up].y;
      positions[ index + 5 ] = points[up].z;

      var t = (j / points.length) * 2 * Math.PI;
      var tUp = (up / points.length) * 2 * Math.PI;
      
      var a = (Math.cos( t * 4 ) + 1 / 2);
      var uv = circle * a + circleN * (1.-a);
      var a = (Math.cos( tUp * 4 ) + 1 / 2);
      var uvUp = circle * a + circleN * (1.-a);

      uvs[ iUV + 0 ]  = uv;//Math.random();//vert / totalVerts;  
      uvs[ iUV + 2 ]  = uvUp;//Math.random();//vertUp / totalVerts;  

    }


  }

  // Other Randos
  for( var i = 0; i < totalCircles-numOfMain; i++ ){

    var bd = baseData[i+1];
    var h = bd[1];

    var loc = new THREE.Vector3( bd[0][0] , bd[0][1] ,  h - 80  );

    var points = this.createCircle( loc ,  2000 / h , vertsPerCircle );

    var circle = (i+numOfMain) / totalCircles;
    var circleN = (i+1+numOfMain) / totalCircles;

    for( var j = 0; j < points.length; j++ ){

      var vert = ( j + (i+numOfMain) * vertsPerCircle );
      var index = vert * 3 * 2;
      var iUV =  vert * 2 * 2;


      var up = j + 1;
      if( up == points.length ) up = 0;

      var vertUp = ( up + (i+numOfMain) * vertsPerCircle );

      positions[ index + 0 ] = points[j].x;
      positions[ index + 1 ] = points[j].y;
      positions[ index + 2 ] = points[j].z;

      positions[ index + 3 ] = points[up].x;
      positions[ index + 4 ] = points[up].y;
      positions[ index + 5 ] = points[up].z;


      var t = (j / points.length) * 2 * Math.PI;
      var tUp = (up / points.length) * 2 * Math.PI;


      var a = (Math.cos( t * 4 ) + 1 / 2);
      var uv = circle * a + circleN * (1.-a);
      var a = (Math.cos( tUp * 4 ) + 1 / 2);
      var uvUp = circle * a + circleN * (1.-a);

      
      uvs[ iUV + 0 ]  = uv;// Math.random();//vert / totalVerts;  
      uvs[ iUV + 2 ]  = uvUp;//Math.random();//vertUp / totalVerts;  






    }


  }

  return geometry;


}

CrystalHalo.prototype.createCircle = function( location , radius , numOf ){

  var points = [];

  for( var i = 0; i < numOf; i++ ){

    var p = i / numOf;
    var t = p * 2 * Math.PI;

    var l = location.clone();

    var x = Math.cos( t ) * radius;
    var y = Math.sin( t ) * radius;
    
    var newP = new THREE.Vector3( x , y , 0 );
    l.add( newP );

    points.push( l );

  }

  return points;

}




