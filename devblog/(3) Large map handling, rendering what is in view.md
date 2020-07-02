
# Large map handling, and rendering what is in view

So a major limitation to the simulation I immediately noticed was that it cannot handle a large map very well.
At first I thought it might be javascript is too slow to iterate through a 200x200 2d array, but after testing I realized that this is not the problem.

A 20x20 map means a 400 tile grid made up of divs. 400 divs in the dom is a lot but it still is manageable with minor performance drawbacks. But when you scale to 200x200 then you get 40,000 divs in the dom. Now that is a problem. 

I found a library called [react-window](https://github.com/bvaughn/react-window), this solves the problem of having too many divs because it removes the elements that are in the dom that arent in the view, and adds them back dynamically when they re enter the view.

## Implementing react-window

![image](grid)

Instead of mapping over the 2d array, react-window does it for you. I just have to pass the various properties of the map to the react-window Grid component.


![image](cell)

When I render the cells, I noticed that I do not need to pass each element to the tile handler to render the correct tile, since the tile color is a css classname I can just assign the class from map[x][y].type since it is saved in the data structure. The same with hover and onClick. So I can safely remove the tilehandler and all the tile files for now. I like this implementation better, it is less confusing and the previous solution felt overengineered, especially if there ends up being a large amount of map tiles added.

You can also see in this update that surface tiles are not being rendered anymore, I have decided that these objects should not be tiles. I do not want a tree to be an entire tile but rather an element that sits on a tile. I do not want to change from a tile based map because I do think it gives good performance.

![image](largemap)
![image](largemapscroll)

So now you can see that you can scroll through the map.

This is all the changes for now.

The next part will deal with rendering surface objects ontop of the grid. Im not sure how to do that yet but I have some ideas, maybe using the css transform property

