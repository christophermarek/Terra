
# Setting the stage 

Now that the simulation rendering is complete, and we have a functioning map editor it is time to start setting the stage for the simulation. Since Map is decoupled from the editor we can now render the map in other components aswell. We want a simulator component that renders the map to display

## Things to do 
* Simulator component that renders the map.
* load map field that can load a map for simulator.
* load map from preset dropdown with load button.
* play button that starts the simulation loop.
* optionally site wide css to start planning a theme for the site style

![image](app)
![image](appsc)

I just added some css to try to make the nav buttons look different from the rest. Its probably not the style im going to stick with. But now we have two routes for the game, the simulation and the editor. We also now have a simulation component.

![image](simulation)

The simulation checks if a map is loaded, if its not it allows the user to select a map, if it is loaded then it renders the map and passes the map and surfaceObject props

![image](emptysim)
![image](populatedSim)

Now the simulator can load maps and we can soon start the ai. First though I do not want to keep having to create a map in the editor every time i want to play the simulation. I need to create some presets and store the json for those in a constants file that I can pull from anytime. This will speed up testing and it can help setup a structure for saving files on a server if i ever get there.

![image](mapExport)
![image](mapExportText)

Since its just a string that we parse onLoad, we can have a constants file that exports these map strings on demand.

![image](map1)
![image](form)
![image](mapDropdown)

I created a file for a map preset, its just the text from the map export function. I was going to make a larger file to handle them all, but I dont think im going to make many map presets and the ide slows down considerably when I have too many characters in a file like that. So the preset is just loaded into the map state variables when it is submitted from the dropdown

![image](preselect)
![image](postSelect)

Now that map presets can be loaded, it will speed up playing the simulation considerably. I really have to decide on some simple styling atleast for this project though so it looks better.

The gameloop is going to be tricky for me to implement, ive never done it before so hopefully I can find some resources on this topic. I want the gameloop to be time based not fps based. I want the animals in the simulation to have a walk speed in time so the gameloop must be managed with time so I can achieve this consistently.

I found these two articles here. I will use both to implement this. The first article has a lot of useful information for making my gameloop work with time, and moving objects in the world based on movement speed. The second article is what I will use to help me implement the loop and letting it be controlled with a play button.

https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-smooth-canvas-animation
https://stackoverflow.com/questions/10735922/how-to-stop-a-requestanimationframe-recursion-loop/10748750

![image](startLoop)

I just render a start button to the dom if the map has been loaded. 

![image](stateVars)

There are two new state variables, one to keep track of if the simulation loop has been started, and the animation frame ID to be able to cancel the loop if we want too.

![image](loopLogic)

This is how the game loop operates. If the loop hasnt been started onClick, we start the loop and store the animation frame id. If the loop is already active, we cancel it with the id stored in the variable. 

![image](gameScreenshot)


Some css changes

![image](css1)
![image](css3)
![image](css2)

Added some styling to my pages, it will be a lot nicer to work with now that ive spent some time working on the look and feel of the ui. I like the navigation bar at the top but I might change the buttons later.


This is how the project looks now, I have created everything preliminary to the AI and have 'set the stage' to start working on the AI. First part to that is to handle path finding. That will be the next deblog though.