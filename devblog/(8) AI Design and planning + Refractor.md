# (8) AI Design and planning + Refractor

Once I finish this I can implement AI being 'Hungry' -> 'Looking for food' -> 'Going to food' -> Eating -> Full

## Refractor

As I am adding more to the simulation, I have noticed that the file Simulation.js is about 600 lines. This is way to large and it means that I have not organized my code well.

I need to pull out a lot of functions from the Simulation, and organize my codebase.

I need to look at some neglected issues in path finding.

First thing I noticed is that I need to make more react components, the game console isnt even a component yet.

So I pulled out most of the code from gameconsole to its own component. I need to keep the message state arrays inside simulation though as the simulation file is where I will be adding new messages from.

Most of the wasted space in this file is from pathfinding and the gameloop. These need to be pulled out.

I pulled the setupGrid function into its own file now, I think it is better like this anyways because we just want a grid returned, so having an external function to do just that is ok.

I have only reduced about 80 lines so far. The updateSurfaceObject loop is about 140 lines right now.

The main focus of this refractor is that I want the Simulation.js to only have the necessary code to display the ui and run the simulation. If i can export the simulation logic away from the main Simulation.js page I can have a more dynamic system to make future updates easier.

I have pulled the helper functions for the simulation logic into their own files. So the hunger functions will be in there own folder, and health, etc. Good thing these functions dont directly access state and were designed to just take the input obj and return it modified. So its really easy to export out.

Why am I writing all of this? Maybe delete this explanation not really needed.



## AI design

The ai system needs a more concrete design. I wanted to do a POC first, and now that I understand how it can be implemented I can design it properly.

I think I need to design a behavior tree system and there will be general behaviors and animal specific behaviors.

Scoring system too

