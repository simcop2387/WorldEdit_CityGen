// what do you want to create
var helpString = "[HIGHRISE | MIDRISE | LOWRISE | TOWN | PARK | DIRTLOT | PARKINGLOT | JUSTSTREETS | FARM | FARMHOUSE | HOUSES] [HELP] [RANDOM] [FIRSTTIME] [NOUNDO]"
context.checkArgs(0, -1, helpString);

function doHelp() {
    context.print("USAGE: " + argv[0] + " " + helpString);
}