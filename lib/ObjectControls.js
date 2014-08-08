
  function ObjectControls( eye , hand, controller , params ){

    this.intersected;
    this.selected;
    this.oFrame;
    this.frame;
    this.selectedFrame;
    this.dFromSelected;

    this.controller   = controller;
    this.eye          = eye;
  
    this.hand         = hand;
    this.position     = this.hand.position;

    this.leap         = false;

    this.mouse            = new THREE.Vector3();
    this.unprojectedMouse = new THREE.Vector3();
    
    this.objects      = [];

    var params = params || {};

    var indicator = new THREE.Mesh( 
      new THREE.IcosahedronGeometry( 10 , 2 ),
      new THREE.MeshBasicMaterial({ color:0x0000ff })
    );

    this.domElement         = params.domElement         || document//////////////////.body;
    this.selectionStrength  = params.selectionStrength  || .5;
    this.indicator          = params.indicator          || indicator; 

    this.neutralColor       = params.neutralColor       || new THREE.Color( .5 , .5 , .5 );
    this.hoverColor         = params.hoverColor         || new THREE.Color( 1 , .6 , 0 );
    this.downColor          = params.downColor          || new THREE.Color( 1 , 0 , 0 );
    this.selectColor        = params.selectColor        || new THREE.Color( 0 , 1 , 0 );

    
    // The ways the we call up down, 
    // and update selected
    this.upDownEvent        = params.upDownEvent        || this.pinchEvent
    this.selectedUpdate     = params.selectedUpdate     || function(){}      
    
    this.raycaster          = new THREE.Raycaster();
    this.projector          = new THREE.Projector();
    

    this.raycaster.near     = this.eye.near;
    this.raycaster.far      = this.eye.far;

    this.leap = this.controller.frame().valid;
    
    // Makes sure that we know if the leap is being used or not
    this.controller.on('streamingStopped', function(){
      this.leap = false;
    }.bind( this ));

    this.controller.on('streamingStarted', function(){
      console.log('STREAMING STARTED');
      this.leap = true;
    }.bind( this ))

    var addListener = this.domElement.addEventListener;
   
    addListener( 'mousedown', this.mouseDown.bind( this )  , false );
    addListener( 'mouseup'  , this.mouseUp.bind( this )    , false );
    addListener( 'mousemove', this.mouseMove.bind( this )  , false );

  }

  /*

     EVENTS

  */

  

  // You can think of _up and _down as mouseup and mouse down

  ObjectControls.prototype._down = function(){

    this.down();
    this.indicator.material.color = this.downColor;

    if( this.intersected ){
     
      //console.log( this.intersected );
      this._select( this.intersected  );

    }

  }

  ObjectControls.prototype.down = function(){}



  ObjectControls.prototype._up = function(){

    this.up();

    this.indicator.material.color = this.neutralColor;
      
    if( this.selected ){

      this._deselect( this.selected );

    }

  }

  ObjectControls.prototype.up = function(){}



  ObjectControls.prototype._hoverOut =  function( object ){

    this.hoverOut();
    
    this.objectHovered = false;
    
    this.indicator.material.color = this.neutralColor;
    
    if( object.hoverOut ){
      object.hoverOut( this );
    }
  
  };

  ObjectControls.prototype.hoverOut = function(){};



  ObjectControls.prototype._hoverOver = function( object ){
   
    this.hoverOver();
    
    this.objectHovered = true;
    
    this.indicator.material.color = this.hoverColor;

    if( object.hoverOver ){
      object.hoverOver( this );
    }
  
  };

  ObjectControls.prototype.hoverOver = function(){}



  ObjectControls.prototype._select = function( object ){
   
    this.select();
                
    this.indicator.material.color = this.selectColor;
    
    var intersectionPoint = this.getIntersectionPoint( object );

    this.selected       = object;
    this.selectFrame    = this.frame;
    var selectedClone   = this.selected.position.clone().add( intersectionPoint );
    this.dFromSelected  = this.hand.position.clone().sub( selectedClone ).length();
    this.intersectionPoint = intersectionPoint;
   
    if( object.select ){
      object.select( this );
    }

  };

  ObjectControls.prototype.select = function(){}


  
  ObjectControls.prototype._deselect = function( object ){
    
    //console.log('DESELECT');

    this.selected = undefined;
    this.selectFrame = undefined;
    this.dFromSelected = undefined;
    this.intersectionPoint = undefined;
    this.rotating     = false;

    if( object.deselect ){
      object.deselect( this );
    }

    this.deselect();

  };

  ObjectControls.prototype.deselect = function(){}





  /*

     Visual feedback

  */

  ObjectControls.prototype.linkToHand = function( object ){
   
    this.hand.add( object );

  };

  
  ObjectControls.prototype.addIndicator = function(){

    this.hand.add( this.indicator );
  
  };




  /*
  
    Changing what objects we are controlling 

  */

  ObjectControls.prototype.add = function( object ){

    this.objects.push( object );

  };

  ObjectControls.prototype.remove = function( object ){

    for( var i = 0; i < this.objects.length; i++ ){

      if( this.objects[i] == object ){
   
        console.log('removed' );
        this.objects.splice( i , 1 );

      }

    }

  };


  
  
  /*

     Update Loop

  */

  ObjectControls.prototype.update = function(){

    if( !this.frame ) this.frame = this.controller.frame();
    
    this.oFrame = this.frame;
    this.frame = this.controller.frame();

   // console.log( this.leap );

    if( this.leap == true ){

      if( this.frame.hands[0] && this.oFrame.hands[0] ){

        this.checkForUpDown( this.frame.hands[0] , this.oFrame.hands[0] );
        
        if( !this.selected ){
      
          this.checkForIntersections( this.hand.position );

        }else{

          this._updateSelected( this.frame.hands[0] );

        }


      }

    }else{


      if( !this.selected ){

        this.checkForIntersections( this.unprojectedMouse );

      }else{

        this._updateSelected( this.unprojectedMouse );

      }


    }


  };

  ObjectControls.prototype._updateSelected = function( hand ){

    this.updateSelected( hand );

    this.selectedUpdate();


    if( this.selected.update ){

      this.selected.update( this );

    }

  }
  
  ObjectControls.prototype.updateSelected = function( hand ){};
  
  /*
   
    Checks 

  */

  ObjectControls.prototype.checkForIntersections = function( position ){

    var origin    = position;
    //var direction = origin.clone()
 
    G.tmpV3.copy( origin );
    G.tmpV3.sub( this.eye.position );
    G.tmpV3.normalize();

    if( this.leap === true ){

      this.raycaster.set( origin , G.tmpV3 );

    }else{

      this.raycaster.set( this.eye.position , G.tmpV3 );
      
    }

    var intersected =  this.raycaster.intersectObjects( this.objects );

    if( intersected.length > 0 ){

      this._objectIntersected( intersected );

    }else{

      this._noObjectIntersected();

    }

  };

  ObjectControls.prototype.checkForUpDown = function( hand , oHand ){

    if( this.upDownEvent( this.selectionStrength , hand , oHand ) === true ){
    
      this._down();
    
    }else if( this.upDownEvent( this.selectionStrength , hand , oHand ) === false ){
    
      this._up();
    
    }
  
  };




  ObjectControls.prototype.getIntersectionPoint = function( i ){


    var intersected =  this.raycaster.intersectObjects( this.objects );
    if( !intersected[0] ){
      return i.position;
    }else{
      return intersected[0].point.sub( i.position );
    }

  }


  /*
   
     Raycast Events

  */

  ObjectControls.prototype._objectIntersected = function( intersected ){

    // Assigning out first intersected object
    // so we don't get changes everytime we hit 
    // a new face
    var firstIntersection = intersected[0].object;

    if( !this.intersected ){

      this.intersected = firstIntersection;

      this._hoverOver( this.intersected );


    }else{

      if( this.intersected != firstIntersection ){

        this._hoverOut( this.intersected );

        this.intersected = firstIntersection;

        this._hoverOver( this.intersected );

      }

    }

    this.objectIntersected();

  };

  ObjectControls.prototype.objectIntersected = function(){}

  ObjectControls.prototype._noObjectIntersected = function(){

    if( this.intersected  ){

      this._hoverOut( this.intersected );
      this.intersected = undefined;

    }

    this.noObjectIntersected();

  };

  ObjectControls.prototype.noObjectIntersected = function(){}


  ObjectControls.prototype.mouseMove = function(event){

    this.mouse.x =  ( event.clientX / window.innerWidth )  * 2 - 1;
    this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    this.mouse.z = 1;

    this.unprojectMouse();

  }

  ObjectControls.prototype.unprojectMouse = function(){

    this.unprojectedMouse.copy( this.mouse );
    this.projector.unprojectVector( this.unprojectedMouse , this.eye );

  }

  ObjectControls.prototype.mouseDown = function(){
    this._down();
  }

  ObjectControls.prototype.mouseUp = function(){
    this._up();
  }




  /*
   
  EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   EXAMPLE EVENTS   
   
   */


  /*
  
     Default Up Down Functions

  */

  ObjectControls.prototype.pinchEvent = function( cutoff , hand , oHand ){

    var pinchStrength = hand.pinchStrength;
    var oPinchStrength = oHand.pinchStrength

    if( pinchStrength  > cutoff && oPinchStrength <= cutoff ){

      return true;

    }else if( pinchStrength  <= cutoff && oPinchStrength  > cutoff ){

      return false;

    }

  }

  // TODO
  ObjectControls.prototype.thumbTriggerEvent = function(){


  }



  /*
  
     Default Update Functions

  */

  ObjectControls.prototype.translateSelected = function(){

    var dif = this.hand.position.clone().sub( this.eye.position ).normalize();
      
    var pos = this.hand.position.clone().add( dif.clone().multiplyScalar( this.dFromSelected ) );

    pos.sub( this.intersectionPoint );

    this.selected.position.copy( pos );
  
  }



