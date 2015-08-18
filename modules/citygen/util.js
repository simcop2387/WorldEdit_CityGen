player.print("Utility Module Loaded");

// Anything I find that I think is a utility function goes here

function EncodeBlock(type, data) {
    //context.print(type + " " + data);
    return (data << 8) | type;
}

function DecodeID(block) {
    return block & 0xFF;
}

function DecodeData(block) {
    return block >> 8;
}

////////////////////////////////////////////////////
// random instances of random
////////////////////////////////////////////////////

function OneInTwoChance() { return rand.nextInt(2) == 0 }
function OneInThreeChance() { return rand.nextInt(3) == 0 }
function OneInFourChance() { return rand.nextInt(4) == 0 }
function OneInNChance(N) { return rand.nextInt(N) == 0 }