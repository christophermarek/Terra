
# Health & Game Console

I want to implement an eating system for the animals but first I have to implement some things before.

What I can think of so far:
* Health 
* Plant regeneration
* Combat (For carnivores)
* Eating from plants 

I also want a better display to visualize what is happening in the world.

## Health

The changes I need to make to implement a health system is:
* Give every surfaceObject a health property
* Create functions to lower or raise health
* Implement a dying action to remove dead surfaceObjects from the game



![image](maxHealthData)

In our general data file for surfaceObjects we set a max health field. This will be the maximum health a surfaceObject of that type can go to and it will be the health a surfaceObject spawns in with.

![image](addingHealth)

So now when I spawn in a surfaceObject in the map editor I make sure to add the health property to every surfaceObject that will exist.

![image](healthProperty)

Now that every surfaceObject has a health property, we can handle adding health and removing health. Since both of these actions are the same, just modifying the health value, we only need to create one helper function to do this.

![image](updateHealth)

This is going to be a helper function for our game loop. It doesnt modify the surfaceObject in the surfaceObject array directly since we only update this every game loop. But it means when I want to update health in the game loop I only call this function instead of typing it myself every time.

The last part of health management is death mechanics. If a surfaceObject has no health then it must be dead. This has a related action "Dying" since things don't just disappear, we want the surfaceObject to go from "Previous Action" -> "Dying" then it will be removed from the simulation. This is so we can keep track of what dies.

