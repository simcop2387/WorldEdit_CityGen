////////////////////////////////////////////////////
// fix up logic for blocks
////////////////////////////////////////////////////

var fixups;

function InitializeFixups() {
    fixups = new Array();
}

function FinalizeFixups() {
    if (fixups.length > 0) {
        context.print("Placing special items");
        for (i = 0; i < fixups.length; i++)
            fixups[i].setBlock(origin);
    }
}

function SetLateBlock(atX, atY, atZ, id) {
    SetLateBlockEx(atX, atY, atZ, id, false);
}

function SetLateGroundBlock(atX, atY, atZ, id) {
    SetLateBlockEx(atX, atY, atZ, id, true);
}

function SetLateBlockEx(atX, atY, atZ, id, groundCheck) {
    // make sure there is room
    blocks[atX][atY][atZ] = BlockID.AIR;

    // handle any "more than one cube" items
    if (DecodeID(id) == BlockID.WOODEN_DOOR)
        blocks[atX][atY + 1][atZ] = BlockID.AIR;

    // keep a note of things to go
    fixups.push(new LateItem(atX, atY, atZ, id, groundCheck));
}

function LateItem(atX, atY, atZ, id, groundCheck) {
    this.blockId = id;
    this.blockX = atX
    this.blockY = atY
    this.blockZ = atZ;
    this.groundCheck = groundCheck;

    this.setBlock = function (origin) {
        if (!this.groundCheck || blocks[this.blockX][this.blockY - 1][this.blockZ] != BlockID.AIR) {
            var id = DecodeID(this.blockId);
            var data = DecodeData(this.blockId);
            var at = origin.add(this.blockX, this.blockY, this.blockZ);

            SetBlockIfNeeded(at, id, data, false);
            if (id == BlockID.WOODEN_DOOR)
                SetBlockIfNeeded(at.add(0, 1, 0), id, data + 8, false);
        }
    }
}

////////////////////////////////////////////////////
// fix up logic for trees
////////////////////////////////////////////////////

var trees;
var archTypeTree;
var archTypeBigTree;

function InitializeTrees() {
    trees = new Array();
    archTypeTree = new TreeGenerator(TreeGenerator.TreeType.TREE);
    archTypeBigTree = new TreeGenerator(TreeGenerator.TreeType.BIG_TREE);
}

function FinalizeTrees() {
    if (trees.length > 0) {
        context.print("Growing some trees");
        for (i = 0; i < trees.length; i++)
            trees[i].generate(origin);
    }
}

function SetLateForest(blockX, blockZ, sizeW, sizeL) {
    var border = 3;
    var spacing = 3;
    var odds = 10;

    for (var x = blockX + border; x <= blockX + sizeW - border; x = x + spacing)
        for (var z = blockZ + border; z <= blockZ + sizeL - border; z = z + spacing) {

            // odds% of the time plant a tree
            if (rand.nextInt(100) < odds)
                SetLateTree(x, streetLevel + 1, z, false);
        }
}

function SetLateTree(blockX, blockY, blockZ, bigTree) {
    trees.push(new Tree(blockX, blockY, blockZ, bigTree));
}

function Tree(blockX, blockY, blockZ, bigTree) {
    this.atX = blockX;
    this.atY = blockY;
    this.atZ = blockZ;
    this.big = bigTree;

    this.generate = function (origin) {
        if (editsess.rawGetBlock(origin.add(this.atX, this.atY, this.atZ)).getType() == BlockID.GRASS)
            if (this.big)
                archTypeBigTree.generate(editsess, origin.add(this.atX, this.atY + 1, this.atZ))
            else
                archTypeTree.generate(editsess, origin.add(this.atX, this.atY + 1, this.atZ));
    }
}

////////////////////////////////////////////////////
// fix up logic for support columns
////////////////////////////////////////////////////

function FinalizeColumns() {
    context.print("Driving pilings");
    var columnOffset = squareBlocks / 3;
    var y;
    for (var x = columnOffset; x < squareBlocks * 5; x += columnOffset)
        for (var z = columnOffset; z < squareBlocks * 5; z += columnOffset) {

            // find the lowest airy point
            for (y = 0; y < skyHigh; y++)
                if (blocks[x][y][z] != BlockID.AIR) {
                    y--;
                    break;
                }

            // grow the column at...
            var columnAt = origin.add(x, y, z);
            for (y = columnAt.getY(); y >= 0; y--) {
                columnAt = columnAt.setY(y);
                
                // time to quit?
                type = editsess.rawGetBlock(columnAt).getType();
                if (type == BlockID.STONE || type == BlockID.BEDROCK)
                    break;

                // big columns!
                SetBlockIfNeeded(columnAt, BlockID.STONE, 0, true);
                SetBlockIfNeeded(columnAt.add(1, 0, 0), BlockID.STONE, 0, true);
                SetBlockIfNeeded(columnAt.add(-1, 0, 0), BlockID.STONE, 0, true);
                SetBlockIfNeeded(columnAt.add(0, 0, 1), BlockID.STONE, 0, true);
                SetBlockIfNeeded(columnAt.add(0, 0, -1), BlockID.STONE, 0, true);
            }
        }
}