


var sections = [


{
  
  text : [

    "After traveling for what seemed like an eternity, Webby came upon a land of sparkling crystals. Although it told him nothing more about himself, the crystals were very pretty, so he took a moment to play with them. "

  ].join("\n" );


  camPos: new THREE.Vector3( 500 , 1000 , 2200 );

  transitionTime: "loopEnd",

  offSet: G.pageTurner.offset,
  
  textKillTime: 3000

  callback:function(){

    for( var i = 0; i < this.crystals.length; i++ ){

      var c = this.crystals[i];
      if( i !== 0 && i !== 1 && i !== 2 && i !== 3 && i !== 9){
        
        if( !c.selected ) c.select();
      
      }else{

        if( c.selected ) c.select();
      }

    }

  }

}

}
