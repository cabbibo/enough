
SECTION REQUIRMENTS:

- textChunks array
- cameraPositions array
- sectionParams array

Page will take these 3 things and make the sections!
- TODO: Make it so we can have a look pos too!




THINGS TO DO:

PLANETS Level. Text creation shoudl be able to pass in the repel array for all of the object, but right now nothing repels the text but intersect point!!!

SAME AS ABOVE FOR CREDITT!


SUN level.
CREDITS level.

Multiple endings?
  Problems:
    need to load 2 seperate levels, instead of jsut 1.
      could be combatted by using same / similar audio...
    Could just make it 1 Level w/ multiple if statments defining direction of movement etc.

    Going inside egg will lead to egg being global ?

Actual ending?

Better way of doing transitions / text chunks
how to make 1level place based on position of last level ( AKA sparkles is moving camera );


--> dropped frames that occur between pages *could* be because the camera is jumping back to origin for a single frame!
--> can see this bug when transfering from tree to together, if you turn page right after reaching last section. Shoudl see sol *flash* for a frame
--> Could be at beginnign of all .addToStartArray( because they have G.camera.position.copy( this.position ) ). INVESTIGATE
--> IT IS! all of the look ats / G.camera.positiosn should be in the addToActivateArray, not the addToStartArray


Text not dying on sun flocking and fireworks


/*


   THINKING SPACE


*/
Tubes on Forsest aren't long enough. Nothing to play with, and doesn't show off simulation

Better framing for SUN

Pointer at beginning of crystals level can't be seen

For all empty levels, need sparkling stars, and possibly for *every* level!

Make sure to thank all artists sampled

Sparkles can't have the same audio as the empty pages!
Neither can Fireworks!
Only credits / quote should have.



/*

   Release README info

*/

UGLIEST code is the sections of the page turning

