function Sunflower( title , mesh , extraParams ){

  var title = title || 'Cloth';
  var mesh = mesh || new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ,  127 , 127) );

  //mesh.position.x = 10;
  mesh.updateMatrix();
  var geometry = new THREE.Geometry();


  geometry.merge( mesh.geometry , mesh.matrix );
  
 // var geometry =  || new THREE.BoxGeometry( 1000 , 1000 , 1000 , 80 , 80 , 80 );
 

  var v = geometry.vertices.length;

  var vSize = Math.ceil( Math.sqrt( v ) );
  var hSize = .5 / vSize;
  var iSize = 1. / vSize;



  //console.log( shaders.simulationShaders.n2 );
 
  var s = G.shaders.setValue( G.shaders.simulationShaders.cloth , 'SIZE'  , vSize+"." );
      s = G.shaders.setValue( s , 'HSIZE' , hSize+"" );
      s = G.shaders.setValue( s , 'ISIZE' , iSize+"" );
 
  var vs = G.shaders.setValue( G.shaders.vertexShaders.cloth , 'SIZE'  , vSize+"." );
      vs = G.shaders.setValue( vs , 'HSIZE' , hSize+"" );
      vs = G.shaders.setValue( vs , 'ISIZE' , iSize+"" );
  var dir =new THREE.Vector3( 1. , 0 , 0. )

 
  var params =  {

    vs: vs,
    fs: G.shaders.fragmentShaders.cloth,
    ss: s,

    //blending: THREE.AdditiveBlending,
    //transparent: true,
    //depthWrite: false,

    geometry: geometry,


    dT: G.dT,
    time: G.time,

    soul:{
      
      windSpeed:     { type:"f" , value: 1.9  , constraints:[ 0 ,2] },

      windDepth:     { type:"f" , value: 1.4  , constraints:[ 0 , 10] },
      windHeight:     { type:"f" , value: 1.8  , constraints:[ 0 , 10] },
      windDirection:      { type:"v3" ,value: dir  },
      dampening:          { type:"f" , value: .999  , constraints:[ .0 , .9999 ] },
      

      springLength:       { type:"f" , value: 1 / 127  , constraints:[ .01 ,.1 ] },
      springMultiplier:   { type:"f" , value: 10000. , constraints:[ 1000 ,10000 ] },
      //returnMultiplier:   { type:"f" , value: 1000. , constraints:[ .001 ,2000 ] },

      maxVel:             { type:"f" , value: .5   , constraints:[ .00001 , .01 ] },
      noiseSize:          { type:"f" , value: .3   , constraints:[ .001 , 1. ] },

      time:               G.timer,

      t_audio:            G.t_audio,

    },

    body:{
          
      t_audio:           G.t_audio,
      lightPos:{type:"v3" , value: new THREE.Vector3( 10 , 10 , 20 )},
      audioDisplacement: { type:"f" , value: 0   , constraints:[ 0 , .1 ] },
      texScale: { type:"f" , value: 10.   , constraints:[ 0 , 10 ] },

      normalScale: { type:"f" , value: 0.2   , constraints:[ 0 , 1. ] },
      t_normal: { type:"t" , value: G.TEXTURES["sand"] }, 
      t_matcap: { type:"t" , value: G.TEXTURES["matcapMetal"] },//matcapTexture}, 
    },

  }



  //Passing through extra params
 
  /*var extraParams = extraParams || {};
 
  if( extraParams.soul ){
    var s = extraParams.soul;
    for( var propt in s ){
      params.soul[propt] = s[propt];
    }
  }

  if( extraParams.body ){
    var s = extraParams.body;
    for( var propt in s ){
      params.body[propt] = s[propt];
    }
  }


  if( extraParams.vs ) params.vs = extraParams.vs;
  if( extraParams.fs ) params.fs = extraParams.fs;

  var gem = new GEM( params );
 
  var gHolder = document.createElement('div');

  var tHolder = document.createElement('h1');

  tHolder.innerHTML =''+ title;

  gHolder.appendChild( tHolder );
  var guis = document.getElementById( 'GUI' );

  guis.appendChild( gHolder );

  $(tHolder).click(function(){
    this.toggle();
    if( this.active ){
      this.tHolder.className = "active";
    }else{
      this.tHolder.className = "";
    }
  }.bind( gem ));


  $(tHolder).hover(function(){
    this.gui.gui.open();
  }.bind( gem ));

  $(gHolder).hover(function(){},function(){
    this.gui.gui.close();
  }.bind(gem));

  gem.tHolder = tHolder;

  gem.gui = new GUI( params , {
   domElement: gHolder 
  });*/

  var gem = new GEM( params );


  gem.soul.reset( gem.t_og.value );
 
  gem.body.scale.multiplyScalar( 1000 ); 
  return gem;

}
