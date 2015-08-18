    //======================================================
    function DrawHouseCell(blockX, blockZ, cellX, cellZ, blockW, blockL) {
        var blockY = streetLevel + 1;

        // ground please
        FillCube(BlockID.GRASS, blockX, blockY, blockZ, blockX + blockW - 1, blockY, blockZ + blockL - 1);

        // pick a color
        var wallID = EncodeBlock(BlockID.CLOTH, rand.nextInt(16));
        var ceilingID = BlockID.WOOD;
        var floorID = BlockID.CLOTH;

        // place the rooms
        PlaceRoom(ceilingID, wallID, floorID, blockX, blockY, blockZ, 0, 0, 1, 1, cellX, cellZ);
        PlaceRoom(ceilingID, wallID, floorID, blockX, blockY, blockZ, 0, 1, 1, 1, cellX, cellZ);
        PlaceRoom(ceilingID, wallID, floorID, blockX, blockY, blockZ, 1, 0, 1, 1, cellX, cellZ);
        PlaceRoom(ceilingID, wallID, floorID, blockX, blockY, blockZ, 1, 1, 1, 1, cellX, cellZ);

        // interior walkways
        PlaceWalkways(blockX, blockY, blockZ, 3, 0);
        PlaceWalkways(blockX, blockY, blockZ, 0, 3);

        // extrude roof
        for (var y = 1; y < floorHeight; y++)
            for (var x = 0; x < blockW; x++)
                for (var z = 0; z < blockL; z++)
                    if (blocks[blockX + x + 1][blockY + floorHeight + y - 1][blockZ + z] != BlockID.AIR &&
                        blocks[blockX + x - 1][blockY + floorHeight + y - 1][blockZ + z] != BlockID.AIR &&
                        blocks[blockX + x][blockY + floorHeight + y - 1][blockZ + z + 1] != BlockID.AIR &&
                        blocks[blockX + x][blockY + floorHeight + y - 1][blockZ + z - 1] != BlockID.AIR)
                        blocks[blockX + x][blockY + floorHeight + y][blockZ + z] = ceilingID;

        // carve out the attic
        for (var y = 1; y < floorHeight; y++)
            for (var x = 0; x < blockW; x++)
                for (var z = 0; z < blockL; z++)
                    if (blocks[blockX + x][blockY + floorHeight + y + 1][blockZ + z] != BlockID.AIR)
                        blocks[blockX + x][blockY + floorHeight + y][blockZ + z] = BlockID.AIR;
    }

    function PlaceWalkways(blockX, blockY, blockZ, offsetX, offsetZ) {
        var atX = blockX + 10;
        var atZ = blockZ + 10;

        blocks[atX + offsetX][blockY + 1][atZ + offsetZ] = BlockID.AIR;
        blocks[atX + offsetX][blockY + 2][atZ + offsetZ] = BlockID.AIR;

        blocks[atX - offsetX][blockY + 1][atZ - offsetZ] = BlockID.AIR;
        blocks[atX - offsetX][blockY + 2][atZ - offsetZ] = BlockID.AIR;
    }

    function PlaceRoom(ceilingID, wallID, floorID, blockX, blockY, blockZ, roomX, roomZ, roomW, roomL, cellX, cellZ) {
        var blockW = roomW * (6 + rand.nextInt(3));
        var blockL = roomL * (6 + rand.nextInt(3));
        var atX = blockX + 11 + (roomX == 0 ? -blockW : -1);
        var atZ = blockZ + 11 + (roomZ == 0 ? -blockL : -1);
        var windowOffset = 1;

        // room itself
        AddBox(ceilingID, wallID, floorID, atX, blockY, atZ, atX + blockW - 1, blockY + floorHeight, atZ + blockL - 1);

        // exterior windows
        RandomizeOffset();
        if (roomX == 0) {
            if (roomZ == 0) {
                blocks[atX][blockY + 1][atZ + 1] = BlockID.AIR;
                blocks[atX][blockY + 2][atZ + 1] = BlockID.AIR;
                SetLateBlock(atX, blockY + 1, atZ + 1, ExtendedID.NORTHFACING_WOODEN_DOOR);

                windowOffset = 3;
            }

            blocks[atX][blockY + 2][atZ + windowOffset] = BlockID.GLASS;
            blocks[atX][blockY + 3][atZ + windowOffset] = BlockID.GLASS;
            blocks[atX][blockY + 2][atZ + windowOffset + 1] = BlockID.GLASS;
            blocks[atX][blockY + 3][atZ + windowOffset + 1] = BlockID.GLASS;
        } else {
            if (roomZ == 1) {
                blocks[atX + blockW - 1][blockY + 1][atZ + 1] = BlockID.AIR;
                blocks[atX + blockW - 1][blockY + 2][atZ + 1] = BlockID.AIR;
                SetLateBlock(atX + blockW - 1, blockY + 1, atZ + 1, ExtendedID.SOUTHFACING_WOODEN_DOOR);

                windowOffset = 3;
            }

            blocks[atX + blockW - 1][blockY + 2][atZ + windowOffset] = BlockID.GLASS;
            blocks[atX + blockW - 1][blockY + 3][atZ + windowOffset] = BlockID.GLASS;
            blocks[atX + blockW - 1][blockY + 3][atZ + windowOffset + 1] = BlockID.GLASS;
            blocks[atX + blockW - 1][blockY + 2][atZ + windowOffset + 1] = BlockID.GLASS;
        }

        RandomizeOffset();
        if (roomZ == 0) {
            blocks[atX + windowOffset][blockY + 2][atZ] = BlockID.GLASS;
            blocks[atX + windowOffset][blockY + 3][atZ] = BlockID.GLASS;
            blocks[atX + windowOffset + 1][blockY + 2][atZ] = BlockID.GLASS;
            blocks[atX + windowOffset + 1][blockY + 3][atZ] = BlockID.GLASS;
        } else {
            blocks[atX + windowOffset][blockY + 2][atZ + blockL - 1] = BlockID.GLASS;
            blocks[atX + windowOffset][blockY + 3][atZ + blockL - 1] = BlockID.GLASS;
            blocks[atX + windowOffset + 1][blockY + 2][atZ + blockL - 1] = BlockID.GLASS;
            blocks[atX + windowOffset + 1][blockY + 3][atZ + blockL - 1] = BlockID.GLASS;
        }

        function RandomizeOffset() {
            windowOffset = 1 + rand.nextInt(3);
        }
    }

    function AddBox(ceilingID, wallID, floorID, minX, minY, minZ, maxX, maxY, maxZ) {
        for (var x = minX; x <= maxX; x++)
            for (var y = minY; y <= maxY; y++)
                for (var z = minZ; z <= maxZ; z++)
                    if (y == maxY)
                        blocks[x][y][z] = ceilingID
                    else if (x == minX || x == maxX || z == minZ || z == maxZ)
                        blocks[x][y][z] = wallID
                    else if (y == minY)
                        blocks[x][y][z] = floorID;
    }
