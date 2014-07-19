
  function UserAudio( controller , params ){
 

    this.beginLoad();

    this.controller = controller;
    this.params = _.defaults( params || {}, {
        
      fbc:            128,
      texture:       true,

    });

    this.analyser = this.controller.ctx.createAnalyser();
    this.filter   = this.controller.ctx.createBiquadFilter();
    this.gain     = this.controller.ctx.createGain();

    this.analyser.frequencyBinCount = this.params.fbc;
    this.analyser.array = new Uint8Array( this.params.fbc );



    this.controller = controller;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var constraints = {
      audio: true,
    };

  

    navigator.getUserMedia( constraints , this.successCallback.bind( this ) , this.errorCallback.bind( this ) );


       
  }
  
  UserAudio.prototype.successCallback = function( stream ) {
   
   
    window.stream = stream; // stream available to console

    this.source = this.controller.ctx.createMediaStreamSource( stream );

    this.filterOn = false;
    this.source.connect(                   this.analyser );
    this.analyser.connect(                     this.gain );
    this.gain.connect(        this.controller.gain );

    this.onStreamCreated();

    this.endLoad();

  }


  

  UserAudio.prototype.beginLoad = function(){};
  UserAudio.prototype.endLoad = function(){};
  UserAudio.prototype.onStreamCreated = function(){};

  UserAudio.prototype.errorCallback = function (error){
    console.log("navigator.getUserMedia error: ", error);
  }

  UserAudio.prototype.turnOffFilter = function(){
    this.filterOn = false;
    this.filter.disconnect(0);
    this.source.disconnect( 0 );
    this.source.connect( this.gain );
  }

  UserAudio.prototype.turnOnFilter = function(){
    this.filterOn = true;
    this.source.disconnect( 0 );
    this.source.connect( this.filter );
    this.filter.connect( this.gain );
  }

  UserAudio.prototype._update = function(){

   
    this.update();

  }

  UserAudio.prototype.update = function(){

  }

