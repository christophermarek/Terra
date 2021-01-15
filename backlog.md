
# Water update
-thirst, exact same as hunger.
-make water all wall on grid.
-make water target a random point on the edge of the water.

# Data update
Add a view with switchable tabs to view trees and bush properties too, bushes have a food property

I still need to add when a bush runs out of food, we need to remember that that bush ran out of food, and then look for the next closest bush.

# Map Size Update
MAX MAP SIze right now is only 5, Any higher than that and the grid is too large.
If we want to support larger maps then we need a pathfinding algorithm that will limit the scope of the grid to 
6 chunks like this or maybe even smaller. Not sure.
-Make sure to note this as a potential upgrade in the future