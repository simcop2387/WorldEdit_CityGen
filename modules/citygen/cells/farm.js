    function DrawFarmCell(blockX, blockZ, cellX, cellZ, blockW, blockL) {
        var blockY = streetLevel + 1;
        var bedType = rand.nextInt(22);
        var nsOrient = OneInTwoChance();

        for (var x = 0; x < blockW; x++)
            for (var z = 0; z < blockL; z++)
                if (x == 0 || z == 0 || x == blockW - 1 || z == blockL - 1)
                    blocks[x + blockX][blockY][z + blockZ] = BlockID.SOIL
                else
                    switch (bedType) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        if (nsOrient) {
                            if (z % 4 > 0) {
                                blocks[x + blockX][blockY][z + blockZ] = EncodeBlock(BlockID.SOIL, 8);
                                SetLateBlock(x + blockX, blockY + 1, z + blockZ, EncodeBlock(BlockID.CROPS, rand.nextInt(5) + 3));
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        else {
                            if (x % 4 > 0) {
                                blocks[x + blockX][blockY][z + blockZ] = EncodeBlock(BlockID.SOIL, 8);
                                SetLateBlock(x + blockX, blockY + 1, z + blockZ, EncodeBlock(BlockID.CROPS, rand.nextInt(5) + 3));
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        break;
                    case 7:
                    case 8: // wheat
                        if (nsOrient) {
                            if (z % 2 == 0) {
                                blocks[x + blockX][blockY][z + blockZ] = EncodeBlock(BlockID.SOIL, 8);
                                SetLateBlock(x + blockX, blockY + 1, z + blockZ, EncodeBlock(BlockID.CROPS, rand.nextInt(5) + 3));
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        else {
                            if (x % 2 == 0) {
                                blocks[x + blockX][blockY][z + blockZ] = EncodeBlock(BlockID.SOIL, 8);
                                SetLateBlock(x + blockX, blockY + 1, z + blockZ, EncodeBlock(BlockID.CROPS, rand.nextInt(5) + 3));
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        break;
                    case 9:
                    case 10: // reeds
                        if (nsOrient) {
                            if (z % 2 == 0) {
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.GRASS;
                                SetLateBlock(x + blockX, blockY + 1, z + blockZ, EncodeBlock(BlockID.REED, 15));
                                SetLateBlock(x + blockX, blockY + 2, z + blockZ, EncodeBlock(BlockID.REED, 15));
                                if (OneInTwoChance()) {
                                    SetLateBlock(x + blockX, blockY + 3, z + blockZ, EncodeBlock(BlockID.REED, 15));
                                    if (OneInTwoChance()) {
                                        SetLateBlock(x + blockX, blockY + 4, z + blockZ, EncodeBlock(BlockID.REED, 15));
                                    }
                                }
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        else {
                            if (x % 2 == 0) {
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.GRASS;
                                SetLateBlock(x + blockX, blockY + 1, z + blockZ, EncodeBlock(BlockID.REED, 15));
                                SetLateBlock(x + blockX, blockY + 2, z + blockZ, EncodeBlock(BlockID.REED, 15));
                                if (OneInTwoChance()) {
                                    SetLateBlock(x + blockX, blockY + 3, z + blockZ, EncodeBlock(BlockID.REED, 15));
                                    if (OneInTwoChance()) {
                                        SetLateBlock(x + blockX, blockY + 4, z + blockZ, EncodeBlock(BlockID.REED, 15));
                                    }
                                }
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        break;
                    case 11: // cactus
                        blocks[x + blockX][blockY][z + blockZ] = BlockID.SAND;
                        if (x % 2 == 0 && z % 2 == 1) {
                            SetLateBlock(x + blockX, blockY + 1, z + blockZ, EncodeBlock(BlockID.CACTUS, 15));
                            if (OneInTwoChance()) {
                                SetLateBlock(x + blockX, blockY + 2, z + blockZ, EncodeBlock(BlockID.CACTUS, 15));
                                if (OneInTwoChance()) {
                                    SetLateBlock(x + blockX, blockY + 3, z + blockZ, EncodeBlock(BlockID.CACTUS, 15));
                                }
                            }
                        }
                        break;
                    case 12: // roses
                        blocks[x + blockX][blockY][z + blockZ] = BlockID.GRASS;
                        SetLateBlock(x + blockX, blockY + 1, z + blockZ, BlockID.RED_FLOWER);
                        break;
                    case 13: // dandelion 
                        blocks[x + blockX][blockY][z + blockZ] = BlockID.GRASS;
                        SetLateBlock(x + blockX, blockY + 1, z + blockZ, BlockID.YELLOW_FLOWER);
                        break;
                    case 14: // random roses and dandelions
                        if (nsOrient) {
                            if (z % 2 == 0) {
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.GRASS;
                                if (OneInTwoChance())
                                    SetLateBlock(x + blockX, blockY + 1, z + blockZ, BlockID.RED_FLOWER)
                                else
                                    SetLateBlock(x + blockX, blockY + 1, z + blockZ, BlockID.YELLOW_FLOWER);
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        else {
                            if (x % 2 == 0) {
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.GRASS;
                                if (OneInTwoChance())
                                    SetLateBlock(x + blockX, blockY + 1, z + blockZ, BlockID.RED_FLOWER)
                                else
                                    SetLateBlock(x + blockX, blockY + 1, z + blockZ, BlockID.YELLOW_FLOWER);
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        break;
                    case 15: // trees
                        blocks[x + blockX][blockY][z + blockZ] = BlockID.GRASS;
                        if (x % 5 == 2 && z % 5 == 2)
                            SetLateTree(x + blockX, blockY, z + blockZ, false);
                        break;
                    case 16: // pumpkins
                        blocks[x + blockX][blockY][z + blockZ] = BlockID.DIRT;
                        if (x % 5 == 2 && z % 5 == 2) {
                            blocks[x + blockX][blockY][z + blockZ] = BlockID.LOG;
                            blocks[x + blockX][blockY + 1][z + blockZ] = BlockID.LEAVES;
                        }
                        if (nsOrient) {
                            if (z % 5 == 2) {
                                blocks[x + blockX][blockY + 1][z + blockZ] = BlockID.LEAVES;

                                if (OneInTwoChance())
                                    if (OneInFourChance())
                                        blocks[x + blockX][blockY + 1][z + blockZ - 1] = BlockID.PUMPKIN
                                    else
                                        blocks[x + blockX][blockY + 1][z + blockZ - 1] = BlockID.LEAVES;

                                if (OneInTwoChance())
                                    if (OneInFourChance())
                                        blocks[x + blockX][blockY + 1][z + blockZ + 1] = BlockID.PUMPKIN
                                    else
                                        blocks[x + blockX][blockY + 1][z + blockZ + 1] = BlockID.LEAVES;

                                if (OneInThreeChance())
                                    blocks[x + blockX][blockY + 2][z + blockZ] = BlockID.LEAVES;
                            }
                        }
                        else {
                            if (x % 5 == 2) {
                                blocks[x + blockX][blockY + 1][z + blockZ] = BlockID.LEAVES;

                                if (OneInTwoChance())
                                    if (OneInFourChance())
                                        blocks[x + blockX - 1][blockY + 1][z + blockZ] = BlockID.PUMPKIN
                                    else
                                        blocks[x + blockX - 1][blockY + 1][z + blockZ] = BlockID.LEAVES;

                                if (OneInTwoChance())
                                    if (OneInFourChance())
                                        blocks[x + blockX + 1][blockY + 1][z + blockZ] = BlockID.PUMPKIN
                                    else
                                        blocks[x + blockX + 1][blockY + 1][z + blockZ] = BlockID.LEAVES;

                                if (OneInThreeChance())
                                    blocks[x + blockX][blockY + 2][z + blockZ] = BlockID.LEAVES;
                            }
                        }
                        break;
                    case 17:
                    case 18: // Carrot
                        if (nsOrient) {
                            if (z % 4 > 0) {
                                blocks[x + blockX][blockY][z + blockZ] = EncodeBlock(BlockID.SOIL, 8);
                                SetLateBlock(x + blockX, blockY + 1, z + blockZ, EncodeBlock(141, rand.nextInt(5) + 3));
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        else {
                            if (x % 4 > 0) {
                                blocks[x + blockX][blockY][z + blockZ] = EncodeBlock(BlockID.SOIL, 8);
                                SetLateBlock(x + blockX, blockY + 1, z + blockZ, EncodeBlock(141, rand.nextInt(5) + 3));
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        break;
                    case 19:
                    case 20: // Potato
                        if (nsOrient) {
                            if (z % 4 > 0) {
                                blocks[x + blockX][blockY][z + blockZ] = EncodeBlock(BlockID.SOIL, 8);
                                SetLateBlock(x + blockX, blockY + 1, z + blockZ, EncodeBlock(142, rand.nextInt(5) + 3));
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        else {
                            if (x % 4 > 0) {
                                blocks[x + blockX][blockY][z + blockZ] = EncodeBlock(BlockID.SOIL, 8);
                                SetLateBlock(x + blockX, blockY + 1, z + blockZ, EncodeBlock(142, rand.nextInt(5) + 3));
                            } else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        break;
                    default: // unplanted rows
                        if (nsOrient) {
                            if (z % 2 == 0)
                                blocks[x + blockX][blockY][z + blockZ] = EncodeBlock(BlockID.SOIL, 8);
                            else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        else {
                            if (x % 2 == 0)
                                blocks[x + blockX][blockY][z + blockZ] = EncodeBlock(BlockID.SOIL, 8);
                            else
                                blocks[x + blockX][blockY][z + blockZ] = BlockID.WATER;
                        }
                        break;
                }
    }
