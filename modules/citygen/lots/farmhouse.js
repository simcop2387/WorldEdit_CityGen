function AddFarmAndHousesLot() {
    FillCube(BlockID.DIRT, 1 * squareBlocks, sewerFloor, 1 * squareBlocks,
                           4 * squareBlocks - 1, streetLevel, 4 * squareBlocks - 1);

    for (var at = 0; at < squareBlocks * 3; at++) {
        blocks[squareBlocks + at][streetLevel + 1][squareBlocks + lotBlocks] = BlockID.GRASS;
        blocks[squareBlocks + lotBlocks][streetLevel + 1][squareBlocks + at] = BlockID.GRASS;
        if (at < lotBlocks - 2 || at > lotBlocks + 2) {
            blocks[squareBlocks + at][streetLevel + 2][squareBlocks + lotBlocks] = BlockID.FENCE;
            blocks[squareBlocks + lotBlocks][streetLevel + 2][squareBlocks + at] = BlockID.FENCE;
        }
    }

    // house or not?
    var houseCreated = modeCreate != createMode.FARMHOUSE;
    var atX = 0;
    var atZ = 0;

    // do it!
    for (var a = 0; a <= 1; a++) {
        for (var b = 0; b <= 1; b++) {
            atX = squareBlocks + (lotBlocks + 1) * a;
            atZ = squareBlocks + (lotBlocks + 1) * b;

            // just HOUSES
            if (modeCreate == createMode.HOUSES) {
                DrawHouseCell(atX, atZ, a, b, lotBlocks, lotBlocks);

                // in FARM or FARMHOUSE mode
            } else if (!houseCreated && ((a == 1 && b == 1) ||
                                         (OneInFourChance()))) {
                houseCreated = true;
                DrawHouseCell(atX, atZ, a, b, lotBlocks, lotBlocks);
            } else {
                DrawFarmCell(atX, atZ, a, b, lotBlocks, lotBlocks);
            }
        }
    }
}