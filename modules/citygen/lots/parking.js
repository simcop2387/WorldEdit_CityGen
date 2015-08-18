
function AddParkingLot() {

    // set up the default set of materials
    var lightID = BlockID.LIGHTSTONE;
    var floorID = BlockID.STONE;
    var ceilingID = BlockID.IRON_BLOCK;
    var paintID = ExtendedID.WHITE_CLOTH;
    var ramp1ID = ExtendedID.STONE_STEP;
    var ramp2ID = ExtendedID.STONE_DOUBLESTEP;

    // randomize the materials
    switch (rand.nextInt(3)) {
        case 0:
            {
                floorID = BlockID.SANDSTONE;
                ceilingID = ExtendedID.YELLOW_CLOTH;
                paintID = ExtendedID.GRAY_CLOTH;
                ramp1ID = ExtendedID.SANDSTONE_STEP;
                ramp2ID = ExtendedID.SANDSTONE_DOUBLESTEP;
                break;
            }
        case 1:
            {
                floorID = BlockID.COBBLESTONE;
                ceilingID = ExtendedID.WHITE_CLOTH;
                paintID = ExtendedID.LIGHT_GRAY_CLOTH;
                ramp1ID = ExtendedID.COBBLESTONE_STEP;
                ramp2ID = ExtendedID.COBBLESTONE_DOUBLESTEP;
                break;
            }
        default:
            {
                // stick with the defaults
            }
    }

    // set up a different set of default materials
    var fenceID = BlockID.IRON_BLOCK;
    var verticalID = BlockID.STONE;
    var upperWallID = BlockID.AIR;
    var lowerWallID = BlockID.STONE;

    // randomize the materials
    switch (rand.nextInt(3)) {
        case 0:
            {
                fenceID = BlockID.FENCE;
                verticalID = BlockID.SANDSTONE;
                lowerWallID = BlockID.SANDSTONE;
                break;
            }
        case 1:
            {
                fenceID = BlockID.IRON_BLOCK;
                verticalID = BlockID.COBBLESTONE;
                lowerWallID = BlockID.COBBLESTONE;
                break;
            }
        default:
            {
                // stick with the defaults
            }
    }

    // swizzle the material a bit more
    if (OneInThreeChance())
        ceilingID = floorID;
    if (OneInThreeChance())
        fenceID = ceilingID
    else if (OneInFourChance())
        fenceID = BlockID.GLASS;
    if (OneInTwoChance() && fenceID != BlockID.FENCE)
        upperWallID = BlockID.GLASS;

    // how tall and is there a basement?
    var floors = rand.nextInt(6) + 1;
    var basement = (floors > 1 || OneInTwoChance()) || (floors > 4);

    // make the floors
    var floor = 1;
    var floorY = streetLevel;
    for (var floor = 1; floor <= floors; floor++) {

        // special case for basements
        if (floor == 1 && basement) {

            // make room            
            FillCube(BlockID.AIR, 1 * squareBlocks, plumbingHeight - 1, 1 * squareBlocks,
                                  4 * squareBlocks - 1, streetLevel, 4 * squareBlocks - 1);

            // now draw the basement
            floorY = floorY - 5;
            DrawParkingLevel(floorY, true, false, false);

            // special case for the first floor if there is no basement
        } else if (floor == 1 && !basement) {

            // backfill
            FillCube(BlockID.DIRT, 1 * squareBlocks, plumbingHeight, 1 * squareBlocks,
                                   4 * squareBlocks - 1, streetLevel, 4 * squareBlocks - 1);

            // now draw the only floor
            DrawParkingLevel(floorY, false, true, floor == floors);
        }

        // now for the rest of the floors
        else
            DrawParkingLevel(floorY, false, basement && floor == 2, floor == floors);

        // move up a bit
        floorY = floorY + 5;
    }

    // now go back and punch the ramps
    floorY = streetLevel;
    for (var floor = 1; floor <= floors; floor++) {

        // something special for basements
        if (floor == 1 && basement)
            floorY = floorY - 5;

        // now how about the ramp
        PunchRamp(floorY, floor == 1, floor == floors);

        // move up a bit
        floorY = floorY + 5;
    }

    function DrawParkingLevel(blockY, basementFloor, groundFloor, topFloor) {

        // draw the floor
        FillCube(floorID, 1 * squareBlocks, blockY, 1 * squareBlocks,
                          4 * squareBlocks - 1, blockY, 4 * squareBlocks - 1);

        // fill in the walls if we are underground
        if (basementFloor && !topFloor)
            AddWalls(lowerWallID, 1 * squareBlocks, blockY + 1, 1 * squareBlocks,
                                  4 * squareBlocks - 1, blockY + 3, 4 * squareBlocks - 1)
        else {

            // now the railings
            AddWalls(fenceID, 1 * squareBlocks, blockY + 1, 1 * squareBlocks,
                             4 * squareBlocks - 1, blockY + 1, 4 * squareBlocks - 1);

            // and the rest of the wall
            if (!topFloor) {
                AddWalls(upperWallID, 1 * squareBlocks, blockY + 2, 1 * squareBlocks,
                                      4 * squareBlocks - 1, blockY + 3, 4 * squareBlocks - 1);

                // now the columns
                DrawColumn(1 * squareBlocks, blockY, 1 * squareBlocks, false, true, true, false);
                DrawColumn(2 * squareBlocks, blockY, 1 * squareBlocks, true, false, false, false);
                DrawColumn(3 * squareBlocks - 1, blockY, 1 * squareBlocks, false, false, true, false);
                DrawColumn(4 * squareBlocks - 1, blockY, 1 * squareBlocks, true, true, false, false);
                DrawColumn(1 * squareBlocks, blockY, 4 * squareBlocks - 1, false, false, true, true);
                DrawColumn(2 * squareBlocks, blockY, 4 * squareBlocks - 1, true, false, false, false);
                DrawColumn(3 * squareBlocks - 1, blockY, 4 * squareBlocks - 1, false, false, true, false);
                DrawColumn(4 * squareBlocks - 1, blockY, 4 * squareBlocks - 1, true, false, false, true);
                DrawColumn(4 * squareBlocks - 1, blockY, 2 * squareBlocks, false, false, false, true);
                DrawColumn(4 * squareBlocks - 1, blockY, 3 * squareBlocks - 1, false, true, false, false);
            }
        }

        // draw the outer lines
        for (var a = 4; a < 3 * squareBlocks - 4; a = a + 4) {
            for (var b = 1; b <= 4; b++) {
                blocks[a + squareBlocks][blockY][1 * squareBlocks + b] = paintID;
                blocks[a + squareBlocks][blockY][4 * squareBlocks - b - 1] = paintID;
                blocks[4 * squareBlocks - b - 1][blockY][a + squareBlocks] = paintID;
                // except for the north side where the ramp is
                //blocks[1 * squareBlocks + b][blockY][a + squareBlocks] = paintID;
            }
        }

        // draw the inner lines
        if (floors == 1) {
            DrawParkingCenter(2 * squareBlocks - 8, blockY, 2 * squareBlocks, topFloor, 7);
            DrawParkingCenter(2 * squareBlocks - 8, blockY, 3 * squareBlocks - 1, topFloor, 7);
        } else {
            DrawParkingCenter(2 * squareBlocks - 1, blockY, 2 * squareBlocks, topFloor, 5);
            DrawParkingCenter(2 * squareBlocks - 1, blockY, 3 * squareBlocks - 1, topFloor, 5);
        }

        // draw the ceiling
        if (!topFloor) {
            FillCube(ceilingID, 1 * squareBlocks, blockY + 4, 1 * squareBlocks,
                                4 * squareBlocks - 1, blockY + 4, 4 * squareBlocks - 1);

            // add some ceiling lights
            for (var x = squareBlocks + 5; x < 4 * squareBlocks; x = x + 5)
                for (var z = squareBlocks + 5; z < 4 * squareBlocks; z = z + 5) {
                    blocks[x - 1][blockY + 4][z] = lightID;
                    blocks[x][blockY + 4][z] = lightID;
                    blocks[x + 1][blockY + 4][z] = lightID;
                }
        }

        // empty the driveways
        if (groundFloor) {
            for (var z = 2 * squareBlocks - 7; z < 2 * squareBlocks - 2; z++) {
                for (var y = blockY + 1; y < blockY + 4; y++) {
                    blocks[squareBlocks][y][z] = BlockID.AIR;
                    blocks[squareBlocks][y][z + 2 * squareBlocks - 6] = BlockID.AIR;

                    for (var x = 1; x < 4; x++) {
                        blocks[squareBlocks - x][blockY + 1][z] = BlockID.AIR;
                        blocks[squareBlocks - x][blockY + 1][z + 2 * squareBlocks - 6] = BlockID.AIR;
                    }
                }
            }
        }

        // Manhole down to the plumbing... WATCH OUT IT IS DANGEROUS DOWN THERE!
        if (basementFloor) {
            blocks[1 * squareBlocks + 1][blockY][1 * squareBlocks + 1] = BlockID.AIR;
            blocks[1 * squareBlocks + 1][blockY - 1][1 * squareBlocks + 1] = BlockID.AIR;
            blocks[1 * squareBlocks + 1][blockY - 2][1 * squareBlocks + 1] = BlockID.AIR;
            blocks[1 * squareBlocks + 1][blockY - 3][1 * squareBlocks + 1] = BlockID.AIR;
            SetLateBlock(1 * squareBlocks + 1, blockY + 1, 1 * squareBlocks + 1, ExtendedID.WESTFACING_TRAP_DOOR);
        }

        function DrawColumn(blockX, blockY, blockZ, north, west, south, east) {
            for (var y = blockY; y < blockY + 4; y++) {
                blocks[blockX][y][blockZ] = verticalID;
                if (north)
                    blocks[blockX - 1][y][blockZ] = verticalID;
                if (west)
                    blocks[blockX][y][blockZ + 1] = verticalID;
                if (south)
                    blocks[blockX + 1][y][blockZ] = verticalID;
                if (east)
                    blocks[blockX][y][blockZ - 1] = verticalID;
            }
        }

        // inner lines support
        function DrawParkingCenter(blockX, blockY, blockZ, topFloor, spots) {
            for (var x = 0; x <= 4 * spots; x++) {
                if (x % 4 == 0) {
                    for (var z = blockZ - 4; z <= blockZ + 4; z++) {
                        if (x == 0 || x == 4 * spots) {
                            if (topFloor && (z == blockZ - 4 || z == blockZ + 4))
                                DrawStreetlight(blockX + x, blockY + 1, z, true, false, true, false)
                            else
                                blocks[blockX + x][blockY + 1][z] = fenceID;
                        } else
                            blocks[blockX + x][blockY][z] = paintID;
                    }
                } else
                    blocks[blockX + x][blockY][blockZ] = paintID;

                // center columns?
                if (!topFloor && (x == 0 || x == 4 * spots)) {
                    blocks[blockX + x][blockY + 1][blockZ] = verticalID;
                    blocks[blockX + x][blockY + 2][blockZ] = verticalID;
                    blocks[blockX + x][blockY + 3][blockZ] = verticalID;
                }
            }
        }
    }

    // a way down, a way up
    function PunchRamp(blockY, lowestFloor, topFloor) {
        if (!(lowestFloor && topFloor)) {
            if (!topFloor)
                FillCube(BlockID.AIR, squareBlocks + 1, blockY + 1, 2 * squareBlocks - 2,
                                      squareBlocks + 6, blockY + 5, 2 * squareBlocks - 2 + 18);

            // walls for the ramps
            for (var z = 0; z < 19; z++) {

                // only if we are not on top
                if (!topFloor) {
                    for (var y = blockY + 1; y < blockY + 4; y++) {
                        blocks[squareBlocks + 7][y][2 * squareBlocks + z - 2] = verticalID;
                        blocks[squareBlocks][y][2 * squareBlocks + z - 2] = verticalID;
                    }
                } else {
                    blocks[squareBlocks + 7][blockY + 1][2 * squareBlocks + z - 2] = fenceID;
                    blocks[squareBlocks][blockY + 1][2 * squareBlocks + z - 2] = fenceID;
                    for (var x = 1; x < 8; x++)
                        blocks[squareBlocks + x][blockY + 1][2 * squareBlocks - 2] = fenceID;
                }
            }

            // ramps for the walls
            if (!topFloor) {
                DrawRampSegment(squareBlocks + 1, blockY + 1, 2 * squareBlocks - 2, false);
                DrawRampSegment(squareBlocks + 1, blockY + 2, 2 * squareBlocks + 2, false);
                DrawRampSegment(squareBlocks + 1, blockY + 3, 2 * squareBlocks + 6, false);
                DrawRampSegment(squareBlocks + 1, blockY + 4, 2 * squareBlocks + 10, false);
                DrawRampSegment(squareBlocks + 1, blockY + 5, 2 * squareBlocks + 14, true);
            }
        }

        function DrawRampSegment(blockX, blockY, blockZ, lastRamp) {
            for (var x = 0; x < 6; x++) {
                blocks[blockX + x][blockY][blockZ] = ramp1ID;
                blocks[blockX + x][blockY][blockZ + 1] = ramp1ID;
                blocks[blockX + x][blockY][blockZ + 2] = ramp2ID;
                if (!lastRamp)
                    blocks[blockX + x][blockY][blockZ + 3] = ramp2ID;
                else {
                    blocks[blockX + x][blockY - 1][blockZ] = ceilingID;
                    blocks[blockX + x][blockY - 1][blockZ + 1] = ceilingID;
                    blocks[blockX + x][blockY - 1][blockZ + 2] = ceilingID;
                }
            }
        }
    }
}