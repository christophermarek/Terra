
# (4) Svg drawing on the map & Refractoring

There are two parts to this blog, first part is since I changed how I wanted to handle surfaceTiles to surfaceObjects, I have to change some things to render the map properly. Also the codebase needs refractoring. The files feel too massive right now, and I have a lot of css that does nothing currently.

## Surface Objects

Initially we had surfaceTiles, where an object on the surface can only exist on one tile. 
I did not like this solution after some testing. It is easier to implement yes, but it also means that every surface tile will be the same size, and there can only be 1 surface tile per map tile.

To get around this limitation, and to implement textures for the simulation in the future I decided to make surfaceObjects rendered through svg's. There were a couple options to implement this svg rendering for surfaceObjects. 

1. I could have the svg go into the top left of the map, and render over the entire map. This could work well if the game map was a fixed size but it isnt. If it was a single massive svg then every map update we would have to manage what to draw where depending on where we were scrolled on in the map. Since we already implementing large map handling with an infinite grid why try and remake the same functionality again.

2. Render an svg inside every map tile. This has an advantage for us because each map tile is selectively rendered, so each svg will be selectively rendered aswell. This means we dont have to worry about surfaceObjects rendering out of view. Disadvantage to this is we are adding 2x the number of dom elements now minumum since we now have a div grid for the map, and an equal number of svg's we are rendering aswell. But there doesnt seem to be any performance decrease with doing this since we selectively render what is in view already.

I chose option 2. as the final implementation.

To deal with this problem first I had to think about the co-ordinates for the surface objects. I have created the maptiles with the idea in mind that each map tile will be an x-y coordinate pair. Every svg is going to be inside a map tile and an svg has its own co ordinate space as well. 

Since an svg has co ordinates in the range 0-100, I decided to make the map tiles square with a width of 100px. This means for each pixel in the maptile there is a distinct co ordinate pair.

Surface Objects will then need to be stored with two pieces of information, maptile coordinate and svg coordinates. This is easy and we can combine the two though. So for a surface object an example pair of coordinates would be x: 234 y: 154. This means that the surfaceObject lives in mapTile[2][1] and in the position x:34 y:54 in that square.    

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/generateSurfaceTiles.PNG)
![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/surfaceObjects.PNG)

I created a new state variable to store the surfaceObjects. It is just an array of objects. 
The rabbit and tree used for each surfaceObject in that image come from a file I used to manage the properties for each object, like color and type so that there is one source for most of the information that is reused for that object.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/passToMap.PNG)

Passing this state down to the map to render.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/cellRender.PNG)

Now that we passed the surfaceObjects to the map, we can now choose how we will render this.
When each cell is rendered, each cell calls a method to render the surfaceObjects for that cell. It passes the column & row index for itself to a helper function to select and render the populated svg for that cell.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/renderSurfaceObjects.PNG)

This is the function that renders surface objects to the map cell. This function feels way to large though, I think it should be a logic function and have it call a separate render function. First the function goes through all of the surface objects to find the ones that exist at the map tile. Then it renders an svg and then maps over an array of surfaceObjects for that tile passing down the x and y for the svg circle.  

We also added a selector to place two different surfaceObjects onto the map, I just replaced surfaceTiles with surfaceObjects, so not much changed there. And we made the import/export feature include surfaceObjects, which again was maybe 1 line of code since we already handled this with surfaceObjects.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/fullmap.png)

Here is the full map with some svg objects on the map. Im thinking that svg circles would be the best to represent living things. Could use rectangles but im not sure.

This part of the devblog feels so short, but it took a long time to figure out how to implement this properly, and I had many css troubles trying to make the svg work between tiles. So while it might not look like much work has been done, I was busy. 

## Refractor

Since I had so many difficulties finally implementing this, I feel like I need to refractor the project because now that the map editor is mostly done for our purposes. I dont want us to have to maintain or touch the map editor code, and I want it to be modular enough that I can add buttons and extra inputs easily. I also want to remove all the warnings & errors in the terminal and console, because it will just become a huge mess in the future if I dont maintain it. 

For the refractor I want to accomplish:
* remove all references to surfaceTiles
* remove unescesary css
* delete files not needed anymore in file structure
* refractor map.js for rendering map, and make sure only type is stored into the surfaceObject variables, and uses type to search for color, size, and shape.
* refractor mapeditor.js, want the code to be separate enough so I can easily render the map in the main program aswell
* remove all warnings and errors in the terminal and console

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/fetchObjects.PNG)
![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/renderCut.PNG)

First part to clean was splitting the surfaceObjects rendering, now that the logic and render is separate it will be easier to debug.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/surfaceObjectsFile.PNG)

Now I also refractored my surfaceObjects.js file. This file should be what the map.js uses to render the look and feel of various surfaceObjects, I want all the view related files to only manage whats displayed.

I have also moved this file to a folder out of the components folder, into data/map. Data folder should be for static data that is fetched for this simulation. I also expect to use this directory for some constants for the ai.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/renderFetch.PNG)

Now that the rendering of objects is separate from the map editor, I also want to remove some dependencies from the map.js

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/dependencies.PNG)

There are quite a few props that need to be passed to the map for it to render the map without errors, ideally the map.js should only need map and surfaceObjects to render and perform the actions it needs. So to finish refractoring this I need to decouple map from map editor. First thing to change is toggle borders

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/toggleBorder.PNG)

Toggle border has now been moved to the map, in the simulation this control might still be used, and I can even have a toggle to hide them later so I think this is okay. Refractoring isnt just deleting code because decoupling is just as important

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/hoverImport.PNG)

Moved the hover controls to map.js aswell, I think hoverdata would be useful even during the simulation, and it doesnt need to be a part of the map editor.

Now the last dependency map has is the function updateMapWithSelectedTile(). This I cannot take out of the map editor. 

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(4)%20Svg%20drawing%20on%20the%20map%20%26%20Refractoring/updateMapWithSelectedTile.PNG)

Since I cannot remove the props, because I still will want it for the mapEditor, I just do a check before I render that checks if the function exists, if it doesnt then we just set it to an empty function.

That should be all the refractoring for map.js, I think it is decoupled from the map editor now as it only depends on the map & surfaceObjects data structures to render.
For the map editor itself, I dont think it needs refractoring as we pulled out most of the functions that dont deserve to be in there anymore.

Now that all the rendering is done though, we will not have to touch the map or mapeditor again for a while unless there are bugs.
I feel like this project got way bigger than I expected it to be, I just wanted to program some ai. But you do need a game engine so might aswell make your own.

Next I want to make a simulation page, and test some pathfinding. 