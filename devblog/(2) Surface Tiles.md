
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

![image](mapConditionalRendering)

![image](surfaceTileHandler)

![image](tree)

Now when the map parses the map array, it checks if there is a match at that index in the surface tiles array. The map will render a surfaceTile instead.

The Surface Tile handler is very similar to the Tile handler but you cant really get around boilerplate code like that, and I prefer to keep it separate incase of future changes I would like to make

![image](surfaceTilescss)


Now that the code is in place for rendering the surface tiles we need to add surface tile placement in the map editor 

## Surface tile map editor

![image](surfaceTileControls)

The controls to place surface tiles is now added.

![image](updateSelectedTile)

I added a new state called selected tile type, and now when we update the map the code will update the either the map or the surface tiles depending on the type selected.

I also added an air surface tile

![image](airSurfaceTileHandler)
![image](air)

Since in the map rendering we skip the surface tile at [x][y] if its type is air, to clear a surface tile from the map we just need to set it to air.

Since the map and surface tiles are separate, when we clear a surface tile the map tile still remains and renders properly. We can also change the map tile that is under a surface tile without having to clear the surface tile.

![image](mapwithsurfaceTiles)

Now this is a better forest, it has bushes and trees. When I implement textures it will look much fuller

## Surface tile placement rules

![image](surfaceTileAllowed)


## Saving/Loading surface tiles
create an object before stringifying it, so surface and then map

## Tile tooltips

## Map Sizing