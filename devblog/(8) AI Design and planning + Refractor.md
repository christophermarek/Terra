# (8) AI Design and planning + Refractor

Once I finish this I can implement AI being 'Hungry' -> 'Looking for food' -> 'Going to food' -> Eating -> Full

## Refractor

As I am adding more to the simulation, I have noticed that the file Simulation.js is about 600 lines. This is way to large and it means that I have not organized my code well.

I need to pull out a lot of functions from the Simulation, and organize my codebase.

I need to look at some neglected issues in pathfinding.

First thing I noticed is that I need to make more react components, the game console isnt even a component yet. 

## AI design

The ai system needs a more concrete design. I wanted to do a POC first, and now that I understand how it can be implemented I can design it properly.

I think I need to design a behavior tree system and there will be general behaviors and animal specific behaviors.

Scoring system too

