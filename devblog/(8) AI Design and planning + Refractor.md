# (8) AI Design 

![image](fileStructure)

I finally organized my files more. Now most of the logic is out of the Simulation.js file which is good because I only want that to focus on rendering the page.

## Pathing to food

Before I plan a more dynamic AI system I think I need to complete the eating food cycle and a wander function. The reason is that I want to model out the decision and action tree for the AI and I need it to be more complete before I can think of a better implementation. 

To get the ai to eat I have already added mostly everything we need. The bushes have food and regenerate food over time. And the rabbits have a hunger property that depletes over time. I have pathfinding to a spot.

I just need to create a function to return the closest bush to a surfaceObject then I need to implement the logic.

Im thinking the logic wil go like this: It goes thought to action
- if hunger < 50 -> "Hungry"
- if "Hungry" -> check if bushes exist
- if no bushes -> stay "Hungry"
- if bushes exist -> "Moving"
- go through moving actions
- when at bush -> eat food
- if no food left -> go back to looking for food.
- if full -> "Full"

Im not sure if I want the rabbits to know if there is food or not in the bush when it paths to the first bush. Maybe its better for them to explore empty bushes as well.

![image](closestBush)

Now that we have a function to find the closest bush I can implement the logic.

## Ai design