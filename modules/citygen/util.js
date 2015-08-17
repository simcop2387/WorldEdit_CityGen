// Anything I find that I think is a utility function goes here

function EncodeBlock(type, data) {
    //context.print(type + " " + data);
    return (data << 8) | type;
}

function DecodeID(block) {
    return block & 0xFF;
}

function DecodeData(block) {
    return block >> 8;
}

player.print("Hello World");
