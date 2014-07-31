PLOT:


  Characters
    Sol
    Evlana





TODO:

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

- Fix text! 
    - text.kill needs to ACTUALLY kill text. right now they continue updating forever...
      should have a tween for opacity, and on tween complete deactivate

- Make it so that there can be an initial move to a page, that can happen by default
  - either a function in global that lets

- Furry tails should have an 'up vector' uniform that allows you to change which direciton the up vector will be in.
  in the land of crystals, for example, the up vector should be in x or z, not in y. While in forest, the up vector being in z is great ( or at least I think those are the proper directions


- Need to have the relative positions based on the page position, not the transitioning Global position. This is important for things like draging the planets, as well as mani moving through the forest


- Object controls should work with both hands!

- Global star system with pretty ambient audio




