function AddCitySquares() {

    // upper limits
    var maxSize = 3;
    var maxParkSize = 1;
    var sizeX = 1;
    var sizeZ = 1;

    // if we are in a town then change them a bit
    if (modeCreate == createMode.TOWN) {
        maxSize = 2;
        maxParkSize = 2;
    } else if (modeCreate == createMode.HIGHRISE) {
        maxSize = 2;
    }

    // initialize the building cells
    var cells = new Array(3);
    for (var x = 0; x < 3; x++) {
        cells[x] = new Array(3);
        for (var z = 0; z < 3; z++)
            cells[x][z] = false;
    }

    // does this block have a park?
    if (modeCreate == createMode.TOWN ||
        modeCreate != createMode.HIGHRISE && OneInTwoChance()) {
        sizeX = RandomLotSize(maxParkSize);
        sizeZ = RandomLotSize(maxParkSize);
        var atX = rand.nextInt(maxSize - sizeX + 1);
        var atZ = rand.nextInt(maxSize - sizeZ + 1);

        // build the park then!
        MarkLotUsed(atX, atZ, sizeX, sizeZ);
        DrawParkCell((atX + 1) * squareBlocks, (atZ + 1) * squareBlocks,
                     atX, atZ, sizeX, sizeZ);
    }

    // work our way through the cells
    for (var atX = 0; atX < 3; atX++) {
        for (var atZ = 0; atZ < 3; atZ++) {
            if (!cells[atX][atZ]) { // nothing here yet.. build!
                sizeX = RandomLotSize(maxSize - atX);
                sizeZ = RandomLotSize(maxSize - atZ);

                // is there really width for it?
                for (var x = atX; x < atX + sizeX; x++) {
                    if (cells[x][atZ]) {
                        sizeX = x - atX;
                        break;
                    }
                }

                // is there really depth for it?
                for (var x = atX; x < atX + sizeX; x++) {
                    for (var z = atZ; z < atZ + sizeZ; z++) {
                        if (cells[x][z]) {
                            sizeZ = z - atZ;
                            break;
                        }
                    }
                }

                // mark the cells
                MarkLotUsed(atX, atZ, sizeX, sizeZ);

                // make it so!
                DrawBuildingCell((atX + 1) * squareBlocks, (atZ + 1) * squareBlocks,
                                 atX, atZ, sizeX, sizeZ);
            }
        }
    }

    function MarkLotUsed(atX, atZ, sizeX, sizeZ) {
        for (var x = atX; x < atX + sizeX; x++)
            for (var z = atZ; z < atZ + sizeZ; z++)
                cells[x][z] = true;
    }
}



