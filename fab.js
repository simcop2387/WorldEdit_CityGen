// $Id$
/***** FAB.JS v1.0
* City block generator CraftScript for WorldEdit
* (parts of this is based on WorldEdit's sample Maze generator)
* Copyright (C) 2011 echurch <http://www.virtualchurchill.com>
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

importPackage(Packages.java.io);
importPackage(Packages.java.awt);
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);
importPackage(Packages.com.sk89q.worldedit.regions);
importPackage(Packages.com.sk89q.worldedit.util);

var globalThis = this;

// for future reference
var editsess = context.remember();
var world = editsess.getWorld();
var session = context.getSession();
var origin = player.getBlockIn();
var rand = new java.util.Random();
var originOffsetX = 0;
var originOffsetZ = 0;

// load in the modules
require_module("citygen/util");
require_module("citygen/blocks");
require_module("citygen/help");
require_module("citygen/cells");
require_module("citygen/fixups");
require_module("citygen/plumbing");
require_module("citygen/fixups");
require_module("citygen/main");
require_module("citygen/lots");

// stats
var blocksTotal = 0;
var blocksSet = 0;

var createMode = { "HIGHRISE": 0, "MIDRISE": 1, "LOWRISE": 2, "TOWN": 3,
    "PARK": 4, "DIRTLOT": 5, "PARKINGLOT": 6, "JUSTSTREETS": 7,
    "FARM": 8, "FARMHOUSE": 9, "HOUSES": 10, "HELP": -1
};

// got to default with something
var modeCreate = createMode.MIDRISE;
var floorRatio = 0.66;
var offsetX = 0;
var offsetZ = 0;
var randSeed = false;
var firstTime = false;
var noundo = false;

// parse those args! last create mode wins!
for (var i = 1; i < argv.length; i++) {
    var arg = argv[i];

    // look for longest params first, that way FARMHOUSE can be found instead of FARM
    if (/JUSTSTREET/i.test(arg))        // also JUSTSTREETS
        modeCreate = createMode.JUSTSTREETS;
    else if (/PARKING/i.test(arg))      // also PARKINGLOT
        modeCreate = createMode.PARKINGLOT
    else if (/FARMHOUSE/i.test(arg))
        modeCreate = createMode.FARMHOUSE
    else if (/HIGHRISE/i.test(arg))
        modeCreate = createMode.HIGHRISE
    else if (/MIDRISE/i.test(arg))
        modeCreate = createMode.MIDRISE
    else if (/LOWRISE/i.test(arg))
        modeCreate = createMode.LOWRISE
    else if (/HOUSE/i.test(arg))        // also HOUSES
        modeCreate = createMode.HOUSES
    else if (/DIRT/i.test(arg))         // also DIRTLOT
        modeCreate = createMode.DIRTLOT
    else if (/FARM/i.test(arg))
        modeCreate = createMode.FARM
    else if (/TOWN/i.test(arg))
        modeCreate = createMode.TOWN
    else if (/PARK/i.test(arg))
        modeCreate = createMode.PARK

    else if (/RANDOM/i.test(arg))
        randSeed = true

    else if (/FIRSTTIME/i.test(arg))      
        firstTime = true

    else if (/NOUN/i.test(arg))
        noundo = true

    else if (/HELP/i.test(arg))
        modeCreate = createMode.HELP;
    else if (/\?/.test(arg))
        modeCreate = createMode.HELP;
}

// This ought to keep track of what's loaded
function require_module(module_name) {
	return importJScript(module_name+".js", "craftscripts/modules");
}

// This will eval the string inside the current context, letting us define
// functions and other things inside the same context/scope.
function eval_string(string) {
	return importJScript(string, null, null, true);
}

// This little gem is borrowed from inHaze's wonderful build script
// It lets us bring in a javascript file from external, so we can keep
// the code better organized.
function importJScript(jScript, dir, globalObj, strBool) {
	try {
		jScript = jScript instanceof Array === true ? jScript : new Array(jScript);
		globalObj = typeof globalObj === 'undefined'  || globalObj === null ? globalThis : globalObj;
		dir = typeof dir === 'undefined' ? "craftscripts\\" : dir;
	 
		var cx = org.mozilla.javascript.Context.getCurrentContext();
		var newScope = cx.initStandardObjects(globalObj);
		var info = [0,0, new java.util.Date().getTime()];

		if (!strBool) {                        //load javascript source from external file(s)
			for (var inc in jScript) {
				var file = context.getSafeFile(dir, jScript[inc]);
				if(!file.exists()){
					player.print("\u00A7cError: \u00A7fUnable to locate import file \u00A76" + file);
					continue;
				}
				var fileSize = file.length();                     
				var buffer = new java.io.FileReader(file);
				cx.evaluateReader(newScope, buffer, "YourScriptIdentifier" + file.getName(), 1, null);
				buffer.close();
				info[0]++;
				info[1]+= fileSize;
			}
		}
		else {                                //load javascript source from internal string(s)
			for (var inc in jScript) {
				cx.evaluateString(newScope, jScript[inc], "YourScriptIdentifier", 1, null);
				info[0]++;
				info[1]+= String(jScript[inc]).length;
			}     
		}
		info[2] = (new java.util.Date().getTime() - info[2]);
		return info;
	}
	catch(e) {
		if (e.javaException) player.print("\u00A7cJava Error: \u00A76{ \u00A7f" + e.javaException + " \u00A76}");
		if (e.rhinoException) player.print("\u00A7cRhino Error: \u00A76{ \u00A7f" + e.rhinoException + " \u00A76}");
	}
};

// some constants
var squareBlocks = 15;
var cornerWidth = squareBlocks / 3;
var lotBlocks = ((squareBlocks * 3) - 1) / 2;
var linesOffset = Math.floor(squareBlocks / 2);
var squaresWidth = 5;
var squaresLength = 5;
var plumbingHeight = 5;
var sewerHeight = 4;
var streetHeight = 2;
var floorHeight = 4;
var roofHeight = 1; // extra bit for roof fluff like railings

// say hello!
context.print(argv[0] + " v1.5");

// see if we can find the offset
if (!FindOriginOffset()) {
    // we can't, go anyway?
    if (firstTime) {
        originOffsetX = -linesOffset;
        originOffsetZ = -linesOffset;
    // if not tell the user what happened
    } else {
        context.print("ERROR: Cannot find the crossroads.");
        context.print(" Either walk to a crossroad or...")
        context.print(" use FIRSTTIME option to force creation from this spot.");
        modeCreate = createMode.HELP;
    }
} else
    firstTime = true;

// show help
if (modeCreate == createMode.HELP)
  doHelp();
else 
  main();