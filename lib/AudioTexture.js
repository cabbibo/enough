  function AudioTexture( audio ){

    this.analyser = audio.analyzer;

    this.fbc = this.analyser.frequencyBinCount;


    this.width = this.fbc / 4;

    var data = this.processAudio();

    this.analyser.texture = new THREE.DataTexture(
      data,
      data.length / 16,
      1,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    
    this.texture = this.analyser.texture;

    this.texture.needsUpdate = true;

  }

  AudioTexture.prototype.update = function(){

    this.texture.image.data = this.processAudio(); 
    this.texture.needsUpdate = true;

  }

  AudioTexture.prototype.processAudio = function(){

     var audioTextureData = new Float32Array( this.width * 4 );
   
     //console.log( this.analyser.array[20]);
    for (var i = 0; i < this.width; i+=4) {
      
      audioTextureData[ i+0 ] = this.analyser.array[ (i/4) + 0 ] / 256;
      audioTextureData[ i+1 ] = this.analyser.array[ (i/4) + 1 ] / 256;
      audioTextureData[ i+2 ] = this.analyser.array[ (i/4) + 2 ] / 256;
      audioTextureData[ i+3 ] = this.analyser.array[ (i/4) + 3 ] / 256;

    }
   
    return audioTextureData;


  }




