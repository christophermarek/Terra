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

![image](hungry)

So first we check when the ai is thinking, to see if it is hungry. If it is we set the action to hungry.

![image](hungryAction)

So now when they are hungry, they find a bush and we set the pathing to that bush. I already built the pathfinding action so now I just have to code what happens when they reach the target.

![image](reachedTarget)

When the pathfinding reaches the target, it sets the action to "Reached Target". Before I started the pathfinding I stored the target and what the object intends to do when it reaches the target, this is like memory because we have to store what we want to do so we know we are going to eat once we reach the target.

![image](eatTarget)

Now that we are at the bush and are at the eat target action, we just need to deplete the food of the bush, and raise the hunger until the object is full.

![image](full)

When we loop back and are in the thinking part for the ai, we just check if hunger is 100 and we know the ai is full so we set the state to idle, since idle is the default or root state.

I still need to add when a bush runs out of food, we need to remember that that bush ran out of food, and then look for the next closest bush.

Before this though, there are too many issues with pathfinding that need to be fixed.

## engine work

bounds drawing

## Pathfinding updates

Problems:
- no diagonal paths
- we dont care about barriers in the path and surface objects go ontop of eachother
- surfaceObjects dont consider their own bounds when pathing.


This eating system doesnt work properly. Still eats at constant rate even if no food.

## Ai design

Need to have a brain properties file for each type of ai i guess because when I want a central place to store each ai property so I can load it when I spawn a new surfaceObject in

## Removing Game console

Replace game console with a list of all the entities in the game and their states so you can expand and view there instead,
probably better than game console because there will be tons of updates in the game console. Or can have both.

Im not really sure yet