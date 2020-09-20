
# Health & Game Console

I want to implement an eating system for the animals but first I have to implement some things before.

What I can think of so far:
* Health 
* Plant regeneration
* Combat (For carnivores)
* Eating from plants 
* AI Logic refractor

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

![image](kill)

To test out the dying I decrement the health by 1 every time the surfaceObject moves. The health should reach 0 in a second or two.

![image](thinking)

I have added a check when the ai is thinking, and the check is if the object is at 0 health but not dying yet. If this is the case we flag its action as dying so we can remove it from the simulation.

![image](dying)

Now all I do is remove the surfaceObject from the surfaceObjects array and brainN from the brainArray

![image](death.gif)

Here is a video of the surfaceObject getting deleted. 

## Game console

As the Ai does more things, I want to be able to track what actions each brainObject chooses to take, and also what else happens in the world.

I have decided having a console in the simulation that prints every action taken by ai, and battle messages, and general world messages.

This console should just have a few buttons to switch between what kind of message you want displayed, and then a list of messages for that type.

![image](changeCOnsoleType)

To start we have a state variable called console type, this is what will change when we click a button on the console. 

![image](gameConsole)

So we render a game console and have 3 buttons to change the consoleType variable

![image](changeConsoleType1)

And to change it all we need is to add this function here to set the state

![image](prerender)

Now we add the console output window. This will be a ul with every console message being a li

![image](consoleTypes)

So I have decided on 3 console types. General, battle and action. Each of these consoleMessage arrays will store objects in the format {timeStamp of action, id of surfaceObject, and message to print}

![image](renderConsole)

Now the console finds the correct consoleMessages to render, and creates a list for us of these messages.

![image](addMessage)

To add a message I created the function above, so now we can call addConsoleMessage from any part of the simulation and it will add an element to the appropriate console.

![image](newMessage)

Now I have added a new message during the thinking state of our ai, so when our ai decides to start walking, it will add a message to the console saying it is walking.

![image](consoleFUll)

The game console is in the bottom left right now, and it also is not styled at all. I want to wait until I see what it will look like when the console is more populated with messages before I style it.

This simulation code file is massive though, about 630 lines. I need to refractor this soon, probably before I fully implement eating.

## Hunger

I need the animals to have "hunger" so they can want to eat food. To implement hunger there is a few things we need:

These are:
* A hunger property for our surface objects
* A way for surfaceObjects to lose hunger over time
* A way for the surfaceObject to starve to death
* A way for the brain to know it is hungry
* A way for the brain to "Eat food"
* A way for the brain to be full

This includes a action state cycle that goes
- Idle -> Hungry -> Starving -> Death state branch
- Idle -> Hungry -> Full

Im going to have to write these all down somewhere central.

First we need to add the hunger property to our surface objects. To do this all we need to do is add obj.health = 100 when we create a new surfaceObject in the map editor.

![image](hunger)

Now that we have the hunger property, hunger needs to deplete over time like it would in real life. 

I think to do this, when we iterate over every surfaceObject every tick() we need to deplete hunger by a certain amount. 
I also need to add a updateHunger helper function.

![image](loop)

I call a function loseHungerOverTime which lowers an objects hunger every game loop

![image](hungerDeplete)

This function just calculated a rate that hunger will lower by and then modifies the hunger property to subtract the amount that the hunger will lower by. It is seconds passed * hunger depletion rate

To get the surfaceObject to starve to death, I can just modify the check for health low to add an additional check for hunger < -0.

![image](starvedToDeath)

## Plants depletion/regeneration

