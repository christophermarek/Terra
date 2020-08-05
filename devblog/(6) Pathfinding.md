
Now onto pathfinding, I want to setup a pathfinding algorithm to give a path that will move a surfaceObject from point a to point b. Im thinking of using the A* algorithm.

First I have to do a few things to make sure an object can move

Gameloop updating by time now

![image](gameloop)

In this image im just moving 1 object, so for test purposes im only accessing [0] which is the only element in surfaceObjects

I had to change the renderer to round the co-ordinates when they are calculated for the svg since we cannot have decimal svg co-ordinates.





movement speed calculating and storing in the dat object