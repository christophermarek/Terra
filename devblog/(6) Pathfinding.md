
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

Now we have implemented these methods, we still need to know if the surfaceObject is moving or if it is stopped. This brings another design decision that I knew I had to make, how & where to store the AI brain. I want for every AI to be able to move, eat, interact with eachother, and I need somewhere to store that state. I can store it in surfaceObjects, but if this is also being passed to the renderer every frame, it seems like a lot of extra data being passed around. I also do not need AI in the map editor, which also uses surfaceObjects.

Eventually I will have to code in a system that will be me complex but for now all I need to store for each surfaceObject is the action it is doing like moving to point, and if it is moving or not.

I could use Redux, I think it would be appropriate. The AI brain having a single source of truth is the best choice I think. I can do this without redux but to do this I just need to move the state up to our App.js so that the ai state will persist. I dont see a reason to use Redux now other than it being fun to use, so I wont go through all that effort right now but maybe I will need to move to it in the future.

I want this state to be designed currently as:
brain: [
    {
        id,
        moving,
        action,
    },
]

I need an id to link the surfaceObjects to the brain. When the simulator loads the map I can iterate through each surfaceObject and assign it an id, and also create a blank AI object in the brain with the same id to link them. 

I want the map when you click on loadMap to link to a saved AI as well, so if there is map1.txt the program will load the AI state for that program. I dont think it is possible to make the AI persist, it has to be saved and get reset on refresh because I dont want to save local files, maybe when I link a database to save and load the simulation I can track changes. The AI state doesnt have to be pulled to App.js since I am just load the AI state on mapLoad, so all the work I am going to be doing will be in file export to create an ai file for the map. AI will be exported when map gets exported since map export is a new map, might change this later though, I want to be editiing the maps too but I also just want to work on the AI for now. This also wont work because I want the AI to mate and that means there will be new surfaceObjects that wont persist.

Seems like even more work I need to do now, I think I should move the map saving and loading to local storage, then I can actually export maps to my device, and have them persist on refresh, and right now I only export the map and paste it into my map preset file.


![image](generateAi)

now the map and the ai will export to the local storage. It doesnt handle multiple maps dynamically yet. So now on load of the simulation I just load from whats in the local storage for map and ai.

Now that this is handled, I can go back to making the AI move to a point on the map. 

![image](brainHelpers)

I added functions to help us update the data in the brain object array.

I now have to check if the brainObj for a surfaceObject is moving or not moving, and we will use that to move the surfaceObject to a point.

![image](moveToPointCode)

This is the final code to move a surfaceObject to a point.

First we go through each surfaceObject, for the surfaceObject we are currently indexed at we get the corresponding brain object for it.

Each brain object has a state: 
![image](brainState)

The action is for control flow. AI will think and make decisions and once it makes a decision it will execute an action.
For this simple movement to a point the AI action flow is currently: Idle->Moving->Done Moving.

So at the start the loop checks if the object is idle, if it is then start the moving action and initialize the vars for movement.
Now the Ai wont start moving yet, next we need to check if isMoving is false, because the action can be Moving but it will not be moving until isMoving is true. We use this break between action and execution to get more paramaters for the movement. 

![image](drawing)
First we get the distance to point which is the hypotenuse or c in the drawing. This is the distance we want to move the surface object over the plane.

Then we get the direction to a point in the X and Y plane, this is calculated by getting the vertical change and horizontal change for A->B.

We then move the object by x/y += change x/y * movementspeed * time elapsed

This move the object on both x/y at the direction to the end point.

To check if we reached the end destination we want, we check if the current distance from the start is greater than or equal to the distance from end point to start. If the hypotenuse of the current point to the start is greater than the original distance hypotenuse calculated then we have moved past the end point.

Once we reach the end we set the state to finished to terminate the movement, and lock the final x and y variables in place to the end points so that it gets to the desired co ordinate.

![gif](singleToPoint)

Right now for testing the point is at 250,250 px. We can see a surfaceObject now will move to the point specified.

It also works with multiple surfaceObjects

![gif](multipleToPoint)

Now we have to do pathfinding

I did some reading at http://theory.stanford.edu/~amitp/GameProgramming/index.html. 

I have implemented the list a* algorithm from here, 
https://briangrinstead.com/blog/astar-search-algorithm-in-javascript/

![image](setupGrid)
The first thing I had to do was set up a grid representation of our map tiles

![image](cell)
this grid is populated with cells.

![image](startSearch)

To retrieve a path from start to end we run the pathfinding algorithm in the search function. 

![image](pathfindingReturn)

This is what the pathfinding algorithm returns. 

## Now we need to implement this into our surfaceObjects so they can move to a destination.
I think to implement this all we need to do is:
-when idle, set the first point to go to as the first element we shift out of the path array.
-when moveing and point is reached, check if final point in path, if it is then stop moving. if its not then shift out the next point from the array.

![image](idleState)
Now when the AI is idle it generates a path to an end point that we want it to go to, for now it is just 250,250

![image](moving)
Now we move through each point until the end is reached. 

## We also need to make the pathfinding work around obstacles like trees.
We have to iterate through surfaceObjects and add them as walls on the grid
-first I have to go through each surface Object
-calculate bounding box of circle with x, y and radius of circle
-set co ordinates in that bounding box to wall.

![image](treeborders)
Now when I generate the grid I go through every surfaceObject, fetch the size of the surfaceObject, and iterate a square around the surfaceObject and set all the tiles in this square to isWall = true.

This solution doesnt allow for pathfinding around other surfaceObjects, because they move so the wall will change. I also have to check type === tree because if a rabbit wants to pathfind and it is inside a square of isWall = true then it will never get a valid path from the pathfinding algorithm. 

This is how it goes around trees. It does not support diagonal paths yet.
![gif](pathAroundTree)

Now that pathfinding is implemented we can work on the AI more. The pathfinding needs more tuning though and it needs to handle diagonal paths.