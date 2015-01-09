

THINGS TO DO:

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
