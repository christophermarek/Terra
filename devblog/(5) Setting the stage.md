
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