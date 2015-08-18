function AddJustStreets() {
    // let see if we can literally do nothing... 
    // ...hey it worked!
}

// These aren't part of the lot, but are actually drawing the streets.  No idea how I want to fit this in elsewhere

// streets or bridges over canals (one of these days)
function AddStreets() {
    for (var x = 0; x < squaresWidth; x++)
        for (var z = 0; z < squaresLength; z++)
            if (x % 4 == 0 || z % 4 == 0)
                DrawStreetCell(x * squareBlocks, z * squareBlocks, x, z);

    //======================================================
    function DrawStreetCell(blockX, blockZ, cellX, cellZ) {

        // add the sewer corner bits, first one is special
        DrawSewerPart(blockX, blockZ, 0, 0);
        DrawSewerPart(blockX, blockZ, 2, 0);
        DrawSewerPart(blockX, blockZ, 0, 2);
        DrawSewerPart(blockX, blockZ, 2, 2);

        // bevel the ceilings
        DrawBevelPart(blockX, blockZ, 0, 1, true);
        DrawBevelPart(blockX, blockZ, 1, 0, false);
        DrawBevelPart(blockX, blockZ, 2, 1, true);
        DrawBevelPart(blockX, blockZ, 1, 2, false);

        // add the sewer straight bits
        if (cellX % 4 == 0 && cellZ != 0 && cellZ != squaresLength - 1 && cellZ % 4 != 0) {
            DrawSewerPart(blockX, blockZ, 0, 1);
            DrawSewerPart(blockX, blockZ, 2, 1);
            DrawBevelPart(blockX, blockZ, 1, 1, false);
        } else if (cellZ % 4 == 0 && cellX != 0 && cellX != squaresWidth - 1 && cellX % 4 != 0) {
            DrawSewerPart(blockX, blockZ, 1, 0);
            DrawSewerPart(blockX, blockZ, 1, 2);
            DrawBevelPart(blockX, blockZ, 1, 1, true);
        }

        // add the street
        FillCellLayer(BlockID.STONE, blockX, blockZ, streetLevel - 1, 1, 1);
        FillCellLayer(BlockID.STONE, blockX, blockZ, streetLevel, 1, 1);

        // add the sidewalk and streetlights
        var sidewalkY = streetLevel + 1;
        if (cellX % 4 == 0 && cellZ % 4 != 0) {
            DrawSidewalk(blockX + 0 * cornerBlocks, blockZ + 0 * cornerBlocks,
                         blockX + 1 * cornerBlocks - 2, blockZ + 3 * cornerBlocks);
            DrawSidewalk(blockX + 2 * cornerBlocks + 2, blockZ + 0 * cornerBlocks,
                         blockX + 3 * cornerBlocks, blockZ + 3 * cornerBlocks);

            DrawStreetlight(blockX + 0 * cornerBlocks + 2, sidewalkY, blockZ + 1 * cornerBlocks + 2, true, false, false, false);
            DrawStreetlight(blockX + 2 * cornerBlocks + 2, sidewalkY, blockZ + 1 * cornerBlocks + 2, false, false, true, false);

            // paint road lines
            for (var z = 0; z < squareBlocks; z++)
                if (z % 5 != 0 && z % 5 != 4)
                    blocks[blockX + linesOffset][streetLevel][blockZ + z] = ExtendedID.YELLOW_CLOTH;

        } else if (cellX % 4 != 0 && cellZ % 4 == 0) {
            DrawSidewalk(blockX + 0 * cornerBlocks, blockZ + 0 * cornerBlocks,
                         blockX + 3 * cornerBlocks, blockZ + 1 * cornerBlocks - 2);
            DrawSidewalk(blockX + 0 * cornerBlocks, blockZ + 2 * cornerBlocks + 2,
                         blockX + 3 * cornerBlocks, blockZ + 3 * cornerBlocks);

            DrawStreetlight(blockX + 1 * cornerBlocks + 2, sidewalkY, blockZ + 0 * cornerBlocks + 2, false, true, false, false);
            DrawStreetlight(blockX + 1 * cornerBlocks + 2, sidewalkY, blockZ + 2 * cornerBlocks + 2, false, false, false, true);

            // paint road lines
            for (var x = 0; x < squareBlocks; x++)
                if (x % 5 != 0 && x % 5 != 4)
                    blocks[blockX + x][streetLevel][blockZ + linesOffset] = ExtendedID.YELLOW_CLOTH;

        } else if (cellX % 4 == 0 && cellZ % 4 == 0) {
            DrawSidewalkCorner(blockX + 0 * cornerBlocks, blockZ + 0 * cornerBlocks, 0, 0);
            DrawSidewalkCorner(blockX + 2 * cornerBlocks, blockZ + 0 * cornerBlocks, 2, 0);
            DrawSidewalkCorner(blockX + 0 * cornerBlocks, blockZ + 2 * cornerBlocks, 0, 2);
            DrawSidewalkCorner(blockX + 2 * cornerBlocks, blockZ + 2 * cornerBlocks, 2, 2);

            DrawStreetlight(blockX + 0 * cornerBlocks + 2, sidewalkY, blockZ + 0 * cornerBlocks + 2, true, true, false, false);
            DrawStreetlight(blockX + 2 * cornerBlocks + 2, sidewalkY, blockZ + 0 * cornerBlocks + 2, false, true, true, false);
            DrawStreetlight(blockX + 2 * cornerBlocks + 2, sidewalkY, blockZ + 2 * cornerBlocks + 2, false, false, true, true);
            DrawStreetlight(blockX + 0 * cornerBlocks + 2, sidewalkY, blockZ + 2 * cornerBlocks + 2, true, false, false, true);

            // paint crosswalk
            var line1Color = ExtendedID.WHITE_CLOTH;
            var line2Color = ExtendedID.LIGHT_GRAY_CLOTH;
            for (var i = 0; i < 9; i++) {
                blocks[blockX + 2][streetLevel][blockZ + 3 + i] = line1Color;
                blocks[blockX][streetLevel][blockZ + 3 + i] = line2Color;

                blocks[blockX + squareBlocks - 3][streetLevel][blockZ + 3 + i] = line1Color;
                blocks[blockX + squareBlocks - 1][streetLevel][blockZ + 3 + i] = line2Color;

                blocks[blockX + 3 + i][streetLevel][blockZ] = line2Color;
                blocks[blockX + 3 + i][streetLevel][blockZ + 2] = line1Color;

                blocks[blockX + 3 + i][streetLevel][blockZ + squareBlocks - 3] = line1Color;
                blocks[blockX + 3 + i][streetLevel][blockZ + squareBlocks - 1] = line2Color;
            }
        }

        function DrawBevelPart(atX, atZ, boxX, boxZ, northSouth) {
            atX = atX + boxX * cornerBlocks;
            atZ = atZ + boxZ * cornerBlocks;
            var blockID = OneInTwoChance() ? BlockID.COBBLESTONE : BlockID.MOSSY_COBBLESTONE;
            if (northSouth)
                for (var x = 0; x < cornerBlocks; x++) {
                    blocks[atX + x][streetLevel - 2][atZ] = blockID;
                    blocks[atX + x][streetLevel - 2][atZ + cornerBlocks - 1] = blockID;
                }
            else
                for (var z = 0; z < cornerBlocks; z++) {
                    blocks[atX][streetLevel - 2][atZ + z] = blockID;
                    blocks[atX + cornerBlocks - 1][streetLevel - 2][atZ + z] = blockID;
                }
        }

        function DrawSewerPart(atX, atZ, boxX, boxZ) {
            var blockX = atX + boxX * cornerBlocks;
            var blockZ = atZ + boxZ * cornerBlocks;

            // first the walls
            var wallID = OneInTwoChance() ? BlockID.COBBLESTONE : BlockID.MOSSY_COBBLESTONE;
            AddWalls(wallID, blockX, sewerFloor, blockZ,
                             blockX + cornerBlocks - 1, sewerCeiling - 1, blockZ + cornerBlocks - 1);

            // then the goodies
            var fillID = RandomGoodie();

            // always fill the access room with air
            var accessRoom = !(boxX != 0 || boxZ != 0 || cellX % 4 != 0 || cellZ % 4 != 0);
            if (accessRoom)
                fillID = BlockID.AIR;

            // fill will goodies
            FillCube(fillID, blockX + 1, sewerFloor, blockZ + 1,
                             blockX + cornerBlocks - 2, sewerCeiling - 1 - rand.nextInt(3), blockZ + cornerBlocks - 2);

            // what type of door are we going to use?
            var doorID = BlockID.BRICK;
            if (!accessRoom && fillID == BlockID.AIR)
                doorID = BlockID.AIR;

            // place all the doors in sewer boxes that aren't the access one
            PunchDoor(2, 0, false);
            PunchDoor(0, 2, false);
            PunchDoor(2, 4, false);
            PunchDoor(4, 2, accessRoom);

            // place a single door
            function PunchDoor(offsetX, offsetZ, realDoor) {
                if (realDoor)
                    SetLateBlock(blockX + offsetX, sewerFloor, blockZ + offsetZ, ExtendedID.SOUTHFACING_WOODEN_DOOR)
                else {
                    blocks[blockX + offsetX][sewerFloor][blockZ + offsetZ] = doorID;
                    blocks[blockX + offsetX][sewerFloor + 1][blockZ + offsetZ] = doorID;
                }
            }

            function RandomGoodie() {
                switch (rand.nextInt(100)) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        return (BlockID.DIRT);
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                        return BlockID.SAND;
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                        return BlockID.GRAVEL;
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                        return BlockID.CLAY;
                    case 24:
                    case 25:
                    case 26:
                    case 27:
                        return BlockID.IRON_ORE;
                    case 28:
                    case 29:
                    case 30:
                    case 31:
                        return BlockID.COAL_ORE;
                    case 32:
                    case 33:
                    case 34:
                        return BlockID.GOLD_ORE;
                    case 35:
                    case 36:
                        return BlockID.LAPIS_LAZULI_ORE;
                    case 37:
                    case 38:
                        return BlockID.DIAMOND_ORE;
                    case 39:
                        return BlockID.REDSTONE_ORE;
                    case 40:
                        return BlockID.GLOWING_REDSTONE_ORE;
                    case 41:
                        return BlockID.SNOW_BLOCK;
                    case 42:
                        return BlockID.WATER;
                    case 43:
                        return BlockID.ICE;
                    case 44:
                        return BlockID.LAVA;
                    case 45:
                        return BlockID.NETHERSTONE;
                    case 46:
                        return BlockID.NETHERRACK;
                    case 47:
                        return BlockID.SLOW_SAND;
                    case 48:
                        return BlockID.GOLD_BLOCK;
                    case 49:
                        return BlockID.IRON_BLOCK;
                    case 50:
                        return BlockID.DIAMOND_BLOCK;
                    case 51:
                        return BlockID.LAPIS_LAZULI_BLOCK;
                    case 52:
                        return BlockID.TNT;
                    case 53:
                        return BlockID.CAKE_BLOCK;
                    default:
                        return BlockID.AIR;
                }
            }
        }

        function DrawSidewalkCorner(blockX, blockZ, offsetX, offsetZ) {
            for (var x = 0; x < 3; x++)
                for (var z = 0; z < 3; z++)
                    blocks[blockX + offsetX + x][sidewalkY][blockZ + offsetZ + z] = BlockID.STEP;
        }

        function DrawSidewalk(minX, minZ, maxX, maxZ) {
            for (var x = minX; x < maxX; x++)
                for (var z = minZ; z < maxZ; z++)
                    blocks[x][sidewalkY][z] = BlockID.STEP;
        }
    }
}

function DrawStreetlight(blockX, blockY, blockZ, lightN, lightE, lightS, lightW) {
    blocks[blockX][blockY][blockZ] = BlockID.IRON_BLOCK;
    blocks[blockX][blockY + 1][blockZ] = BlockID.FENCE;
    blocks[blockX][blockY + 2][blockZ] = BlockID.FENCE;
    blocks[blockX][blockY + 3][blockZ] = BlockID.FENCE;
    blocks[blockX][blockY + 4][blockZ] = BlockID.FENCE;
    blocks[blockX][blockY + 5][blockZ] = BlockID.STEP;

    if (lightN)
        blocks[blockX + 1][blockY + 5][blockZ] = BlockID.LIGHTSTONE;
    if (lightE)
        blocks[blockX][blockY + 5][blockZ + 1] = BlockID.LIGHTSTONE;
    if (lightS)
        blocks[blockX - 1][blockY + 5][blockZ] = BlockID.LIGHTSTONE;
    if (lightW)
        blocks[blockX][blockY + 5][blockZ - 1] = BlockID.LIGHTSTONE;
}

function AddManholes() {
    var manX = 1; // - 1
    var manZ = 3; // + 1

    // add the manholes
    AddSewerManhole(manX + 0 * squareBlocks, belowGround, manZ + 0 * squareBlocks);
    AddSewerManhole(manX + 0 * squareBlocks, belowGround, manZ + 4 * squareBlocks);
    AddSewerManhole(manX + 4 * squareBlocks, belowGround, manZ + 0 * squareBlocks);
    AddSewerManhole(manX + 4 * squareBlocks, belowGround, manZ + 4 * squareBlocks);

    //======================================================
    function AddSewerManhole(locX, locY, locZ) {

        // DrawSewerPart took care of empting the room and placing the door

        // Record the need for the ladders
        for (var y = 1; y < sewerHeight + streetHeight; y++)
            SetLateBlock(locX, locY - y, locZ, ExtendedID.EASTWARD_LADDER);
        SetLateBlock(locX, locY, locZ, ExtendedID.WESTFACING_TRAP_DOOR);

        // Manhole down to the plumbing... WATCH OUT IT IS DANGEROUS DOWN THERE!
        SetLateBlock(locX + 3, locY - sewerHeight - streetHeight + 1, locZ + 2, ExtendedID.WESTFACING_TRAP_DOOR);
        SetLateBlock(locX + 3, locY - sewerHeight - streetHeight, locZ + 2, ExtendedID.SOUTHWARD_LADDER);
        SetLateBlock(locX + 3, locY - sewerHeight - streetHeight - 1, locZ + 2, ExtendedID.SOUTHWARD_LADDER);
        SetLateBlock(locX + 3, locY - sewerHeight - streetHeight - 2, locZ + 2, ExtendedID.SOUTHWARD_LADDER);
        blocks[locX + 3][locY - sewerHeight - streetHeight - 3][locZ + 2] = BlockID.AIR;
    }
}