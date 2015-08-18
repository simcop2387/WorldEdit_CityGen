    //======================================================
    function DrawBuildingCell(blockX, blockZ, cellX, cellZ, cellW, cellL) {
        var cellWidth = cellW * squareBlocks;
        var cellLength = cellL * squareBlocks;

        // floor color?
        var floorID = BlockID.WOOD;
        var stairID = BlockID.WOODEN_STAIRS;
        if (OneInFourChance()) {
            floorID = BlockID.COBBLESTONE;
            stairID = BlockID.COBBLESTONE_STAIRS;
        }

        // basement floor?
        var basementFloorID = BlockID.STONE;
        var basementWallID = BlockID.STONE;
        var basementStairID = BlockID.WOODEN_STAIRS;
        var basementLandingID = BlockID.WOOD;
        if (OneInThreeChance()) {
            basementFloorID = BlockID.COBBLESTONE;
            basementStairID = BlockID.COBBLESTONE_STAIRS;
            basementLandingID = BlockID.COBBLESTONE;
        }
        if (OneInTwoChance())
            basementWallID = BlockID.COBBLESTONE;

        // pick primary/secondary colors
        var primaryID = rand.nextInt(8);
        var secondaryID = primaryID + 8;

        // dark hue?
        if (OneInTwoChance()) {
            primaryID += 8;
            secondaryID = primaryID - 8;
        }

        // windows and wall color?
        var windowStyle = rand.nextInt(4);
        var primaryWallID = EncodeBlock(BlockID.CLOTH, primaryID);
        var secondaryWallID = EncodeBlock(BlockID.CLOTH, secondaryID);
        if (OneInTwoChance())
            primaryWallID = RandomMaterial();
        if (OneInTwoChance())
            secondaryWallID = RandomMaterial();
        if (windowStyle != 0 && OneInFourChance())
            secondaryWallID = primaryWallID;

        // how many stories and is there a way down to the basement
        var firstFloor = streetLevel + 1;
        var stories = rand.nextInt(floorCount) + 1;
        var basements = rand.nextInt(3);

        // what type of roof and what is its color? (make sure it is darkened)
        var roofStyle = rand.nextInt(4);
        var roofID = RandomRoofMaterial(secondaryWallID, secondaryID);
        if (roofID == BlockID.GLASS && roofStyle == 3) // if the roof is made of glass, can't be flat
            roofStyle = rand.nextInt(3);

        // is there an angled roof? if so then the building should be one story shorter
        var roofTop = roofStyle < 3 ? 1 : 0;
        if (stories == 1 && roofTop)
            stories++;

        // where are the stairs?
        var stairsX = blockX + Math.floor(cellWidth / 2);
        var stairsZ = blockZ + Math.floor(cellLength / 2);

        // random elements
        var insetStyle = OneInThreeChance();
        var cornerStyle = OneInThreeChance() && !insetStyle;
        var outsetStyle = OneInThreeChance() && !insetStyle;
        var shortWindows = OneInThreeChance() || outsetStyle;
        var skylightID = OneInThreeChance() ? roofID : BlockID.GLASS;
        var penthouseStyle = skylightID == BlockID.GLASS || roofID == BlockID.GLASS;
        var columnStyle = (cellW > 1 || cellL > 1) && stories > 2 && OneInTwoChance();
        var columnStories = rand.nextInt(stories / 2 + 1);
        var columnFloorInsetAmount = rand.nextInt(2);
        var gridStyle = columnStyle && OneInThreeChance();

        // building the building's bottoms from the top down
        switch (basements) {
            case 0:
                {
                    BuildFoundation();
                    HollowOut(2);
                    break;
                }
            case 1:
                {
                    BuildFoundation();
                    Build1stBasement();
                    HollowOut(1);
                    break;
                }
            default: // case 2: 
                {
                    BuildFoundation();
                    Build1stBasement();
                    Build2ndBasement();
                    HollowOut(0);
                    break;
                }
        }

        // stairs
        PunchBasementStairs(stairsX, stairsZ, basements,
            (stories - roofTop - 1 > 1) || !penthouseStyle);

        // build the building
        for (var story = 0; story < (stories - roofTop); story++) {
            var floorAt = story * floorHeight + firstFloor + 1;

            // what color is the wall? first floor is unique.
            var floorWallID = primaryWallID;
            if (story == 0 && secondaryWallID != BlockID.GLASS && OneInTwoChance())
                floorWallID = secondaryWallID;

            // where are the walls?
            var minX = blockX + 1;
            var minY = floorAt;
            var minZ = blockZ + 1;
            var maxX = blockX + cellWidth - 2;
            var maxY = floorAt + floorHeight - 2;
            var maxZ = blockZ + cellLength - 2;
            var insetAmount = (columnStyle && story < columnStories) ? 2 : (insetStyle ? 1 : 0);

            // breath in?
            if (insetAmount > 0) {
                minX += insetAmount;
                maxX -= insetAmount;
                minZ += insetAmount;
                maxZ -= insetAmount;
            }

            // NS walls
            var window = 0;
            var sectionID = floorWallID;
            for (var x = minX; x <= maxX; x++) {
                if (!(cornerStyle && (x == minX || x == maxX))) {
                    sectionID = ComputeWindowID(windowStyle, floorWallID, x, minX, minY, window);

                    for (var y = minY; y <= maxY; y++) {
                        if (shortWindows && y == minY) {
                            blocks[x][y][minZ] = floorWallID;
                            blocks[x][y][maxZ] = floorWallID;
                        } else {
                            blocks[x][y][minZ] = sectionID;
                            blocks[x][y][maxZ] = sectionID;
                        }
                    }
                }
                window++;
            }

            // EW walls
            window = 0;
            for (var z = minZ; z <= maxZ; z++) {
                if (!(cornerStyle && (z == minZ || z == maxZ))) {
                    sectionID = ComputeWindowID(windowStyle, floorWallID, z, minZ, minZ, window);

                    for (var y = minY; y <= maxY; y++) {
                        if (shortWindows && y == minY) {
                            blocks[minX][y][z] = floorWallID;
                            blocks[maxX][y][z] = floorWallID;
                        } else {
                            blocks[minX][y][z] = sectionID;
                            blocks[maxX][y][z] = sectionID;
                        }
                    }
                }
                window++;
            }

            // are we on the ground floor? if so let's add some doors
            if (story == 0) {
                var punchedDoor = false;

                // fifty/fifty chance of a door on a side, but there must be one somewhere
                if (OneInTwoChance()) {
                    SetLateBlock(minX + 3, minY, minZ, ExtendedID.WESTFACING_WOODEN_DOOR);
                    punchedDoor = true;
                }
                if (OneInTwoChance()) {
                    SetLateBlock(maxX, minY, minZ + 3, ExtendedID.NORTHFACING_WOODEN_DOOR);
                    punchedDoor = true;
                }
                if (OneInTwoChance()) {
                    SetLateBlock(maxX - 3, minY, maxZ, ExtendedID.EASTFACING_WOODEN_DOOR);
                    punchedDoor = true;
                }
                if (!punchedDoor || OneInTwoChance())
                    SetLateBlock(minX, minY, maxZ - 3, ExtendedID.SOUTHFACING_WOODEN_DOOR);
            }

            // breath in?
            if (insetAmount > 0) {
                minX -= insetAmount;
                maxX += insetAmount;
                minZ -= insetAmount;
                maxZ += insetAmount;
            }

            // draw the ceiling edge, the topmost one is special
            if (story < stories - roofTop - 1) {
                if (!outsetStyle && (gridStyle || !columnStyle || story > columnStories - 2))
                    AddWalls(secondaryWallID, minX, maxY + 1, minZ, maxX, maxY + 1, maxZ);

                // now do the next floor
                var floorInset = (columnStyle && story < columnStories - 1) ? columnFloorInsetAmount : 0;
                FillAtLayer(floorID, minX + 1 + floorInset, minZ + 1 + floorInset, maxY + 1,
                            maxX - minX - 1 - floorInset * 2, maxZ - minZ - 1 - floorInset * 2);
            }
            else
                FillAtLayer(floorID, minX, minZ, maxY + 1, maxX - minX + 1, maxZ - minZ + 1);

            // add the columns if needed
            if (columnStyle && story < columnStories) {
                var columnID = secondaryWallID;

                // NS columns
                for (var x = minX; x <= maxX; x++) {
                    if (x % 5 == 0) {
                        for (var y = minY; y <= maxY + 1; y++) {
                            blocks[x][y][minZ] = columnID;
                            blocks[x][y][maxZ] = columnID;
                        }
                    }
                }

                // EW columns
                for (var z = minZ; z <= maxZ; z++) {
                    if (z % 5 == 0) {
                        for (var y = minY; y <= maxY + 1; y++) {
                            blocks[minX][y][z] = columnID;
                            blocks[maxX][y][z] = columnID;
                        }
                    }
                }
            }

            // add some stairs, but not if there is a penthouse
            if (story < (stories - roofTop - 1) || !penthouseStyle)
                PunchStairs(stairID, stairsX, stairsZ, 
                            floorAt + floorHeight - 1, false, true, true);
        }

        // where is the roof?
        var roofAt = (stories - 1) * floorHeight + firstFloor + 1;

        // flat roofs are special
        if (roofStyle == 3) {

            // flat roofs can have one more stairs
            PunchStairs(stairID, stairsX, stairsZ, roofAt + floorHeight - 1, false, true, true);

            // now add some more fences
            AddWalls(BlockID.FENCE, blockX + 1, roofAt + floorHeight, blockZ + 1,
                                            blockX + cellWidth - 2, roofAt + floorHeight, blockZ + cellLength - 2);

            // add final stair railing
            FinalizeStairs(stairsX, stairsZ, roofAt + floorHeight, true);
        }
        else {

            // hollow out the ceiling
            if (penthouseStyle) {
                FillAtLayer(BlockID.AIR, blockX + 2, blockZ + 2, roofAt - 1, cellWidth - 4, cellLength - 4);

                // add final stair railing
                FinalizeStairs(stairsX, stairsZ, roofAt - floorHeight, (stories - roofTop > 1)); 
            } else
                FinalizeStairs(stairsX, stairsZ, roofAt, (stories - roofTop > 1));

            // cap the building
            switch (roofStyle) {
                case 0:
                    // NS ridge
                    for (r = 0; r < floorHeight; r++)
                        AddWalls(roofID, blockX + 2 + r, roofAt + r, blockZ + 1,
                                                 blockX + cellWidth - 3 - r, roofAt + r, blockZ + cellLength - 2);

                    // fill in top with skylight
                    FillCube(skylightID, blockX + 2 + floorHeight, roofAt + floorHeight - 1, blockZ + 2,
                                                 blockX + cellWidth - 3 - floorHeight, roofAt + floorHeight - 1, blockZ + cellLength - 3);
                    break;
                case 1:
                    // EW ridge
                    for (r = 0; r < floorHeight; r++)
                        AddWalls(roofID, blockX + 1, roofAt + r, blockZ + 2 + r,
                                             blockX + cellWidth - 2, roofAt + r, blockZ + cellLength - 3 - r);

                    // fill in top with skylight
                    FillCube(skylightID, blockX + 2, roofAt + floorHeight - 1, blockZ + 2 + floorHeight,
                                                 blockX + cellWidth - 3, roofAt + floorHeight - 1, blockZ + cellLength - 3 - floorHeight);
                    break;

                default:
                    // pointy
                    for (r = 0; r < floorHeight; r++)
                        AddWalls(roofID, blockX + 2 + r, roofAt + r, blockZ + 2 + r,
                                                 blockX + cellWidth - 3 - r, roofAt + r, blockZ + cellLength - 3 - r);

                    // fill in top with skylight
                    FillCube(skylightID, blockX + 2 + floorHeight, roofAt + floorHeight - 1, blockZ + 2 + floorHeight,
                                                 blockX + cellWidth - 3 - floorHeight, roofAt + floorHeight - 1, blockZ + cellLength - 3 - floorHeight);
                    break;
            }
        }

        function BuildFoundation() {
            FillCube(basementFloorID, blockX, floorHeight * 2, blockZ,
                                        blockX + cellWidth - 1, floorHeight * 2, blockZ + cellLength - 1);
            FillCube(BlockID.REDSTONE_WIRE, blockX, floorHeight * 2 + 1, blockZ,
                                        blockX + cellWidth - 1, floorHeight * 2 + 1, blockZ + cellLength - 1);
            FillCube(basementFloorID, blockX, floorHeight * 2 + 2, blockZ,
                                        blockX + cellWidth - 1, floorHeight * 2 + 2, blockZ + cellLength - 1);
        }

        function Build1stBasement() {
            // my floor is their ceiling
            FillCube(basementFloorID, blockX, floorHeight, blockZ,
                                    blockX + cellWidth - 1, floorHeight, blockZ + cellLength - 1);

            // some walls
            AddWalls(basementWallID, blockX, floorHeight + 1, blockZ,
                                    blockX + cellWidth - 1, floorHeight * 2 - 1, blockZ + cellLength - 1);
        }

        function Build2ndBasement() {
            // basement floor
            FillCube(basementFloorID, blockX, 0, blockZ,
                                    blockX + cellWidth - 1, 0, blockZ + cellLength - 1);

            // walls
            AddWalls(basementWallID, blockX, 1, blockZ,
                                    blockX + cellWidth - 1, floorHeight - 1, blockZ + cellLength - 1);

            // empty it out
            FillCube(BlockID.AIR, blockX + 1, 1, blockZ + 1,
                                  blockX + cellWidth - 2, floorHeight - 1, blockZ + cellLength - 2);
        }

        function HollowOut(floors) {
            if (floors > 0)
                FillCube(BlockID.AIR, blockX, 0, blockZ,
                                      blockX + cellWidth - 1, floorHeight * floors - 1, blockZ + cellLength - 1);
        }

        function RandomMaterial() {
            switch (rand.nextInt(13)) {
                case 1: return BlockID.COBBLESTONE;
                case 2: return BlockID.WOOD;
                case 3: if (OneInNChance(10)) return BlockID.LAPIS_LAZULI_BLOCK;
                case 4: return BlockID.SANDSTONE;
                case 5: if (OneInNChance(10)) return BlockID.GOLD_BLOCK;
                case 6: return BlockID.IRON_BLOCK;
                case 7: return BlockID.DOUBLE_STEP;
                case 8: return BlockID.BRICK;
                case 9: return BlockID.MOSSY_COBBLESTONE;
                case 10: if (OneInNChance(10)) return BlockID.DIAMOND_BLOCK;
                case 11: return BlockID.CLAY;
                case 12: if (OneInNChance(10)) return BlockID.GLASS;
                default: return BlockID.STONE;
            }
        }

        function RandomRoofMaterial(secondaryWallID, secondaryID) {
            if (DecodeID(secondaryWallID) == BlockID.CLOTH)
                if (secondaryID < 8)
                    return EncodeBlock(BlockID.CLOTH, secondaryID + 8)
                else
                    return EncodeBlock(BlockID.CLOTH, secondaryID)
            else
                return secondaryWallID;
        }

        function ComputeWindowID(style, defaultID, curAt, minAt, maxAt, state) {
            var windowID = BlockID.GLASS;
            switch (style) {
                case 1:
                    if (state % 3 == 0)
                        windowID = defaultID;
                    break;
                case 2:
                    if (state % 4 == 0)
                        windowID = defaultID;
                    break;
                case 3:
                    if (state % 5 == 0)
                        windowID = defaultID;
                    break;
                default:
                    if (curAt == minAt || curAt == maxAt || OneInTwoChance())
                        windowID = defaultID;
                    break;
            }
            return windowID;
        }

        function PunchBasementStairs(atX, atZ, basements, morestairs) {
            if (basements > 0) {

                // where to create the stairs?
                var floorNth = (2 - basements) * floorHeight + 1;
                var floor1st = floorHeight + 1;
                var atY = streetLevel + 1;
                var stepNdx = 0;
                var stepY = atY - stepNdx;

                // wall and center post
                FillCube(basementWallID, atX - 2, floorNth, atZ - 2,
                                        atX + 2, atY, atZ + 2);

                // room to put the stairs
                AddWalls(BlockID.AIR, atX - 1, floorNth, atZ - 1,
                                      atX + 1, atY, atZ + 1);

                // cap off the top for safety
                AddWalls(BlockID.FENCE, atX - 1, streetLevel + 2, atZ - 2,
                                        atX + 2, atY + 1, atZ + 2);

                while (atY - stepNdx - 1 >= floorNth) {
                    stepY = atY - stepNdx - 1;
                    switch (stepNdx % 4) {
                        case 0:
                            {
                                blocks[atX][stepY][atZ + 1] = EncodeBlock(basementStairID, Ascending_North);
                                blocks[atX - 1][stepY][atZ + 1] = basementLandingID;
                                if (stepNdx == 0) {
                                    blocks[atX - 1][stepY + 2][atZ + 1] = BlockID.AIR;
                                    blocks[atX - 1][stepY + 1][atZ + 1] = EncodeBlock(basementStairID, Ascending_North);
                                    blocks[atX - 2][stepY + 2][atZ + 1] = BlockID.AIR;

                                    blocks[atX][stepY + 1][atZ - 1] = basementWallID;
                                    blocks[atX - 1][stepY + 1][atZ] = basementWallID;
                                    blocks[atX - 1][stepY + 1][atZ - 1] = basementWallID;

                                    blocks[atX + 1][stepY + 2][atZ] = basementWallID;
                                    blocks[atX + 1][stepY + 2][atZ - 1] = basementWallID;
                                    blocks[atX][stepY + 2][atZ] = basementWallID;
                                    blocks[atX][stepY + 2][atZ - 1] = basementWallID;
                                    blocks[atX - 1][stepY + 2][atZ] = basementWallID;
                                    blocks[atX - 1][stepY + 2][atZ - 1] = basementWallID;

                                    if (morestairs) {
                                        blocks[atX + 1][stepY + 3][atZ] = basementWallID;
                                        blocks[atX + 1][stepY + 3][atZ - 1] = basementWallID;
                                        blocks[atX][stepY + 3][atZ] = basementWallID;
                                        blocks[atX][stepY + 3][atZ - 1] = basementWallID;

                                        blocks[atX + 1][stepY + 4][atZ] = basementWallID;
                                        blocks[atX + 1][stepY + 4][atZ - 1] = basementWallID;
                                    }
                                }
                                break;
                            }
                        case 1:
                            {
                                blocks[atX + 1][stepY][atZ] = EncodeBlock(basementStairID, Ascending_West);
                                blocks[atX + 1][stepY][atZ + 1] = basementLandingID;
                                break;
                            }
                        case 2:
                            {
                                blocks[atX][stepY][atZ - 1] = EncodeBlock(basementStairID, Ascending_South);
                                blocks[atX + 1][stepY][atZ - 1] = basementLandingID;
                                break;
                            }
                        default: // case 3:
                            {
                                blocks[atX - 1][stepY][atZ] = EncodeBlock(basementStairID, Ascending_East);
                                blocks[atX - 1][stepY][atZ - 1] = basementLandingID;
                                break;
                            }
                    }

                    // one more level please
                    stepNdx++;
                }
            }

            // place the doors
            if (basements >= 1) {
                AddBasementDoor(floorHeight + 1);
                if (basements >= 2) {
                    AddBasementDoor(1);
                    AddBasementTrap(0, true);
                } else
                    AddBasementTrap(floorHeight, true);
            } //else
                //AddBasementTrap(streetLevel + 1, false);

            function AddBasementDoor(blockY) {
                SetLateBlock(atX + 2, blockY, atZ + 1, ExtendedID.SOUTHFACING_WOODEN_DOOR);
            }

            function AddBasementTrap(blockY, backfillStairs) {
                blocks[atX][blockY][atZ - 1] = BlockID.AIR;
                SetLateBlock(atX, blockY + 1, atZ - 1, ExtendedID.SOUTHFACING_TRAP_DOOR);

                if (backfillStairs) {
                    blocks[atX - 1][blockY + 1][atZ - 1] = basementLandingID;
                    blocks[atX - 1][blockY + 1][atZ] = basementLandingID;
                    blocks[atX - 1][blockY + 1][atZ + 1] = basementLandingID;
                }
            }
        }

        function PunchStairs(stairID, atX, atZ, floorY, addStairwell, addGuardrail, drawStairs) {

            // how big are the stairs?
            var stairWidth = 2;
            var stairHeight = floorHeight;

            // offset just a little bit
            atX--;
            atZ--;

            // increment the height if we are putting stairs in the basement
            if (addStairwell)
                stairHeight = sewerHeight + streetHeight;

            // place stairs
            for (airX = atX; airX < atX + stairHeight; airX++) {
                if (drawStairs)
                    for (airZ = atZ; airZ < atZ + 2; airZ++) {
                        blocks[airX][floorY][airZ] = BlockID.AIR;
                        blocks[airX][floorY - (stairHeight - (airX - atX)) + 1][airZ] = stairID;
                    };

                // make sure we don't fall down the stairs
                if (addGuardrail) {
                    blocks[airX][floorY + 1][atZ + 2] = BlockID.FENCE;
                    blocks[airX][floorY + 1][atZ - 1] = BlockID.FENCE;
                }
            }

            // create a basement enclosure to protect against the nasties
            if (addStairwell) {
                AddWalls(BlockID.STONE, atX - 4, sewerFloor, atZ - 1,
                                        atX + stairHeight, streetLevel, atZ + 2);

                // and a door 
                SetLateBlock(atX - sewerHeight + 1, sewerFloor, atZ + 2, ExtendedID.WESTFACING_WOODEN_DOOR);
            }
        }

        // add final stair railing
        function FinalizeStairs(atX, atZ, floorAt, addGuardrail) {
            if (addGuardrail) {

                // how big are the stairs?
                var stairWidth = 2;
                var stairHeight = floorHeight;

                // three more to finish things up
                for (var z = 0; z < 4; z++)
                    blocks[atX - 2][floorAt][atZ + z - 2] = BlockID.FENCE;
            }
        }
    }
