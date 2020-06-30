
# Surface Tiles, Tile tooltips, Map sizing

Now that the world map is rendered, I need to render surface tiles on top of the world tiles such as Trees, bushes, and eventually animals. Tooltips are important as well, I want on hover of a tile to give information about that tile, there should be a toggle tile information button though.

I want the surface tiles to be a separate data structure from the world map 2d array because I want to preserve the world tiles even when there is a surface tile on top of a world tile, like a tree on top of grass, or an animal on top of the grass.


## Planning:

For surface tiles, the data structure does not need to be the same size as the map array. It just needs to store the overworld tiles with their positions.

Rules for surface tiles:
* each element in the data structure is an object with minimum properties {x, y, and type} where x and y correspond to the tiles position in the world map.
* each element in the data structure must have a unique x,y pair
* each element must exist on a tile for its type. ie tree can only exist on grass or dirt, not rock or water

An array would be a suitable data structure, as I do not need anything complex, but using a 2d array, while more costly means that I can search for collisions from map[x][y] -> surfaceTiles[x][y] without having to loop through the surfaceTiles array.

For this reason surface tiles will be stored in a 2d array as well.


## Adding the surface tiles data structure

![image](surfaceTilesCodeEditor)

![image](surfaceTilesProps)

Ive decided to initialize surface tiles filled with air tiles, I think its better initializing the full array now so I do not need to worry about element collision handling in the array.
