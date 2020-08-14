
Now onto pathfinding, I want to setup a pathfinding algorithm to give a path that will move a surfaceObject from point a to point b. Im thinking of using the A* algorithm.

First I have to do a few things to make sure an object can move

Gameloop updating by time now

![image](gameloop)

In this image im just moving 1 object, so for test purposes im only accessing [0] which is the only element in surfaceObjects

I had to change the renderer to round the co-ordinates when they are calculated for the svg since we cannot have decimal svg co-ordinates.

might need to change from image
![image](movement.gif)


## Path finding

The first thing we need to do is iterate through every surfaceObject instead of just the [0]. Its easier to do this now and only draw 1 and we are still only accessing [0].

I also want the movement speed to depend on the type of object, I already have created from the renderer a file that gets me the movement speed and other data from the type of surfaceObject

![image](data)

![image](updateModified)

I also added another function to handle only updating the surfaceObjects. I still have a problem though, how do I move an object from a point to another. Since it is moving according to a movement speed, I cannot just change the x,y to the next point. 

To solve this problem, I have to think about how to move to the next point. I found this online https://gamedev.stackexchange.com/questions/23447/moving-from-ax-y-to-bx1-y1-with-constant-speed. I am going to try the top solution and see if it works.

Since this is a 2d plane, we can calculate the distance to the next point using using the hypotenuse between the two points. This will be how far the object will travel.

To find the direction the object will travel on the plane we just have to find the change on that axis, (x2 - x1).
We then normalize the X,Y direction by dividing the direction by the distance so that when we use the direction x, y we get to have our constant movement speed.

![image])(getDistance)

Now we have implemented these methods, we still need to know if the surfaceObject is moving or if it is stopped. This brings another design decision that I knew I had to make, how & where to store the AI brain. I want the brain to 


We also will need the 

Pathfinding
AI wander function
