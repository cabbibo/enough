function Section( id , page , params ){

  this.page = page;
  this.id = id;

  this.prevSection = undefined;
  this.nextSection = undefined;

  this.active  = false;
  this.current = false; 

  this.params = _.defaults(params || {} , {

    offset: G.pageTurnerOffset,
    transitionTime: "endOfLoop",
    textDeathTime: 3000,

    cameraPosition:   G.position.relative,
    lookPosition:     new THREE.Vector3(),

    transitionIn:     function(){},
    start:            function(){},
    transitionOut:    function(){},
    end:              function(){},
    transitioningOut: function(){},
    transitioningIn:  function(){},
    currentUpdate:    function(){},
    activeUpdate:     function(){},
    
  });


  //bubblin up dem params
  for( var propt in this.params ){
    this[propt] = this.params[propt];
  }

  if( this.textChunk ){
    this.text = new PhysicsText( this.textChunk );
  }



   this.frameUniforms = {

    opacity: { type:"f" , value:0 },
    scale: { type:"v2" , value:G.windowSize},
    width:{type:"f" , value:.01},
    t_audio: G.t_audio

  }


  var geo = new THREE.PlaneBufferGeometry(1,1);
  var mat = new THREE.ShaderMaterial({
    uniforms: this.frameUniforms,
    vertexShader: G.shaders.vs.frame,
    fragmentShader: G.shaders.fs.frame,

    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
    transparent: true,
  });


 /* var mat = new THREE.MeshBasicMaterial({
    color:0xffffff,
   // side: THREE.DoubleSide
    wireframe: true,
    depthWrite: false,
    transparent: true,
    opacity: 1.
  });*/
  this.frame = new THREE.Mesh( geo , mat );

  this.page.scene.add( this.frame );

  this.frame.position.copy( this.params.cameraPosition );
  this.frame.scale.x = G.windowSize.x - 200;
  this.frame.scale.y = G.windowSize.y - 200;
  this.frame.lookAt( this.params.lookPosition );
  G.v1.copy( this.params.cameraPosition );
  G.v1.sub( this.params.lookPosition );
  G.v1.normalize();
  G.v1.multiplyScalar( -1000 );
  this.frame.position.add( G.v1 );



}



Section.prototype._transitionIn = function(){

  if( !this.prevSection ){
    this.active = true;
    this._start();
  }else{
    this.active = true;
    this.transitionIn();
  }

}

Section.prototype._start = function(){
 
  this.start();

  if( this.text ){
    console.log('ACTIVATINGS');
    this.text.activate();
  }

  this.current = true;

  if( this.nextSection ){  

    var callback = this.nextSection.createTransitionInCallback();

    var mesh  = this.page.createTurnerMesh( this.offset , callback );
    this.page.scene.add( mesh );

  }else{

    this.page.endMesh.add( this.page );

  }

}

Section.prototype._transitionOut = function(){
  
  if( this.text ){
    this.text.kill( this.textDeathTime );
  }
  this.current = false;
  this.transitionOut();

}


Section.prototype._transitioningOut = function(t){
  
  this.frameUniforms.opacity.value = 1-t;
  this.transitioningOut();

}

Section.prototype._transitioningIn = function(t){
  
  this.frameUniforms.opacity.value = t;
  this.transitioningIn();

}


Section.prototype._end = function(){

  this.active = false;
  this.end();

}


Section.prototype.createTransitionInCallback = function(){

  var callback = function(){
   
    this.prevSection._transitionOut();
    this._transitionIn();

    var transitionTime = this.params.transitionTime;

    if(  transitionTime == "endOfLoop" ){
      
      var percentTilEnd = 1 - this.page.looper.percentOfMeasure;
      
      // Making sure the transition is never toooooo quick
      if( percentTilEnd < .3 ){
        percentTilEnd += 1;
      }
      var timeTilEnd = percentTilEnd * this.page.looper.measureLength;

      transitionTime = (timeTilEnd-.01) * 1000;

    }

    //var lookAt = this.lookPosition || this.page.position;
    this.page.tweenCamera( this.cameraPosition , transitionTime ,  function(){

      this.prevSection._end();
      this._start();
        
    }.bind( this ),
    this.lookPosition,
    function( t ){
      
      this._transitioningIn( t );
      this.prevSection._transitioningOut( t );
      
    }.bind( this ));
    
  }.bind( this );

  return callback;



}

Section.prototype._update = function(){

  if( this.text ){
    this.text.update();
  }
  
  if( this.active ){
    this.activeUpdate();
  }

  if( this.current ){
    this.currentUpdate();
  }

}




