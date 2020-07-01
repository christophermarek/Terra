
# Surface Tiles, Tile tooltips, Map sizing

Linked commit = "Surface Tiles completed"

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

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/surfaceTilesCodeEditorPNG.PNG)

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/surfaceTilesProps.PNG)

Ive decided to initialize surface tiles filled with air tiles, I think its better initializing the full array now so I do not need to worry about element collision handling in the array.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/mapConditionalRendering.PNG)

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/surfaceTileHandler.PNG)

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/tree.png)

Now when the map parses the map array, it checks if there is a match at that index in the surface tiles array. The map will render a surfaceTile instead.

The Surface Tile handler is very similar to the Tile handler but you cant really get around boilerplate code like that, and I prefer to keep it separate incase of future changes I would like to make

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/SurfaceTilescss.PNG)


Now that the code is in place for rendering the surface tiles we need to add surface tile placement in the map editor 

## Surface tile map editor

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/surfaceTileControls.PNG)

The controls to place surface tiles is now added.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/updateSelectedTile.PNG)

I added a new state called selected tile type, and now when we update the map the code will update the either the map or the surface tiles depending on the type selected.

I also added an air surface tile

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/airaddedhandler.PNG)
![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/air.PNG)

Since in the map rendering we skip the surface tile at [x][y] if its type is air, to clear a surface tile from the map we just need to set it to air.

Since the map and surface tiles are separate, when we clear a surface tile the map tile still remains and renders properly. We can also change the map tile that is under a surface tile without having to clear the surface tile.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/mapwithsurfaceTiles.PNG)

Now this is a better forest, it has bushes and trees. When I implement textures it will look much fuller

## Surface tile placement rules

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/surfaceTileAllowed.png)

Now you cannot add trees or bushes onto anything other than dirt or grass.

## Saving/Loading surface tiles

Right now surface tiles will be reset when we try to import into a fresh map, so I need to add the surfaceFiles data to the file saver aswell

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/mapexport.png)

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/mapimport.png)

Now the save data is an object with two properties mapData and surfaceData. The simulator can now correctly save surface tiles

## Tile tooltips

Instead of tile tooltips I have decided on using a div for information on hover, with a control button to enable to information box.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/hoverState.PNG)

First I made 3 variables, 2 to capture state and 1 to control the hover information

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/hoverFunctions.PNG)

Then these handler functions update and control the state

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/mapHover.PNG)

Then finally we pass down the hover state to the map to capture data from each tile.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/mapNoHover.PNG)

Here the map has hover disabled

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/mapHoverEnabled.PNG)

So now the map has controls for hover data, which will be used as a control in the full simulation as well.

## Map Resizing

The only time map resizing will be enabled is in the generate map screen, because I dont want to regenerate the map when the map array is already initialized

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/mapSizeCode.PNG)

So to add this feature we just add an input to the generateMap form and this lets the user update the map size before generation

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(2)%20Surface%20Tiles%20screenshots/bigMap.PNG)

With a map size of 50, the map is a lot larger, and I do intend for the map in the full simulation to be large. My web browser can only handle so many divs at once, since they are not super performance friendly and a 50x50 tile grid is still 2500 tiles. So doing larger like a map that is 200x200 would mean that I have to optimize the render function and only render what is in the view, but that I will do in the future.