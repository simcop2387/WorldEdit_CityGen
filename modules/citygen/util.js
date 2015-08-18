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

function FindYaw() {
    var yaw = (player.getYaw() - 90) % 360;
    if (yaw < 0)
        yaw += 360;
    return yaw;
}

function FindOriginOffset() {
    var deltaBad = 999;
    var deltaKeepLooking = 0;
    var deltaNorth = deltaKeepLooking;
    var deltaSouth = deltaKeepLooking;
    var deltaEast = deltaKeepLooking;
    var deltaWest = deltaKeepLooking;

    // look around
    for (var a = 0; a < 12; a++) {
        deltaNorth = BlockTest(deltaNorth, a, 0, a);
        deltaSouth = BlockTest(deltaSouth, -a, 0, a);
        deltaEast = BlockTest(deltaEast, 0, a, a);
        deltaWest = BlockTest(deltaWest, 0, -a, a);
    }

    // patch the offsets
    if (deltaNorth + deltaSouth == 10 && deltaEast + deltaWest == 10) {
        originOffsetX = -(deltaSouth + 2);
        originOffsetZ = -(deltaWest + 2);
        return true;
    } else {
        return false;
    }

    function BlockTest(deltaValue, atX, atZ, value) {
        if (deltaValue == deltaKeepLooking) {
            switch (editsess.rawGetBlock(origin.add(atX, -1, atZ)).getType()) {
                case BlockID.CLOTH:
                    return value;
                case BlockID.STONE:
                case BlockID.BRICK:
                case BlockID.SANDSTONE:
                case BlockID.QUARTZ_BLOCK:
                case BlockID.LOG:
                case BlockID.WOOD:
                case BlockID.COBBLESTONE:
                case BlockID.MOSSY_COBBLESTONE:
                case BlockID.STONE_BRICK:
                case BlockID.IRON_BLOCK:
                case BlockID.NETHER_BRICK:
                case BlockID.BEDROCK:
                case BlockID.LADDER:
                case BlockID.AIR: // just in case a creeper exploded nearby
                    return deltaKeepLooking;
                default:
                    return deltaBad;
            }
        } else
            return deltaValue;
    }
}


function RandomLotSize(maxSize) {
    switch (rand.nextInt(10)) {
        case 9:
        case 8:
            if (maxSize == 3)
                return 3;
        case 7:
        case 6:
        case 5:
            if (maxSize >= 2)
                return 2;
        case 4:
        case 3:
        case 2:
        case 1:
        default:
            return 1;
    }
}