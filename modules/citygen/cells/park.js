function DrawParkCell(blockX, blockZ, cellX, cellZ, cellW, cellL) {
    var cellWidth = cellW * squareBlocks;
    var cellLength = cellL * squareBlocks;

    // reservoir's walls
    FillCellLayer(BlockID.SANDSTONE, blockX, blockZ, 0, cellW, cellL);
    AddWalls(BlockID.SANDSTONE, blockX, 1, blockZ,
                                blockX + cellWidth - 1, streetLevel - 1, blockZ + cellLength - 1);

    // fill up reservoir with water
    FillCube(BlockID.AIR, blockX + 1, 1, blockZ + 1,
                          blockX + cellWidth - 2, 3, blockZ + cellLength - 2);
    FillCube(BlockID.WATER, blockX + 1, 1, blockZ + 1,
                            blockX + cellWidth - 2, rand.nextInt(3) + 2, blockZ + cellLength - 2);

    // pillars to hold things up
    for (var x = cornerWidth; x < cellWidth; x = x + cornerWidth)
        for (var z = cornerWidth; z < cellLength; z = z + cornerWidth)
            for (var y = 1; y < streetLevel; y++) {

                // every other column has a lit base
                if (y == 1 && ((x % 2 == 0 && z % 2 == 1) ||
                               (x % 2 == 1 && z % 2 == 0)))
                    blocks[blockX + x][y][blockZ + z] = BlockID.LIGHTSTONE;
                else
                    blocks[blockX + x][y][blockZ + z] = BlockID.SANDSTONE;
            }

    // cap it off
    FillCellLayer(BlockID.SANDSTONE, blockX, blockZ, streetLevel, cellW, cellL);

    // add some grass
    FillCellLayer(BlockID.GRASS, blockX, blockZ, streetLevel + 1, cellW, cellL);

    // steps up to access point
    blocks[blockX + 7][streetLevel - 6][blockZ + 1] = BlockID.SANDSTONE;
    blocks[blockX + 6][streetLevel - 5][blockZ + 1] = BlockID.SANDSTONE;
    blocks[blockX + 5][streetLevel - 4][blockZ + 1] = BlockID.SANDSTONE;

    // platform for access point
    blocks[blockX + 4][streetLevel - 3][blockZ + 1] = BlockID.SANDSTONE;
    blocks[blockX + 3][streetLevel - 3][blockZ + 1] = BlockID.SANDSTONE;
    blocks[blockX + 2][streetLevel - 3][blockZ + 1] = BlockID.SANDSTONE;
    blocks[blockX + 1][streetLevel - 3][blockZ + 1] = BlockID.SANDSTONE;

    // backfill the wall behind the ladders
    blocks[blockX + 2][streetLevel - 2][blockZ + 1] = BlockID.SANDSTONE;
    blocks[blockX + 1][streetLevel - 2][blockZ + 1] = BlockID.SANDSTONE;
    blocks[blockX + 2][streetLevel - 1][blockZ + 1] = BlockID.SANDSTONE;
    blocks[blockX + 1][streetLevel - 1][blockZ + 1] = BlockID.SANDSTONE;

    // and now the ladders and trapdoor
    SetLateBlock(blockX + 3, streetLevel + 1, blockZ + 1, ExtendedID.SOUTHWARD_LADDER);
    SetLateBlock(blockX + 3, streetLevel, blockZ + 1, ExtendedID.SOUTHWARD_LADDER);
    SetLateBlock(blockX + 3, streetLevel - 1, blockZ + 1, ExtendedID.SOUTHWARD_LADDER);
    SetLateBlock(blockX + 3, streetLevel - 2, blockZ + 1, ExtendedID.SOUTHWARD_LADDER);
    SetLateBlock(blockX + 3, streetLevel + 2, blockZ + 1, ExtendedID.WESTFACING_TRAP_DOOR);

    // add some fencing
    var fenceHole = 3;
    for (var x = 0; x < cellWidth; x++) {

        // simple columns
        if (x == fenceHole || x == cellWidth - fenceHole - 1) {
            blocks[blockX + x][streetLevel + 2][blockZ] = BlockID.SAND;
            blocks[blockX + x][streetLevel + 2][blockZ + cellLength - 1] = BlockID.SAND;
            blocks[blockX + x][streetLevel + 3][blockZ] = BlockID.SANDSTONE;
            blocks[blockX + x][streetLevel + 3][blockZ + cellLength - 1] = BlockID.SANDSTONE;
            blocks[blockX + x][streetLevel + 4][blockZ] = ExtendedID.SANDSTONE_STEP;
            blocks[blockX + x][streetLevel + 4][blockZ + cellLength - 1] = ExtendedID.SANDSTONE_STEP;

            // fence itself
        } else if (x > fenceHole && x < cellWidth - fenceHole) {
            blocks[blockX + x][streetLevel + 2][blockZ] = BlockID.FENCE;
            blocks[blockX + x][streetLevel + 2][blockZ + cellLength - 1] = BlockID.FENCE;
        }
    }

    // another fence along the other axis
    for (var z = 0; z < cellLength; z++) {
        if (z == fenceHole || z == cellLength - fenceHole - 1) {
            blocks[blockX][streetLevel + 2][blockZ + z] = BlockID.SAND;
            blocks[blockX + cellWidth - 1][streetLevel + 2][blockZ + z] = BlockID.SAND;
            blocks[blockX][streetLevel + 3][blockZ + z] = BlockID.SANDSTONE;
            blocks[blockX + cellWidth - 1][streetLevel + 3][blockZ + z] = BlockID.SANDSTONE;
            blocks[blockX][streetLevel + 4][blockZ + z] = ExtendedID.SANDSTONE_STEP;
            blocks[blockX + cellWidth - 1][streetLevel + 4][blockZ + z] = ExtendedID.SANDSTONE_STEP;
        } else if (z > fenceHole && z < cellLength - fenceHole) {
            blocks[blockX][streetLevel + 2][blockZ + z] = BlockID.FENCE;
            blocks[blockX + cellWidth - 1][streetLevel + 2][blockZ + z] = BlockID.FENCE;
        }
    }

    // little park, give it a big tree
    if (cellW == 1 && cellL == 1)
        SetLateTree(blockX + Math.floor(cellWidth / 2),
                    streetLevel + 1,
                    blockZ + Math.floor(cellLength / 2), true);
    else {

        // where is the center?
        var fountainDiameter = 5;
        var fountainX = blockX + Math.floor((cellWidth - fountainDiameter) / 2);
        var fountainZ = blockZ + Math.floor((cellLength - fountainDiameter) / 2);

        // add a fountain
        FillAtLayer(BlockID.GLASS, fountainX + 1, fountainZ + 1, streetLevel, fountainDiameter - 2, fountainDiameter - 2);
        AddWalls(BlockID.STONE, fountainX, streetLevel + 1, fountainZ,
                            fountainX + fountainDiameter - 1, streetLevel + 2, fountainZ + fountainDiameter - 1);
        FillAtLayer(BlockID.WATER, fountainX + 1, fountainZ + 1, streetLevel + 1, fountainDiameter - 2, fountainDiameter - 2);

        blocks[fountainX + 2][streetLevel + 1][fountainZ + 2] = BlockID.LIGHTSTONE;
        blocks[fountainX + 2][streetLevel + 2][fountainZ + 2] = BlockID.GLASS;
        blocks[fountainX + 2][streetLevel + 3][fountainZ + 2] = BlockID.GLASS;
        blocks[fountainX + 2][streetLevel + 4][fountainZ + 2] = BlockID.GLASS;
        blocks[fountainX + 2][streetLevel + 5][fountainZ + 2] = BlockID.WATER;

        // add some trees
        SetLateForest(blockX, blockZ, cellWidth, cellLength);
    }
}
