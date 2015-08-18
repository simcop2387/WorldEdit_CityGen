// borrowed from WorldEdit's Maze script
function AddPlumbingLevel() {
    context.print("Plumbing");

    // add some strata
    FillStrataLayer(BlockID.OBSIDIAN, 0);

    // figure out the size
    w = Math.floor(arrayWidth / 2);
    d = Math.floor(arrayDepth / 2);

    var stack = [];
    var visited = {};
    var noWallLeft = new Array(w * d);
    var noWallAbove = new Array(w * d);
    var current = 0;

    stack.push(id(0, 0))

    while (stack.length > 0) {
        var cell = stack.pop();
        var x = $x(cell), z = $z(cell);
        visited[cell] = true;

        var neighbors = []

        if (x > 0) neighbors.push(id(x - 1, z));
        if (x < w - 1) neighbors.push(id(x + 1, z));
        if (z > 0) neighbors.push(id(x, z - 1));
        if (z < d - 1) neighbors.push(id(x, z + 1));

        shuffle(neighbors);

        while (neighbors.length > 0) {
            var neighbor = neighbors.pop();
            var nx = $x(neighbor), nz = $z(neighbor);

            if (visited[neighbor] != true) {
                stack.push(cell);

                if (z == nz) {
                    if (nx < x) {
                        noWallLeft[cell] = true;
                    } else {
                        noWallLeft[neighbor] = true;
                    }
                } else {
                    if (nz < z) {
                        noWallAbove[cell] = true;
                    } else {
                        noWallAbove[neighbor] = true;
                    }
                }

                stack.push(neighbor);
                break;
            }
        }
    }

    for (var z = 0; z < d; z++) {
        for (var x = 0; x < w; x++) {
            var cell = id(x, z);

            if (!noWallLeft[cell] && z < d) {
                blocks[x * 2 + 1][1][z * 2] = BlockID.OBSIDIAN;
                blocks[x * 2 + 1][2][z * 2] = BlockID.OBSIDIAN;
                blocks[x * 2 + 1][3][z * 2] = BlockID.OBSIDIAN;
            }
            if (!noWallAbove[cell] && x < w) {
                blocks[x * 2][1][z * 2 + 1] = BlockID.OBSIDIAN;
                blocks[x * 2][2][z * 2 + 1] = BlockID.OBSIDIAN;
                blocks[x * 2][3][z * 2 + 1] = BlockID.OBSIDIAN;
            }
            blocks[x * 2 + 1][1][z * 2 + 1] = BlockID.OBSIDIAN;
            blocks[x * 2 + 1][2][z * 2 + 1] = BlockID.OBSIDIAN;
            blocks[x * 2 + 1][3][z * 2 + 1] = BlockID.OBSIDIAN;

            switch (rand.nextInt(20)) {
                case 0:
                case 1:
                    if (OneInThreeChance())
                        blocks[x * 2][1][z * 2] = BlockID.OBSIDIAN
                    else
                        blocks[x * 2][1][z * 2] = BlockID.DIRT;
                    SetLateGroundBlock(x * 2, 2, z * 2, BlockID.BROWN_MUSHROOM);
                    break;
                case 2:
                case 3:
                    if (OneInThreeChance())
                        blocks[x * 2][1][z * 2] = BlockID.OBSIDIAN
                    else
                        blocks[x * 2][1][z * 2] = BlockID.DIRT;
                    SetLateGroundBlock(x * 2, 1, z * 2, BlockID.RED_MUSHROOM);
                    break;
                case 4:
                    PlaceItem(x, z, BlockID.GOLD_BLOCK);
                    break;
                case 5:
                    PlaceItem(x, z, BlockID.DIAMOND_BLOCK);
                    break;
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    PlaceItem(x, z, BlockID.WATER);
                    break;
                default:
                    if (OneInFourChance())
                        blocks[x * 2][3][z * 2] = BlockID.OBSIDIAN
                    else
                        blocks[x * 2][1][z * 2] = BlockID.OBSIDIAN
                    break;
            }
        }
    }

    // top off the plumbing
    FillStrataLayer(BlockID.CLAY, 4);

    //======================================================
    function PlaceItem(x, z, id) {
        if (OneInFourChance()) {
            if (OneInTwoChance()) {
                blocks[x * 2][3][z * 2] = BlockID.OBSIDIAN
                blocks[x * 2][1][z * 2] = id;
            } else {
                blocks[x * 2][1][z * 2] = BlockID.OBSIDIAN;
                blocks[x * 2][2][z * 2] = id;
            }
        } else
            blocks[x * 2][1][z * 2] = id;
    }

    function id(x, z) {
        return z * (w + 1) + x;
    }

    function $x(i) {
        return i % (w + 1);
    }

    function $z(i) {
        return Math.floor(i / (w + 1));
    }

    function shuffle(arr) {
        var i = arr.length;
        if (i == 0) return false;
        while (--i) {
            var j = rand.nextInt(i + 1);
            var tempi = arr[i];
            var tempj = arr[j];
            arr[i] = tempj;
            arr[j] = tempi;
        }
    }
}