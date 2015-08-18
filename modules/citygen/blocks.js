////////////////////////////////////////////////////
// all the supporting bits
////////////////////////////////////////////////////

function InitializeBlocks() {
    //context.print(arrayWidth + " " + arrayHeight + " " + arrayDepth);
    context.print("Initializing");
    for (var x = 0; x < arrayWidth; x++) {
        blocks[x] = new Array(arrayHeight);
        for (var y = 0; y < arrayHeight; y++) {
            blocks[x][y] = new Array(arrayDepth);
            for (var z = 0; z < arrayDepth; z++)
                blocks[x][y][z] = BlockID.AIR;
        }
    }
}

// etch our array of ints into the "real" world
function TranscribeBlocks() {
    context.print("Transcribing");
    var newblock;
    for (x = 0; x < arrayWidth; x++) {
        for (var y = 0; y < arrayHeight; y++) {
            for (var z = 0; z < arrayDepth; z++) {

                // decode the new block
                newblock = blocks[x][y][z];
                SetBlockIfNeeded(origin.add(x, y, z),
                                 DecodeID(newblock), DecodeData(newblock), true);
            }
        }
    }
}

function SetBlockIfNeeded(at, blockID, blockData, force) {
    var oldBlock = editsess.rawGetBlock(at);
    var oldID = oldBlock.getType();
    blocksTotal++;

    // if it isn't the same then set it!
    if (oldID != blockID || oldBlock.getData() != blockData) {

        // do force our way or only do so if there is air there?
        if (force || oldID == BlockID.AIR) {
            if (noundo)
                editsess.rawSetBlock(at, new BaseBlock(blockID, blockData));
            else
                editsess.setBlock(at, new BaseBlock(blockID, blockData));
            blocksSet++;
        }
    }
}


// need to standarize on one param style, these five are not consistent!
function AddWalls(blockID, minX, minY, minZ, maxX, maxY, maxZ) {
    for (var x = minX; x <= maxX; x++)
        for (var y = minY; y <= maxY; y++) {
            blocks[x][y][minZ] = blockID;
            blocks[x][y][maxZ] = blockID;
        }

    for (var y = minY; y <= maxY; y++)
        for (var z = minZ; z <= maxZ; z++) {
            blocks[minX][y][z] = blockID;
            blocks[maxX][y][z] = blockID;
        }
}

function FillCube(blockID, minX, minY, minZ, maxX, maxY, maxZ) {
    for (var x = minX; x <= maxX; x++)
        for (var y = minY; y <= maxY; y++)
            for (var z = minZ; z <= maxZ; z++)
                blocks[x][y][z] = blockID;
}

function FillAtLayer(blockID, blockX, blockZ, atY, layerW, layerL) {
    FillCube(blockID, blockX, atY, blockZ,
        blockX + layerW - 1, atY, blockZ + layerL - 1);
}

function FillCellLayer(blockID, blockX, blockZ, atY, cellW, cellL) {
    FillCube(blockID, blockX, atY, blockZ,
        blockX + cellW * squareBlocks - 1, atY, blockZ + cellL * squareBlocks - 1);
}

function FillStrataLayer(blockID, at) {
    FillAtLayer(blockID, 0, 0, at, arrayWidth, arrayDepth);
}