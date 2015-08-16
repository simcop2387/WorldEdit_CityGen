City Generator for WorldEdit's CraftScript

Based off FAB.JS from ShawnsSpace which is based on FAB.JS from echurchill

Command Usage
=============

/cs fab [..city block option..] [HELP] [RANDOM] [FIRSTTIME]
  Fabricate again on this spot using the location's natural random seed, this can be overridden
  Each city block built uses a random seed based on it's XYZ location

>>city block options..
HIGHRISE    - buildings are as large as possible, buildings tend to be narrower
MIDRISE*    - buildings are about 2/3 as tall as possible
LOWRISE     - buildings are about 1/3 as tall as possible 
TOWN        - buildings are about 1/4 as tall as possible, parks can be larger
PARK        - city block size park
FARM        - farm with up to four different crops
FARMHOUSE   - like a farm but a house instead of one of the crops
HOUSES      - four cute little houses with fenced yards
DIRTLOT     - city block size dirt lot
PARKINGLOT  - parking structure
JUSTSTREETS - city block size hole in the ground
            - last city block option specified wins!
            - * = MIDRISE is used if nothing else is specified

>>other options..
HELP        - shows the command line options
RANDOM      - build using a true random seed instead of one based on location
FIRSTTIME   - overrides the rift protection and allows for creation of city blocks anywhere

Comments
========
The first time you use this script you will need to specify FIRSTTIME. From then on,
as long as you are standing within a cross road, you can simply run the script to 
generate a new city block (or regenerate an existing block). 

The goodness isn't just above ground, make sure to explore any manholes or bricked
up door's you find. Becareful though, those bricks are there for a reason sometimes.

Known Issues
============

If you get a timeout error when running this script, open "plugins/worldedit/config.yml" and change "timeout" value (should be under "Scripting") to 10000 or larger
I would warn people when timeout is too small, alas context.configuration does not seem to work anymore
I would love to figure out the height of the tallest legal block allowed by Minecraft given the player's location, for now I assume it's around 127

Potential Upcoming Improvements
===============================

Buried chest at the city block origin that allow for designing of city blocks (and random seed storage)
Bottom stairs, with no basement, should be backfilled a bit.. right?
Gazebos (single level buildings that have columns)
WATERTOWER centered in a park
Fancy fountians (multiple founts, rounder and/or scale up in larger parks)
Two story and/or L shaped houses

Ponder
======

How do I warn folks if their timeout is too short?
Interior room generator? 
Ponds and canals (with bridges)
Preposition lightstone or torches in buildings?
Government buildings with columns
Reduce the width/depth of building floors as they go up (empire state building style)
Improved slanted roofs (using steps) with overhangs
http://en.wikipedia.org/wiki/Fountain_Place
http://skyscraperpage.com
http://skyscraperpage.com/cities/?buildingID=229 (Prism)
http://skyscraperpage.com/cities/?buildingID=1601 (Pyramid)

Answered
========

How do I increase the duration of script execution? - plugins/worldedit/config.yml

Left to player(s)
=================
Instead of basements, single level parking garages under 2x2 or larger buildings
Plumbing level isn't bounded at the city edge 
Air bridges between buildings? 
Should replace outer most sidewalk with grass 
