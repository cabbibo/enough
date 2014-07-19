 var textCreator;

 var speechText = [

  "   The joy Shams felt could not be described with mortal words. There was not just one more of him. There were Hundreds. The Lonliness that he had felt earlier in his journey had vanished, and the only thing left was comfort. Ecstasy.",
  "",
  "",
  "He watched the way they swam, following their iridescent wanderings. Although he had been to this place before, it somehow felt different. Each color a bit more defined, each star that much more bright.",
  "",
  "",
  "He still did not know why he had risen. Where his new found friends were going to. The darkness surrounding them was still overbearing, and stars did not do enough to make him forget it. But there, in that moment. They swam together, and that was enough."


 ].join("\n");

function initTextParticles(){

  var vs  = shaders.vertexShaders.text;
  var fs  = shaders.fragmentShaders.text;
  var sim = shaders.simulationShaders.textPhysics;

  var creator = new TextParticles({
    vertexShader:   vs,
    fragmentShader: fs,
    lineLength:     50
  });

    
  var speedUniform = { type:"v3" , value: new THREE.Vector3(0 , .1 , 0) } 
  vs_particles = creator.createTextParticles( speechText );
  sim_particles = creator.createTextParticles( fs );
  fs_particles = creator.createTextParticles(sim);

  vs_particles.position.x =0; //-350;
  vs_particles.position.y =0; //250;
  
  fs_particles.position.x = -350;
  fs_particles.position.y = -50;
  
  sim_particles.position.x = -350;
  sim_particles.position.y = -400;

  //vs_particles.position.z = -100;
  scene.add( vs_particles );
 // scene.add( fs_particles );
 // scene.add( sim_particles );

  console.log( 'VS PARTICLES' , vs_particles , vs_particles.material.uniforms.t_lookup.value );
  var s = vs_particles.size;
  var simShader = shaders.simulationShaders.textPhysics;

  var speedUniform = { type:"v3" , value:new THREE.Vector3() }
  var cameraMat = { type:"m4" , value:camera.matrixWorld}
  var cameraPos = { type:"v3" , value:camera.position } 

  vsTextPosShader = new PhysicsRenderer( s , simShader , renderer );
  vsTextPosShader.setUniform( 't_to' , {
    type:"t",
    value:vs_particles.material.uniforms.t_lookup.value
  });


  /*vsTextPosShader.createDebugScene();
  vsTextPosShader.addDebugScene( scene );
  vsTextPosShader.debugScene.position.y = 0;*/

  var friendPosArray = [];
  var friendVelArray = [];
  for( var i =0; i < furryTails.length; i++ ){

    friendPosArray.push( furryTails[i].position );
    friendVelArray.push( furryTails[i].velocity );


  }
  var friendPos = {
    type:"v3v",
    value: friendPosArray
  }

  var friendVel = {
    type:"v3v",
    value: friendVelArray
  }



  var planetPosArray = [];

  for( var i =0; i < planets.length; i++ ){

    planetPosArray.push( planets[i].position );

  }

  var planetPos = {
    type:"v3v",
    value: planetPosArray
  }


  vsTextPosShader.setUniform( 'speed' , speedUniform );
  vsTextPosShader.setUniform( 'timer' , timer );
  vsTextPosShader.setUniform( 'cameraMat' , cameraMat );
  vsTextPosShader.setUniform( 'cameraPos' , cameraPos );
  vsTextPosShader.setUniform( 'offsetPos' , { type:"v3" , value: new THREE.Vector3( 00 , 150 , 0 ) } );
  vsTextPosShader.setUniform( 'handPos'   , { type:"v3" , value: riggedSkeleton.hand.position } );
  vsTextPosShader.setUniform( 'friendPos' , friendPos );
  vsTextPosShader.setUniform( 'friendVel' , friendVel );
  vsTextPosShader.setUniform( 'planetPos' , planetPos );
  vsTextPosShader.setUniform( 'alive' , { type:"f", value:1 });

  vsTextPosShader.addBoundTexture( vs_particles , 't_lookup' , 'output' );
/*

  var s = fs_particles.size;

  fsTextPosShader = new PhysicsRenderer( s , simShader , renderer );
  fsTextPosShader.setUniform( 't_to' , {
    type:"t",
    value:fs_particles.material.uniforms.t_lookup.value
  });

  fsTextPosShader.setUniform( 'speed' , speedUniform );
  fsTextPosShader.setUniform( 'timer' , timer );
  fs_particles.material.uniforms.t_lookup.value = fsTextPosShader.output;


  var s = sim_particles.size;

  simTextPosShader = new PhysicsRenderer( s , simShader , renderer );
  simTextPosShader.setUniform( 't_to' , {
    type:"t",
    value:sim_particles.material.uniforms.t_lookup.value
  });

  simTextPosShader.setUniform( 'speed' , speedUniform );
  simTextPosShader.setUniform( 'timer' , timer );

  sim_particles.material.uniforms.t_lookup.value = simTextPosShader.output;
*/

}
