
# Map generation, logic, and map editing

Before I can start working on any of the animals, I have to create a map for the world they will live in.

A tile based map, with each cell colored to represent one of the world map tiles: water, grass, rock, dirt.
Ontop of these world maps, there will be an above ground objects such as trees, berries, and other objects.


The data structure for this map will be a 2d array, right now it will be built with a div, but in the future svg graphics may be nicer.

I want the UI and the logic for the simulation to be separate, so the world map will be represented as a 2d array of objects,
each of these objects will look like

maptile = {
    x,
    y,
    type,
}

for now. When the <Map /> file parses the map board, it will see what type the tile is to render the specific tile, instead of the tile itself being added into the map tiles array.

I want eventually for the maps to randomly generate, but to start I have to make a map editor. This is useful for the future anyways because it can be a useful feature, and a lot of the boilerplate methods I create such as adding cells by clicking will be reused again in the future. This map editor should also be able to load/save a map file to a txt file.


To start I want just a plain cell based map rendered,
![image](black and white board)

![image](maplogic)

In the second image you can see the 2d array for the map, the properties active, and updated are probably going to be removed.

I do not want the map renderer and the map logic in the same file, it needs to be separate.
I put the map logic into the map editor and pass the map as props to the map file.

MapEditor.js
![image](maplogic)

Map.js
![image](maprender)


Now the map.js gets the mapfile and renders a default board, where the tiles are white and have black borders which are styled by css.
The next step is for the renderer to read the cell type in each tile when it parses through the map array, and render the correct tiles.

![image](greenmap)

The map renderer can now read the mapfile and render specific colored tiles, from the tiletypes.
This is the most functionality the view should perform, I only want it to handle displaying the tiles.

![image](maptotilehandler)
![image](tilehandlertotile)
![image](tile)

With separation like this, the code is simple enough that adding new tiles should be no issue.

Now that the map logic is created, the next part to build is the map editor itself.
I want the map editor to have:
-A button to remove the borders, since those should just exist when editing for visibility.
-A menu to load tiles to place
-Ability to change the tiles on click
-A save/load button at the top as well, since I want map saving and parsing as a feature for the future.

The map editor is going to function as such, you select a tile type you want to place on the map, when you click on a tile on the map the map will update that position you clicked with the tile you have selected.

Toggle border added
![image](withborders)
![image](noborders)

Toggle on/off for the borders. 
![image](bordercss)
![image](borderToggleCode)

I had to switch the borders to outline since the border css property adds pixels so the map would change size on toggle, but outline does not do that.
But for this functionality all it took was making a conditional border css class for my tiles to render an outline or none.

Tile Selector added
![image](tileSelector)

The selected tile will be stored into a local state variable in the map editor
![image](tileSelectorState)
![image](tileSelectorMapEditor)
I pass the function to change the selected tile state to a tile selector component, so that the map editor file does not become massive.
![image](tileSelectorclass)

Now that the selected tile will be stored in the state, we have all the pieces now to update tiles onclick with the selected tile

Update Tile onClick added
![image](mapCreation)
![image](mapCreationNoBorder)

The map editor now is fully functional, I changed some of the colors because the original ones did not look as nice.
To make this update all I did was have a function that updates the board at position x,y with the tile that is stored in state from the selector we built earlier

![image](updateMapwselectedTile)
![image](updateMapPassed)
And pass this function to each tile so we can get the x,y value for each tile to update the map array accordingly


