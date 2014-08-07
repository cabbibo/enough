

function Monome( forest , whichHit , whichNote , mesh ){

  this.forest = forest;
  this.page   = this.forest.page;

  this.active = false;
  this.selected = false;
  this.hovered = false;
  this.mesh = mesh;

  this.mesh.visible = false;
  this.mesh.monome = this; // For use in intersections

  this.hit = whichHit;
  this.noteIndex = whichNote;

  this.note = this.page.audio.array[ this.noteIndex ];

  /*this.createMaterial();

  this.mesh.material = this.material;
  this.mesh.material.needsUpdate = true;*/

  this.mesh.hoverOver = this.hoverOver.bind( this );
  this.mesh.hoverOut  = this.hoverOut.bind( this );
  this.mesh.select    = this.select.bind( this );
 // this.mesh.deselect  = this.deselect.bind( this );

  G.objectControls.add( this.mesh );

  this.id = this.page.monomeMeshes.length;
  this.page.monomeMeshes.push( this.mesh );

}


Monome.prototype.createMaterial = function(){

  var t_iri = THREE.ImageUtils.loadTexture( 'img/iri/comboWet.png' )

  this.uniforms = {

    hovered:{type:"f" , value:0},
    active:{type:"f" , value:0},
    selected:{type:"f" , value:0},
    t_audio:{ type:"t" , value:this.note.texture},
    t_iri:{type:"t",value:t_iri},
    lightPos:{type:"v3",value:G.iPoint.relative}

  }

  this.material = new THREE.ShaderMaterial({

    uniforms:this.uniforms,
    vertexShader: G.shaders.vertexShaders.monome,
    fragmentShader: G.shaders.fragmentShaders.monome,

  });
/*
  this.material = new THREE.MeshBasicMaterial({
    color: new THREE.Color( .5 , .1 ,1 ) 
  });
*/
}

Monome.prototype.update = function( whichHit ){

  if( whichHit !== this.hit ){

    if( this.active == true ){

      this.deactivate();

    }

  }

  if( whichHit === this.hit ){

    if( this.active == false ){

      this.activate();

    }

  }

}

Monome.prototype.hoverOver = function(){
  
  if( !this.selected ){
    
    if( this.active == true ){
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 1 , 0 );
    }else{
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 0 , 0 );
    }

  }else{

    if( this.active == true ){
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 1 , 0 );
    }else{
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 0 , 0 );
    }

  }

  this.hovered = true;
 // this.uniforms.hovered.value = 1;




}

Monome.prototype.hoverOut = function(){
  
  if( !this.selected ){

    
    if( this.active == true ){
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 0 , 0 , 1 , 0 );
    }else{
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 0 , 0 , 0 , 0 );
    }
    
  }else{

    if( this.active == true ){
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 0 , 1 , 1 , 0 );
    }else{
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 0 , 1 , 0 , 0 );
    }

  }

  this.hovered = false;
  //this.uniforms.hovered.value = 0;


}

//
Monome.prototype.select = function(){


//  this.note.play();


  console.log( this.id );
  if( this.selected === false ){

  if( this.active == true ){
    this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 1 , 0 );
  }else{
    this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 0 , 0 );
  }
  
  this.selected = true;
  //this.uniforms.selected.value = 1;

  }else{

    if( this.active == true ){
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 1 , 0 );
    }else{
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 0 , 0 );
    }


    this.selected = false;
    //this.uniforms.selected.value = 0;


  }

}

Monome.prototype.deselect = function(){
  

  if( this.active == true ){
    this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 1 , 0 );
  }else{
    this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 0 , 0 );
  }


  this.selected = false;
  //this.uniforms.selected.value = 0;


}


Monome.prototype.activate = function(){

  this.active = true;

  //this.mesh.material =this.activeMaterial;
  //his.mesh.materialNeedsUpdate = true;

  //this.uniforms.active.value = 1;

  if( this.selected ){

    if( this.hovered == true ){
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 1 , 0 );
    }else{
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 0 , 1 , 1 , 0 );
    } 
   
    this.note.play();

  }else{

    if( this.hovered == true ){
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 1 , 0 );
    }else{
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 0 , 0 , 1 , 0 );
    } 


  }

}

Monome.prototype.deactivate = function(){

  this.active = false;
  //this.uniforms.active.value = 0;

  if( this.selected ){

    if( this.hovered == true ){
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 0 , 0 );
    }else{
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 0 , 1 , 0 , 0 );
    } 

  }else{

    if( this.hovered == true ){
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 0 , 0 );
    }else{
      this.forest.updateActiveTexture( this.hit , this.noteIndex , 0 , 0 , 0 , 0 );
    } 


  }


}
