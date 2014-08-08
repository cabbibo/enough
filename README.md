PLOT:


  Characters
    Sol
    Evlana





TODO:



FOR SIGGRAPH:

  // - Object controls should work with both hands! ( create second object controls? only update if there is a left hand? )
  - Practice at least 10 times
  - Text ( Proofread! )

  - Black Screen after together ( frame loss? )
    - Probably has something to do with the renderer clearing or not clearing b/c creating so many of those critters.
      solutions:
        create them globaly? may need them in multiple slides ?

    
  - Mechanics for planets too jumpy

  //- Tween in for page transition audio gains, rather than turn on at end of transition
  //  -Check out the 'tween to end of loop' function in looper.
  //  - Also could use a filter for all this stuff rather than straight gain? compare memory usage!

  - Each segment within a page should trigger different notes / objects
 
  // - Title Page ( simplex text )

  //  - Text on first slide of planets too long

  //  - There is a bug on Object controls that will screw up on get intersection point ( Leap Only )

  - some sort of  'tween' for intersect plane, so that it doesn't jump. ( esp apparent on 'crystals' leaving transition )

-------------

- Sol should be one of the global repelers for physics text

- Each page should be able to be completly destroyed and reinitionalized. This means:
  - Loader should be able to simply check if everything is loaded, rather than having to load something new.
  - Everything should be defined within 'AddTo' functions, so we can wipe out everything, but whats in those functions


- Focus and not on focus problem
  includes:
    - Looper
    - dT
    - etc

- Figure best way to update loaded audio textures
// - Need a global 3D Mouse position, which also means a global Intersect plane!
- every page should have text on it ( could be blank for transition pages? );
- G.camera.tweenToLookAt function
- Global Mani Charcter!!
  - Global Mani Character should have a 'localPosition' , which is updated every frame  
    and gives a position that is in the space of the specific page!
  - Need to make a way for mani to be able to 'jump' so we don't need to worry about max speed for physics renderer
    - Gets the difference between leader and jump pos,
    - Adds to each of data texture
    - sets dT equal to 0 for a moment
    - calls update, to kill extra velocity

  - Mani should also have certain behavoirs, such as 'when hit cursor, move away' , or 'when near cursor, circle cursor

- Clean up shaders for Forest!

- Looper Still not working properly

- Something strange going on with text.distToCam vs G.position vs G.iPoint / G.iPlaneDist

- Make it so that there can be an initial move to a page, that can happen by default
  - either a function in global that lets

- Furry tails should have an 'up vector' uniform that allows you to change which direciton the up vector will be in.
  in the land of crystals, for example, the up vector should be in x or z, not in y. While in forest, the up vector being in z is great ( or at least I think those are the proper directions


- Need to have the relative positions based on the page position, not the transitioning Global position. This is important for things like draging the planets, as well as mani moving through the forest


- Global star system with pretty ambient audio

- Test to see if mani and creatures look better with 1 directional spring rather than 2D

- Need a more elegant way of removing meshes from teh Object Controls



