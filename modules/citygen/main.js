// stair direction
var Ascending_South = 0;
var Ascending_North = 1;
var Ascending_West = 2;
var Ascending_East = 3;

// extended BlockID types
var ExtendedID = {
    "NORTHWARD_LADDER": EncodeBlock(BlockID.LADDER, 4),
    "EASTWARD_LADDER": EncodeBlock(BlockID.LADDER, 2),
    "SOUTHWARD_LADDER": EncodeBlock(BlockID.LADDER, 5),
    "WESTWARD_LADDER": EncodeBlock(BlockID.LADDER, 3),

    "NORTHFACING_WOODEN_DOOR": EncodeBlock(BlockID.WOODEN_DOOR, 0),
    "EASTFACING_WOODEN_DOOR": EncodeBlock(BlockID.WOODEN_DOOR, 1),
    "SOUTHFACING_WOODEN_DOOR": EncodeBlock(BlockID.WOODEN_DOOR, 2),
    "WESTFACING_WOODEN_DOOR": EncodeBlock(BlockID.WOODEN_DOOR, 3),

    "NORTHFACING_REVERSED_WOODEN_DOOR": EncodeBlock(BlockID.WOODEN_DOOR, 3 + 4),
    "EASTFACING_REVERSED_WOODEN_DOOR": EncodeBlock(BlockID.WOODEN_DOOR, 0 + 4),
    "SOUTHFACING_REVERSED_WOODEN_DOOR": EncodeBlock(BlockID.WOODEN_DOOR, 1 + 4),
    "WESTFACING_REVERSED_WOODEN_DOOR": EncodeBlock(BlockID.WOODEN_DOOR, 2 + 4),

    "NORTHFACING_TRAP_DOOR": EncodeBlock(BlockID.TRAP_DOOR, 2),
    "EASTFACING_TRAP_DOOR": EncodeBlock(BlockID.TRAP_DOOR, 0),
    "SOUTHFACING_TRAP_DOOR": EncodeBlock(BlockID.TRAP_DOOR, 3),
    "WESTFACING_TRAP_DOOR": EncodeBlock(BlockID.TRAP_DOOR, 1),

    "WHITE_CLOTH": EncodeBlock(BlockID.CLOTH, 0),
    "ORANGE_CLOTH": EncodeBlock(BlockID.CLOTH, 1),
    "MAGENTA_CLOTH": EncodeBlock(BlockID.CLOTH, 2),
    "LIGHT_BLUE_CLOTH": EncodeBlock(BlockID.CLOTH, 3),
    "YELLOW_CLOTH": EncodeBlock(BlockID.CLOTH, 4),
    "LIGHT_GREEN_CLOTH": EncodeBlock(BlockID.CLOTH, 5),
    "PINK_CLOTH": EncodeBlock(BlockID.CLOTH, 6),
    "GRAY_CLOTH": EncodeBlock(BlockID.CLOTH, 7),
    "LIGHT_GRAY_CLOTH": EncodeBlock(BlockID.CLOTH, 8),
    "CYAN_CLOTH": EncodeBlock(BlockID.CLOTH, 9),
    "PURPLE_CLOTH": EncodeBlock(BlockID.CLOTH, 10),
    "BLUE_CLOTH": EncodeBlock(BlockID.CLOTH, 11),
    "BROWN_CLOTH": EncodeBlock(BlockID.CLOTH, 12),
    "DARK_GREEN_CLOTH": EncodeBlock(BlockID.CLOTH, 13),
    "RED_CLOTH": EncodeBlock(BlockID.CLOTH, 14),
    "BLACK_CLOTH": EncodeBlock(BlockID.CLOTH, 15),

    "STONE_STEP": EncodeBlock(BlockID.STEP, 0),
    "SANDSTONE_STEP": EncodeBlock(BlockID.STEP, 1),
    "WOOD_STEP": EncodeBlock(BlockID.STEP, 2),
    "COBBLESTONE_STEP": EncodeBlock(BlockID.STEP, 3),

    "STONE_DOUBLESTEP": EncodeBlock(BlockID.DOUBLE_STEP, 0),
    "SANDSTONE_DOUBLESTEP": EncodeBlock(BlockID.DOUBLE_STEP, 1),
    "WOOD_DOUBLESTEP": EncodeBlock(BlockID.DOUBLE_STEP, 2),
    "COBBLESTONE_DOUBLESTEP": EncodeBlock(BlockID.DOUBLE_STEP, 3),

    "SOUTHASCENDING_WOODEN_STAIRS": EncodeBlock(BlockID.WOODEN_STAIRS, Ascending_South),
    "NORTHASCENDING_WOODEN_STAIRS": EncodeBlock(BlockID.WOODEN_STAIRS, Ascending_North),
    "WESTASCENDING_WOODEN_STAIRS": EncodeBlock(BlockID.WOODEN_STAIRS, Ascending_West),
    "EASTASCENDING_WOODEN_STAIRS": EncodeBlock(BlockID.WOODEN_STAIRS, Ascending_East),

    "SOUTHASCENDING_COBBLESTONE_STAIRS": EncodeBlock(BlockID.COBBLESTONE_STAIRS, Ascending_South),
    "NORTHASCENDING_COBBLESTONE_STAIRS": EncodeBlock(BlockID.COBBLESTONE_STAIRS, Ascending_North),
    "WESTASCENDING_COBBLESTONE_STAIRS": EncodeBlock(BlockID.COBBLESTONE_STAIRS, Ascending_West),
    "EASTASCENDING_COBBLESTONE_STAIRS": EncodeBlock(BlockID.COBBLESTONE_STAIRS, Ascending_East)

};

// calculate the floor height ratio
var floorRatio = 0.66;
switch (modeCreate) {
    case createMode.HIGHRISE:
        floorRatio = 1.00;
        break;
    case createMode.MIDRISE:
        floorRatio = 0.66;
        break;
    case createMode.LOWRISE:
        floorRatio = 0.33;
        break;
    case createMode.TOWN:
        floorRatio = 0.25;
        break;
    default:
        break;
}

// derived pseudo-constants
var skyHigh = Math.floor(127 - origin.y);
var belowGround = plumbingHeight + sewerHeight + streetHeight - 1;
var cornerBlocks = squareBlocks / 3;
var sewerFloor = plumbingHeight;
var sewerCeiling = sewerFloor + sewerHeight - 1;
var streetLevel = sewerCeiling + streetHeight - 1;
var floorOverhead = belowGround + streetHeight + roofHeight;
var floorCount = Math.floor(((127 - origin.y) * floorRatio - roofHeight) / floorHeight);
if (floorCount < 1)
    floorCount = 1;

// how large of an area are we building?
var arrayWidth = squaresWidth * squareBlocks;
var arrayDepth = squaresLength * squareBlocks;
var arrayHeight = floorOverhead + skyHigh;

// what direction are we facing?
var yaw = FindYaw();
if (yaw >= 0 && yaw < 90) {
    offsetX = -1;
    offsetZ = -1;
} else if (yaw >= 90 && yaw < 180) {
    offsetX = 0;
    offsetZ = -1;
} else if (yaw >= 180 && yaw < 270) {
    offsetX = 0;
    offsetZ = 0;
} else {
    offsetX = -1;
    offsetZ = 0;
}

// move the offset if needed
origin = origin.add(offsetX * (squaresWidth - 1) * squareBlocks,
                    0,
                    offsetZ * (squaresLength - 1) * squareBlocks);

// offset the start so we are standing in the middle of the road near the manhole
origin = origin.add(originOffsetX, -belowGround, originOffsetZ);

// is random based on where we are?
if (!randSeed) {
    var blockSeed = Math.floor(origin.x);
    blockSeed = blockSeed * 65536 + Math.floor(origin.y);
    blockSeed = blockSeed * 65536 + Math.floor(origin.z);
    rand.setSeed(blockSeed);
}

// making room to create
var blocks = new Array(arrayWidth);

function main() {
    InitializeBlocks();
    InitializeFixups();
    InitializeTrees();

    // add plumbing level (based on Maze.js from WorldEdit)
    AddPlumbingLevel();

    // add streets
    AddStreets();

    // add the inside bits
    switch (modeCreate) {
        case createMode.HIGHRISE:
        case createMode.MIDRISE:
        case createMode.LOWRISE:
        case createMode.TOWN:
            AddCitySquares();
            break;
        case createMode.PARK:
            AddParkLot();
            break;
        case createMode.FARMHOUSE:
        case createMode.FARM:
        case createMode.HOUSES:
            AddFarmAndHousesLot();
            break;
        case createMode.DIRTLOT:
            AddDirtLot();
            break;
        case createMode.PARKINGLOT:
            AddParkingLot();
            break;
        default: // createMode.JUSTSTEETS
            AddJustStreets();
            break;
    }

    // add access points (will modify the player "origin" correctly as well)
    AddManholes();

    // and we are nearly done
    TranscribeBlocks();

    // finally fix the things that need to be fixed up
    FinalizeColumns();
    FinalizeTrees();
    FinalizeFixups();

    // clean up any left over detritus
    world.removeEntities(EntityType.ITEMS,
        origin.add(Math.floor(2.5 * squareBlocks), 0, Math.floor(2.5 * squareBlocks)),
        4 * squareBlocks);

    // poof, we are done!
    //context.print("fini " + blocksSet + " of " + blocksTotal + " blocks placed");
    context.print("fini");
}