  
var failureTitleText = "Oh No!";
var failureDialog = "Your Browser is missing the following Technologies:";
var failureLink = 'System_Preferences.zip';
var failureImg = 'icons/albumCover.png';

function Loader(  params ){

    this.params = _.defaults( params || {}, {
      numberToLoad:   0,
      loadGif:        "img/icons/loadGif.gif",
      videoWidth: 500,
      videoHeight: 281,
      neededTech:     ['webGL','audio','mobile']
    });
    

    this.neededTech = this.params.neededTech;

    this.numberLoaded = 0;
    this.numberToLoad = this.params.numberToLoad;
    
    this.curtain = document.createElement('div');
    this.curtain.id = "curtain";

    //document.body.appendChild( this.curtain );


    this.loadBar = document.createElement('div');
    //this.loadBar.id = "loadBar";

    
    this.loadBar.style.position      = 'absolute';
    this.loadBar.style.top           = '50%';
    this.loadBar.style.height        = '1px';
    this.loadBar.style.width         = '10px';
    this.loadBar.style.background    = '#fff';



    this.loadInfo = document.createElement('div');
    this.loadInfo.id = 'loadInfo';

    this.curtain.appendChild( this.loadInfo );
    
    this.loadBarAddAmount = window.innerWidth / (this.numberToLoad+1);

    this.curtain.appendChild( this.loadBar );

    this.loadingGif     = document.createElement( 'img' );
    this.loadingGif.src = this.params.loadGif;
    this.loadingGif.id  = 'loadingGif';


    //this.OBJLoader = new THREE.OBJLoader();

    var curtainTemp = this.curtain;

    this.loadingGif.onload = function(){
   
      var margin = this.height + 10
      this.style.marginLeft  = "-" + this.width / 2 + "px";
      this.style.marginTop   = "-" + margin + "px";
      curtainTemp.appendChild( this );

    }

    //this.addStartButton();

    // Conditions are things that will check each time something 
    // new is loaded, allowing us to start putting together certain parts
    // of the program after a specific condition is made
    this.conditions = [];

    // Failures are things that the browser doesn't have.
    // If there are a non 0 number of failures the user will be alerted
    this.failures = [];



    this.detect();


  }

  Loader.prototype = {

    addLoadInfo: function(s){

      this.loadInfo.innerHTML = s;
    },

    addToLoadBar: function(){

      this.numberToLoad ++;

      this.updateLoadBar();

    },

    updateLoadBar: function(){


      this.loadBarAddAmount = window.innerWidth / (this.numberToLoad+1);


      var loadBarWidth = this.loadBarAddAmount * this.numberLoaded;
      this.loadBar.style.width = loadBarWidth + "px";

    },


    loadBarAdd: function(){
      
      var oldWidth = parseInt( this.loadBar.style.width );
      var newWidth = oldWidth + this.loadBarAddAmount;

      this.loadBar.style.width = newWidth + "px";

      this.numberLoaded ++;
    
      this.checkConditions();

      if( this.numberLoaded == this.numberToLoad ){
        this.onFinishedLoading();
      }

    },

    beginLoading: function(){this.addToLoadBar();},
    endLoading: function(){this.loadBarAdd();},
    addLoad: function(){this.addToLoadBar(); },
    onLoad: function(){this.loadBarAdd(); },
  
    // This will run through all of our saved conditions
    // and trigger whatever is necessary when we need to
    checkConditions: function(){

      for( var i = 0; i < this.conditions.length; i++ ){

        console.log( 'conditions checked' );
        var c = this.conditions[i];

        console.log( c );
        console.log( c[0] );
        if( c[0] ){
          c[1];
          this.conditions.splice( i , 1 );
        }

      }

    },

    addCondition: function( condition , callback ){
      this.conditions.push( [ condition , callback ] ); 
    },

    addFailureDialog: function(){

      this.failureDialog = document.createElement('div');
      this.failureDialog.id = "failureDialog";

      this.curtain.appendChild( this.failureDialog );

      var failureTitle = document.createElement('h3');
      failureTitle.id = "failureTitle";
      failureTitle.innerHTML = failureTitleText;

      //"But you can still watch the video version:";

      var failureReasons = document.createElement('h2');
      failureTitle.id = "failureReaons";
      failureReasons.innerHTML = failureDialog;
      //'Best viewed on Chrome. This project requires:';

      /**var failureReasons = document.createElement('p');
      failureReasons.id = "failureReasons";
      failureReasons.innerHTML = "Wom.bs requires:";*/

      this.failureList = document.createElement('p');
      this.failureList.id = "failureList";

      this.failureVideo = document.createElement('div');

      /*var w = window.innerWidth / 1.618;
      var string = '<iframe src="//player.vimeo.com/video/';
      string += failureVideo;
      string += '" width="'
      string += w;
      string += '" height="'
      string += w * .618;
      string += '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'*/

      this.failureLink = document.createElement( 'a' );
      this.failureLink.href = failureLink;
      this.failureLink.id = 'failureLink';
      this.failureImg = document.createElement( 'img' );
      this.failureImg.src = failureImg;
      this.failureImg.id = 'failureImg';
      this.failureLink.appendChild( this.failureImg );
      this.failureLink.style.background      
      this.failureDialog.appendChild( failureReasons );
      this.failureDialog.appendChild( this.failureList );

     // this.failureDialog.appendChild( failureDialog );
      this.failureDialog.appendChild( this.failureLink );
  

    },

    addFailure: function( failureName , failureLink ){

      
      if( !this.failureDialog )
        this.addFailureDialog();

      var failure = document.createElement('a');

      failure.href = failureLink;
      failure.target = '_blank';
      failure.innerHTML = "   " + failureName+ "   ";

      this.failureList.appendChild( failure );

      //var failureName = 
      this.failures.push( [failureName,failureLink] );

      var xHalf = this.failureDialog.clientWidth / 2;
      var yHalf = this.failureDialog.clientHeight / 2 ;

      var wHalf = window.innerWidth / 2;
      var hHalf = window.innerHeight / 2;

      var top = hHalf - yHalf;
      var left = wHalf - xHalf;

      console.log( top );
      if( top < 5 ) top = 5;
      if( left < 5 ) left = 5;

      this.failureDialog.style.top  = top + "px";
      this.failureDialog.style.left = left + "px";


      console.log( this.failureDialog.clientHeight );

    },

    onFinishedLoading: function(){
   
      var self = this;

      if( !this.failures.length ){
      
        //$("#startInfo").fadeIn(1000);
        // this.startInfo
        //this.onStart();
        //
        this.liftCurtain();
        
      }

    },

    addStartButton: function(){

      var info = "Move mouse to rotate <br/> Hold mouse to accelerate <br/> Catch critters to grow.<br/>"

      var button = document.createElement('a');
      button.id = "startButton";
      button.innerHTML = 'START';

      this.startInfo = document.createElement('div');
      this.startInfo.id = "startInfo";
      this.startInfo.innerHTML = info;

      this.startInfo.appendChild( button );

      
      this.curtain.appendChild( this.startInfo );


    },


    liftCurtain: function(){

      var self = this;
     
      this._onStart();
      $(this.curtain).fadeOut(300,function(){
       // self._onStart();
      });

    },

    _onStart: function(){

      if( !this.hasStarted ){
        this.onStart();
      }else{
        console.log( 'ALREADY STARTED!!!!' );
      }

      this.hasStarted = true;
   
           
    },

    onStart:function(){},



    setNavigator: function(){

      window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia || window.navigator.msGetUserMedia;

      //this.womb.navigator = window.navigator;

    },

    detect: function(){


      for(var i = 0 ; i < this.neededTech.length; i++ ){

        var tech = this.neededTech[i];
        if( tech == 'webGL' )
          this.detectWebGL();
        else if( tech == 'audio' )
          this.detectWebAudioAPI();
        else if( tech == 'mobile' )
          this.detectMobile();

      }

      if( this.failures.length > 0 ){


      }

    },
    
    detectWebGL: function(){

      var webGL = function() { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } };

      var gl = webGL();
      
      if( !gl )
        this.addFailure( "WebGL" ,'http://get.webgl.org/');

    },

    detectWebAudioAPI: function(){

      if( !window.AudioContext ){
      //try {
      //  window.AudioContext = window.AudioContext;//||window.webkitAudioContext;
      //}catch(e) {
        this.addFailure( 'Non Webkit Audio API' ,'http://caniuse.com/audio-api' ); 
      }

    },

    detectMobile: function(){

      var detectM = function () { 
        if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        ){
          return true;
        } else {
          return false;
        }
      }

      var mobile = detectM();

      if( mobile )
        this.addFailure( "Non Mobile" , "http://cabbibo.tumblr.com" );

    }



  }


