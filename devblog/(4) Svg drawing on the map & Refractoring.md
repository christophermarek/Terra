
# (4) Svg drawing on the map & Refractoring

There are two parts to this blog, first part is since I changed how I wanted to handle surfaceTiles to surfaceObjects, I have to change some things to render the map properly. Also the codebase needs refractoring. The files feel too massive right now, and I have a lot of css that does nothing currently.

## Surface Objects

Initially we had surfaceTiles, where an object on the surface can only exist on one tile. 
I did not like this solution after some testing. It is easier to implement yes, but it also means that every surface tile will be the same size, and there can only be 1 surface tile per map tile.

To get around this limitation, and to implement textures for the simulation in the future I decided to make surfaceObjects rendered through svg's. There were a couple options to implement this svg rendering for surfaceObjects. 

1. Could have the svg go into the top left of the map, and render over the entire map. This could work well if the game map was a fixed size but it isnt. If it was a single massive svg then every map update we would have to manage what to draw where depending on where we were scrolled on in the map. Since we already implementing large map handling with an infinite grid why try and remake the same functionality again.

2. Render an svg inside every map tile. This has an advantage for us because each map tile is selectively rendered, so each svg will be selectively rendered aswell. This means we dont have to worry about surfaceObjects rendering out of view. Disadvantage to this is we are adding 2x the number of dom elements now minumum since we now have a fixed size div grid for the map, and an equal number of svg's we are rendering aswell. But there doesnt seem to be any performance decrease with doing this since we selectively render what is in view already.

I chose option 2. as the final implementation.

To deal with this problem first I had to think about the co-ordinates for the surface objects. I have created the maptiles with the idea in mind that each map tile will be an x-y coordinate pair. Every svg is going to be inside a map tile and an svg has its own co ordinate space as well. 

Since an svg has co ordinates in the range 0-100, I decided to make the map tiles square with a width of 100px. This means for each pixel in the maptile there is a distinct co ordinate pair.

Surface Objects will then need to be stored with two pieces of information, maptile co ordinate and svg co ordinates. This is easy and we can combine the two though. So for a surface object an example pair of coordinates would be x: 234 y: 154. This means that the surfaceObject lives in mapTile[2][1] and in the position x:34 y:54 in that square.    

![image](generateSurfaceTiles)
![image](surfaceObjects)

I created a new state variable to store the surfaceObjects. It is just an array of objects. 
The rabbit and tree used for each surfaceObject in that image come from a file I used to manage the properties for each object, like color and type so that there is one source for most of the information that is reused for that object.

![image](passToMap)

Passing this state down to the map to render.

![image](cellRender)

Now that we passed the surfaceObjects to the map, we can now choose how we will render this.
When each cell is rendered, each cell calls a method to render the surfaceObjects for that cell. It passes the column & row index for itself to a helper function to select and render the populated svg for that cell.

![image](renderSurfaceObjects)

This is the function that renders surface objects to the map cell. This function feels way to large though, I think it should be a logic function and have it call a separate render function. First the function goes through all of the surface objects to find the ones that exist at the map tile. Then it renders an svg and then maps over an array of surfaceObjects for that tile passing down the x and y for the svg circle.  

We also added a selector to place two different surfaceObjects onto the map, I just replaced surfaceTiles with surfaceObjects, so not much changed there. And we made the import/export feature include surfaceObjects, which again was maybe 1 line of code since we already handled this with surfaceObjects.

![image](fullmap)

Here is the full map with some svg objects on the map. Im thinking that svg circles would be the best to represent living things. Could use rectangles but im not sure.

This part of the devblog feels so short, but it took a long time to figure out how to implement this properly, and I had many css troubles trying to make the svg work between tiles. So while it might not look like much work has been done, I still feel good about it. 

## Refractor

Since I had so many difficulties finally implementing this, I feel like I need to refractor the project because now that the map editor is mostly done for our purposes. I dont want us to have to maintain or touch the map editor code, and I want it to be modular enough that I can add buttons and extra inputs easily. I also want to remove all the warnings & errors in the terminal and console, because it will just become a huge mess in the future if I dont maintain it. 

For the refractor I want to accomplish:
* remove all references to surfaceTiles
* remove unescesary css
* delete files not needed anymore in file structure
* refractor map.js for rendering map, and make sure only type is stored into the surfaceObject variables, and uses type to search for color, size, and shape.
* refractor mapeditor.js, want the code to be separate enough so I can easily render the map in the main program aswell
* remove all warnings and errors in the terminal and console

### post refractor
Do minor css on map editor

And finally I want to create a Simulation page, which will just load tha map, it will start with a blank page with an input for a map import or a premade map import already.

Now that all the rendering is done though, we will not have to touch it again really for the ai unless there are bugs.
Feels like I programmed a 2d tile game engine just to work on AI for the project, but I think it was more fun than using canvas. 