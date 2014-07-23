
var MONOME_MESHES = [];
var MONOME_NOTES  = [];

var MONOME_INTERSECTED;

var MONOME_MAT;

function Monome( forest , whichHit , whichNote , mesh ){

  this.forest = forest;

  this.active = false;
  this.selected = false;
  this.hovered = false;
  this.mesh = mesh;

  this.mesh.monome = this; // For use in intersections

  this.hit = whichHit;
  this.noteIndex = whichNote;

  this.note = MONOME_NOTES[ this.noteIndex ];

  this.createMaterial();

  this.mesh.material = this.material;
  this.mesh.material.needsUpdate = true;

  MONOME_MESHES.push( mesh );

}


Monome.prototype.createMaterial = function(){

  var t_iri = THREE.ImageUtils.loadTexture( '../img/iri/comboWet.png' )

  this.uniforms = {

    hovered:{type:"f" , value:0},
    active:{type:"f" , value:0},
    selected:{type:"f" , value:0},
    t_audio:{ type:"t" , value:this.note.texture},
    t_iri:{type:"t",value:t_iri},
    lightPos:{type:"v3",value:INTERSECT_PLANE_INTERSECT}

  }

  this.material = new THREE.ShaderMaterial({

    uniforms:this.uniforms,
    vertexShader: shaders.vertexShaders.monome,
    fragmentShader: shaders.fragmentShaders.monome,

  });

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
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 1 , 0 );
    }else{
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 0 , 0 );
    }

  }else{

    if( this.active == true ){
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 1 , 0 );
    }else{
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 0 , 0 );
    }

  }

  this.hovered = true;
  this.uniforms.hovered.value = 1;




}

Monome.prototype.hoverOut = function(){
  
  if( !this.selected ){

    
    if( this.active == true ){
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 0 , 0 , 1 , 0 );
    }else{
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 0 , 0 , 0 , 0 );
    }
    
  }else{

    if( this.active == true ){
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 0 , 1 , 1 , 0 );
    }else{
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 0 , 1 , 0 , 0 );
    }

  }

  this.hovered = false;
  this.uniforms.hovered.value = 0;


}

Monome.prototype.select = function(){


//  this.note.play();


  if( this.active == true ){
    tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 1 , 0 );
  }else{
    tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 0 , 0 );
  }
  
  this.selected = true;
  this.uniforms.selected.value = 1;

}

Monome.prototype.deselect = function(){
  

  if( this.active == true ){
    tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 1 , 0 );
  }else{
    tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 0 , 0 );
  }


  this.selected = false;
  this.uniforms.selected.value = 0;


}


Monome.prototype.activate = function(){

  this.active = true;

  //this.mesh.material =this.activeMaterial;
  //his.mesh.materialNeedsUpdate = true;

  this.uniforms.active.value = 1;

  if( this.selected ){

    if( this.hovered == true ){
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 1 , 0 );
    }else{
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 0 , 1 , 1 , 0 );
    } 
    this.note.play();

  }else{

    if( this.hovered == true ){
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 1 , 0 );
    }else{
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 0 , 0 , 1 , 0 );
    } 


  }

}

Monome.prototype.deactivate = function(){

  this.active = false;
  this.uniforms.active.value = 0;

  if( this.selected ){

    if( this.hovered == true ){
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 1 , 0 , 0 );
    }else{
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 0 , 1 , 0 , 0 );
    } 

  }else{

    if( this.hovered == true ){
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 1 , 0 , 0 , 0 );
    }else{
      tendrils.updateActiveTexture( this.hit , this.noteIndex , 0 , 0 , 0 , 0 );
    } 


  }


}
