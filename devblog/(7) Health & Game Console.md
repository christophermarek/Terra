
# Health & Game Console

I want to implement an eating system for the animals but first I have to implement some things before.

What I can think of so far:
* Health 
* Plant regeneration
* Hunger and wanting to eat

I also want a better display to visualize what is happening in the world.

## Health

The changes I need to make to implement a health system is:
* Give every surfaceObject a health property
* Create functions to lower or raise health
* Implement a dying action to remove dead surfaceObjects from the game


![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/maxHealthData.PNG)

In our general data file for surfaceObjects we set a max health field. This will be the maximum health a surfaceObject of that type can go to and it will be the health a surfaceObject spawns in with.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/addingHealth.PNG)

So now when I spawn in a surfaceObject in the map editor I make sure to add the health property to every surfaceObject that will exist.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/healthProperty.PNG)

Now that every surfaceObject has a health property, we can handle adding health and removing health. Since both of these actions are the same, just modifying the health value, we only need to create one helper function to do this.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/updateHealth.PNG)

This is going to be a helper function for our game loop. It doesnt modify the surfaceObject in the surfaceObject array directly since we only update this every game loop. But it means when I want to update health in the game loop I only call this function instead of typing it myself every time.

The last part of health management is death mechanics. If a surfaceObject has no health then it must be dead. This has a related action "Dying" since things don't just disappear, we want the surfaceObject to go from "Previous Action" -> "Dying" then it will be removed from the simulation. This is so we can keep track of what dies.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/kill.PNG)

To test out the dying I decrement the health by 1 every time the surfaceObject moves. The health should reach 0 in a second or two.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/thinking.PNG)

I have added a check when the ai is thinking, and the check is if the object is at 0 health but not dying yet. If this is the case we flag its action as dying so we can remove it from the simulation.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/dying.PNG)

Now all I do is remove the surfaceObject from the surfaceObjects array and brainN from the brainArray

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/death.gif)

Here is a video of the surfaceObject getting deleted. 

## Game console

As the Ai does more things, I want to be able to track what actions each brainObject chooses to take, and also what else happens in the world.

I have decided having a console in the simulation that prints every action taken by ai, and battle messages, and general world messages.

This console should just have a few buttons to switch between what kind of message you want displayed, and then a list of messages for that type.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/changeConsoleType.PNG)

To start we have a state variable called console type, this is what will change when we click a button on the console. 

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/gameConsole.PNG)

So we render a game console and have 3 buttons to change the consoleType variable

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/changeConsoleType1.PNG)

And to change it all we need is to add this function here to set the state

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/preRender.PNG)

Now we add the console output window. This will be a ul with every console message being a li

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/consoleTypes.PNG)

So I have decided on 3 console types. General, battle and action. Each of these consoleMessage arrays will store objects in the format {timeStamp of action, id of surfaceObject, and message to print}

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/renderConsole.PNG)

Now the console finds the correct consoleMessages to render, and creates a list for us of these messages.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/addMessage.PNG)

To add a message I created the function above, so now we can call addConsoleMessage from any part of the simulation and it will add an element to the appropriate console.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/newMessage.PNG)

Now I have added a new message during the thinking state of our ai, so when our ai decides to start walking, it will add a message to the console saying it is walking.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/consoleFull.PNG)

The game console is in the bottom left right now, and it also is not styled at all. I want to wait until I see what it will look like when the console is more populated with messages before I style it.

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

First we need to add the hunger property to our surface objects. To do this all we need to do is add obj.health = 100 when we create a new surfaceObject in the map editor.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/hunger.PNG)

Now that we have the hunger property, hunger needs to deplete over time like it would in real life. 

I think to do this, when we iterate over every surfaceObject we need to deplete hunger by a certain rate. 
I also need to add a updateHunger helper function.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/loop.PNG)

I call a function loseHungerOverTime which lowers an objects hunger every game loop

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/hungerDeplete.PNG)

This function just calculated a rate that hunger will lower by and then modifies the hunger property to subtract the amount that the hunger will lower by. It is seconds passed * hunger depletion rate

To get the surfaceObject to starve to death, I can just modify the check for health low to add an additional check for hunger < -0.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/ifStarvedToDeath.PNG)

Now I need to add logic so that the ai wants to eat food when its hunger level gets low enough. I think if the hunger is < 50 then it will become "Hungry" and search for food. If its hunger drops below 20 then it will become "Starving"

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/getHungru.PNG)

Now when the ai is making decisions, if its hunger is low it will set its action to Hungry, which will execute when the AI is on the action statements.

I also want to check when the AI is full, since that is when it will stop eating. To do this we just check if the hunger is at 100.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/full.PNG)

Now we just need an action for Hungry/Starving, and this action will include eating food until "full".

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/eating.PNG)

There are two new actions now, one to start eating when hungry. This is only a temporary state as the actual ai will go more like
Hungry -> Look for food -> Go to food -> Eat food -> Full

Then to test it works I have an action for Eating that increases the hunger by 1 until it is full.

## Plants depletion/regeneration

I am going to make rabbits eat bushes. Rabbits eat grass in the wild and bushes can just have a food property.

before I can make the rabbits eat I have to make the bushes have this food property and I want the bushes food property to replenish over time.

This also means that I have to create a second update loop to loop through plant surfaceObjects. Since they still need a loop but no ai.

I dont want to type up much about me adding the bush to the map editor and making it a valid surfaceObject because I have already done it for other surfaceObjects earlier.

This is going to be very similar to hunger.

The steps I have right now are:
-Add bush to map editor
-add food property to bush
-Add loop to loop over non ai surfaceObjects
-create a modify food property for the bush
-write a function that increases a bushes food property over time

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/bush.PNG)

Now bushes are a surfaceObject.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/foodProperty.PNG)

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/stateFood.PNG)

now that we have this data for our bushes, we need to iterate over the bushes

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/noBrainUpdate.PNG)

I created a filter in our update function to apply different logic if the surfaceObject is a bush.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/updateFood.PNG)

Now we have a food modifier helper function aswell, now we just need to make our bushes food increase over time if they are less than 100.

![image](https://github.com/christophermarek/Terra/blob/master/devblog/(7)%20Health%20%26%20Game%20Console%20screenshots/plantTick.PNG)

This is how the plant replenishes its food property, it just increases by a simple rate.


## Afterthoughts

This series of updates has added a lot to the simulation, the code base has grown really large. I also have many more thinking states and action states for the Ai, so I can implement a better system for the AI logic now.

So before I implement pathing to food and eating it, I need to refractor the code and pull out a lot of helper functions to make the simulation.js file less lines of code.

I am getting close to a demo-able product. I just want the ai to be able to perform atleast two different decision action cycles. Going to food and eating is one of them. The other might be wandering.

