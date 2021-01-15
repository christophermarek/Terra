import { getDirectionToPoint, getDistanceToPoint, initPathfinding } from './helpers/movement';
import { updateHunger, loseHungerOverTime } from './helpers/hunger';
import { updateFood, plantFoodTickUpdate, getClosestBush } from './helpers/food';
//import { updateHealth } from './helpers/health';
import { getBrainObjectById, deleteBrainObjById } from './helpers/brain';
import { returnSurfaceObject } from '../data/map/surfaceObjects';
//import { calcHeuristic, search, startSearch } from './pathfinding';
import { getGrid, isPointInBounds } from '../Simulation Logic/grid';
import { startSearch } from './pathfinding';


function removeFromArrayByIndex(arr, index){
    arr.splice(index, 1);
    return arr;
}

//rename, bushes still have a brain like for bounds
function nonBrainObjectUpdate(secondsPassed, update, i){
    
    //nested update logic
    if(update.type === 'bush'){
        plantFoodTickUpdate(secondsPassed, update);
    }

    return update;

}

//unsure if used
//checks current x,y for surfaceObj and updates the bounds[] accordingly
function updateBounds(obj, map){

    //i could calculate bounds all around the circle accurately but this would be very expensive
    //i can do a square around it instead for now.

    //bounds will hold the x,y for the corner

    //bounds init
    let bounds = {
        topLeft: {x:0, y:0},
        topRight: {x:0, y:0},
        bottomLeft: {x:0, y:0},
        bottomRight: {x:0, y:0}
    };

    let fetchedData = returnSurfaceObject(obj.type);
    let radius = fetchedData.size;


    //the x,y in a <circle> is the center of the object, so the bounds would be that x,y 
    //+- the radius for each direction.

    //not sure if bounds being out of the map will break anything?
    //I can check for it

    //can two objects occupy the same space?

    bounds.topLeft = {x: obj.x - radius, y: obj.y - radius};

    
    /*
    //calculate bounds
    for(let n = (obj.x - radius);  n < (obj.x + radius); n++){
        for(let m = (obj.y - radius);  m < (obj.y + radius) + 1; m++){
            //skip if out of grid bounds
            if(n >= 0 && m >=0 && n < map.length * 100 && m < map.length * 100 ){
                //add point to bounds
                bounds.push({x: n, y: m});
            }
        }
    }

   */

    obj.bounds = bounds;
   
    return obj;
}




//when refractor-ing add a brainObjectUpdate() 
export function updateSurfaceObjects(secondsPassed, mapCopy, surfaceObjectsPreUpdate, brainPreUpdate, grid){

    //no surfaceObjects exist
    if(surfaceObjectsPreUpdate.length === undefined){
        return;
    }

    let update = [...surfaceObjectsPreUpdate];
    let brainUpdate = [...brainPreUpdate];

    
    for(let i = 0; i < update.length; i++){

        //brainN has a one to one relationship with a surfaceObject, and it is linked with the surfaceObject id
        let brainN = brainUpdate[brainUpdate.findIndex(x => x.surfaceObjectId === i)];
        //let boundsUpdate = updateBounds(update[i], map);

        //update[i] = boundsUpdate;
        //need a bool property for this
        if(update[i].type === 'bush' || update[i].type === 'tree'){
            update[i] = nonBrainObjectUpdate(secondsPassed, update[i], i);
        }else{

            //should first be a check for survival needs ie water/food/health, then check other actions to do
            //add a way to know how they died, starved to death or health went to low, I would need
            //to remember the last state and check if it was combat or hungry/starving
            if((update[i].health <= 0 || update[i].hunger <= 0) && brainN.action !== "Dying"){
                brainN.action = "Dying";
            }else{

                //TICK STATUS MODIFIERS
                //always loses hunger no matter what
                update[i] = loseHungerOverTime(secondsPassed, update[i]);

                if(update[i].hunger >= 100){
                    /*
                    //move this property initialization somewhere else
                    brainN.depletedBushes = [];

                    //we push the current time in seconds so we can remove it from this data structure if its been more than
                    //a certain time
                    let currentTimeInSeconds = Math.floor(Date.now() / 1000);
                    let depletedBush = {id: brainN.target.id,
                                        timestamp: currentTimeInSeconds
                                    }

                    brainN.depletedBushes.push(depletedBush);
                    //done eating
                    */
                    //console.log("done eating, setting to idle");
                    brainN.action = "Idle";
                    continue;
                }

                 //Movement Disruptor
                if(brainN.action === "Moving" && update[i].hunger <= 50){
                    //console.log("Moving and hunger < 50, setting to hungry");
                    brainN.action = "Hungry"
                    continue;
                }

                //THINKING
                switch (brainN.action){
                    case "Idle":
                        //let testgrid = getGrid(mapCopy, update);
                        //console.log(testgrid.get(Math.round(update[i].x), Math.round(update[i].y)));
                        //console.log(grid[][Math.round(update[i].y)]);
                        //console.log("IDLE");
                        //trigger functions
                        //These get triggered to move ai to a state from idle to an action
                        //if this is not in idle then hunger loop will reset
                        //should be a switch
                        //console.log(update[i].hunger);
                        if(update[i].hunger <= 90){
                            //console.log("triggered to hungry");
                            brainN.action = "Hungry";
                            break;
                        }

                        //default action, pick a random point and move to it.
                        //console.log("default action")
                        //for wander movement
                        //pick a random point 50px any direction from surface object
                        let leftRange = update[i].x - 200;
                        let rightRange = update[i].x + 200;
                        let upperRange = update[i].y - 200;
                        let bottomRange = update[i].y + 200;
                        
                        let randomX = -1;
                        let randomY = -1;
                        
                        //do it until valid co ords are found
                        //if path is a wall that is ok because this will just run again
                        //the next frame
                        while(randomX < 0 || randomY < 0 || randomX > mapCopy.length * 100 || randomY > mapCopy.length * 100){
                            //in range
                            randomX = Math.floor(Math.random() * (rightRange - leftRange + 1)) + leftRange;
                            randomY = Math.floor(Math.random() * (upperRange - bottomRange + 1)) + bottomRange;
                        }

                        //console.log("got a valid point");
                        
                        let randomPoint = {x: randomX, y: randomY};
                        //console.log("random point ", randomPoint);
                        let updatedData = initPathfinding(update[i], brainN, randomPoint, mapCopy, update, grid);

                        //console.log("updatedData", updatedData);

                        //no path found, set state to idle
                        if(!updatedData){
                            //console.log("no path found for wander");
                            brainN.action = "Idle";
                            break;
                        }else{
                            //attach path details to object
                            update[i] = updatedData.surfaceObject;
                            brainN = updatedData.brain;
                            //console.log("successfully going to wander");
                            //set to moving, inits action
                            brainN.action = "Moving";
                            brainN.targetAction = "Wander";
                        }
                        break;

                    case "Reached Target":
                        if(brainN.targetAction === "Eat"){

                            //need to check if we actually reached the target or if the pathfinding messed up
                            if(!(brainN.target.x - 5 <= update[i].x <= brainN.target.x + 5)|| !(brainN.target.y - 5 <= update[i].y <= brainN.target.y + 5)){
                                let updatedData = initPathfinding(update[i], brainN, brainN.target, mapCopy, update, grid);
                                        
                                //no path found, set state to idle
                                if(!updatedData){
                                    //console.log("no path to bush found, setting to idle");
                                    brainN.action = "Idle";
                                }else{
                                    //console.log("set to moving, target is bush");
                                    //attach path details to object
                                    update[i] = updatedData.surfaceObject;
                                    brainN = updatedData.brain;
                
                                    //set to moving, inits action
                                    brainN.action = "Moving";
                                    brainN.target = brainN.target;
                                    brainN.targetAction = "Eat";
                                }
                            }else{
                                brainN.action = "Eat Target";
                            }   
                            //console.log("reached target to eat");
                        }else{
                            //console.log("reached target now idle");
                            brainN.action = "Idle";
                        }

                        break;
                    case "Moving":
                        //console.log("Moving");
                        //update[i] = updateHealth(update[i], -1);
                        //init movement
                        if(!brainN.isMoving){
                            //console.log("in here");
                            //console.log(update[i]);
                            //console.log(brainN.movement);
                            brainN.movement.distanceToPoint = getDistanceToPoint(update[i].x, update[i].y, brainN.movement.endX, brainN.movement.endY);
                            //console.log(brainN.movement.distanceToPoint);
                            let direction = getDirectionToPoint(update[i].x, update[i].y, brainN.movement.endX, brainN.movement.endY, brainN.movement.distanceToPoint);
                            brainN.movement.directionX = direction.x;
                            brainN.movement.directionY = direction.y;
                            brainN.isMoving = true;
                            
                        }else{
                            if(brainN.isAvoiding === undefined || brainN.cycles === undefined){
                                brainN.isAvoiding = false;
                                brainN.cycles = 0;
                            }

                            if(update[i].x < 0 ){
                                update[i].x = 1
                            }
                            if(update[i].y < 0 ){
                                update[i].y = 1
                            }
                            
                            
                            //just so we dont recalculate direction every iteration
                            //count is to let it run away for a few cycles
                            if(isPointInBounds(brainN.surfaceObjectId, {x: Math.round(update[i].x), y: Math.round(update[i].y)}, update)){
                                //direction to point is where we are going,
                                //so we want to flip direction until its not.
                                //brainN.movement.directionX *a= 1;
                                //brainN.movement.directionY *= 1;
                                //move it away from wall a little bit
                                
                                
                                //get the surfaceObject we intersected with.
                                
                                for(let l = 0; l < update.length; l++){
                                    if(update[l].type === "tree"){
                                        if(isPointInBounds(update[l].id, {x: Math.round(update[i].x), y: Math.round(update[i].y)}, update)){
                                            //console.log("id: ", l);
                                            //l is the index of the surfaceObject we collided with

                                            //get all 4 corners of a square of that surfaceObject
                                            //find the surfaceObject we intersected with
                                            let radius = returnSurfaceObject(update[l].type).size;
                                            let topLeftDistance = getDistanceToPoint(update[i].x, update[i].y ,update[l].x - radius, update[l].y - radius);
                                            let bottomLeftDistance = getDistanceToPoint(update[i].x, update[i].y , update[l].x - radius, update[l].y + radius);
                                            let bottomRightDistance = getDistanceToPoint(update[i].x, update[i].y , update[l].x + radius, update[l].y - radius);
                                            let topRightDistance = getDistanceToPoint(update[i].x, update[i].y , update[l].x + radius, update[l].y + radius);
                                            let closestPoint = [{x: update[l].x - radius, y: update[l].y - radius, distance: topLeftDistance}, 
                                                                {x: update[l].x - radius, y: update[l].y + radius, distance: bottomLeftDistance},
                                                                {x: update[l].x + radius, y: update[l].y - radius, distance: bottomRightDistance},
                                                                {x: update[l].x + radius, y: update[l].y + radius, distance: topRightDistance}
                                                                ];
                                            //sort array of points to find the closest point
                                            closestPoint.sort((a, b) => a.distance - b.distance);
                                            //find the closest corner to you at point of collision that we have not already pathed to yet.
                                            //calculate new distance and direction to that point
                                            let direction = getDirectionToPoint(update[i].x, update[i].y, closestPoint[0].x, closestPoint[0].y, closestPoint[0].distance);
                                            brainN.movement.directionX = direction.x;
                                            brainN.movement.directionY = direction.y;
                                            brainN.isAvoiding = true;
                                            //console.log("moving to new direction");

                                            //calculate a new direction and set it to that point.
                                            //when we reach that point we recalculate the direction again. 
                                            console.log("chranging direction");
                                            let updatedData = initPathfinding(update[i], brainN, closestPoint[0], mapCopy, update, grid);

                                            //console.log("updatedData", updatedData);

                                            //no path found, set state to idle
                                            if(!updatedData){
                                                //console.log("no path found for wander");
                                                brainN.action = "Idle";
                                                break;
                                            }else{
                                                //attach path details to object
                                                update[i] = updatedData.surfaceObject;
                                                brainN = updatedData.brain;
                                                //console.log("successfully going to wander");
                                                //set to moving, inits action
                                                brainN.action = "Moving";
                                                brainN.targetAction = "Wander";
                                            }
                                        }
                                    }
                                    
                                }

                                    //Think I need to find a point now, i could just get direction to a corner of the object.
                                    //so if intersect with a circle
                                    
                                    
                                    /*
                                    

                                    if(Math.abs(brainN.movement.directionX) < Math.abs(brainN.movement.directionY)){
                                        //brainN.movement.directionX = brainN.movement.directionY;
                                        brainN.movement.directionY = brainN.movement.directionY * -1;
                                        //brainN.movement.directionX = brainN.movement.directionX * -1;

                                    }else{
                                        //brainN.movement.directionY = brainN.movement.directionX;
                                        brainN.movement.directionX = brainN.movement.directionX * -1;
                                        //brainN.movement.directionY = brainN.movement.directionY * -1;
                                    }
                                    */

                                    update[i].x = update[i].x + (brainN.movement.directionX * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed); 
                                    update[i].y = update[i].y + (brainN.movement.directionY * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed);
                                    
                                    //ok all this does though is make us go oposite of the point, then when we are out of the wall we 
                                    //will go back, we want to find the direction of the point and go opposite of that ya but in a direction to avoid
                                    //it aswell
                                    //now need to make it so we only go to this direction point calculate that distance once and go, then lock out of the cycles
                                    //need to redo this logic
                                    //figure out what is wrong to test just use one surfaceObject and watch if the direction
                                    //changes to early because i think that might be the problem
                                    brainN.cycles += 1;

                                    //console.log("X: ", brainN.movement.directionX, " Y: ", brainN.movement.directionY);
                                    //console.log(brainN.movement.directionX);

                                
                            }else{
                                if(brainN.cycles >= 1){
                                    console.log("getting naew direction");
                                    brainN.cycles = 0;
                                    brainN.isMoving = false;
                                    brainN.isAvoiding = false;
                                    
                                }

                                //its calculated as x += movementspeed * secondspassed
                                //where movement speed is in pixels per second
                                update[i].x = update[i].x + (brainN.movement.directionX * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed); 
                                update[i].y = update[i].y + (brainN.movement.directionY * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed);
                            }
                        }
                        
                        if(Math.hypot(update[i].x - brainN.movement.startX, update[i].y - brainN.movement.startY) >= brainN.movement.distanceToPoint){
                            //else get next point.
                            //when point reached
                            //if last point then set to done moving
                            if(brainN.path.length === 0){
                                //console.log("End of path");
                                brainN.isMoving = false;
                                brainN.action = "Reached Target";
                            
                                //save these incase we ever want to go back to the old locking
                                //update[i].x = brainN.movement.endX;
                                //update[i].y = brainN.movement.endY;
                            }else{
                                let nextPoint = brainN.path.shift();
                                /*
                                //check if object goes to this point they will not be in a wall
                                let x = Math.round(nextPoint.x);
                                let y = Math.round(nextPoint.y);
                                
                                //check if there is a point that we should be at, if there is calculate a new
                                //path for that point
                                if(isPointInBounds(brainN.surfaceObjectId, {x: x, y: y}, update)){
                                    //remove the point from the path
                                    //shifting it out removes it
                                    //brainN.path.splice(i, 1);
                                    //get previous point
                                    let prev = {x: update[i].x, y: update[i].y};
                                    let next = {x: brainN.path[1].x, y: brainN.path[1].y};
                                    let fixedPath = startSearch(prev, next, mapCopy, update, grid);
                                        
                                    if(!fixedPath){
                                        //no path exists
                                        //not sure what to do here
                                        //return false;
                                    }

                                    //const items = [1, 2, 3, 4, 5]
                                    //console.log("inserting new path");
                                        
                                    const insert = (arr, index, ...newItems) => [
                                        // part of the array before the specified index
                                        ...arr.slice(0, index),
                                        // inserted items
                                        ...newItems,
                                        // part of the array after the specified index
                                        ...arr.slice(index)
                                    ]
                                        
                                    for(let j = 0; j < fixedPath.length; j++){
                                        brainN.path = insert(brainN.path, i, fixedPath[j]);
                                    }

                                    //DONT FORGET TO MAKE THE LOOP AFTER

                                }
                                */
                                //console.log(nextPoint);
                                //update[i].x = brainN.movement.endX;
                                //update[i].y = brainN.movement.endY;
                                //console.log("1, ", update[i]);
                                brainN.movement.endX = nextPoint.x;
                                brainN.movement.endY = nextPoint.y;
                                //recalculate movement for new point
                                brainN.isMoving = false;
                            }
                            
                                
                        }
                        //console.log("x,y ", update[i].x, update[i].y);

                        break;

                    case "Dying":
                        //console.log("Dying");
                        //remove from surfaceObjects
                        update = removeFromArrayByIndex(update, i);
                        brainUpdate = deleteBrainObjById(brainUpdate, i); 
                        break;
                    case "Hungry":
                        //console.log("from hungry");
                        let bush = getClosestBush(update, update[i], brainN);
                        if(bush === null){
                            //stay hungry
                            console.log("no bush");
                        }else{
                            //let target = {x: 101, y: 298};
                            //console.log(target);
                            //init pathfinding
                            let updatedData = initPathfinding(update[i], brainN, bush, mapCopy, update, grid);
                                            
                            //no path found, set state to idle
                            if(!updatedData){
                                //console.log("no path to bush found, setting to idle");
                                brainN.action = "Idle";
                            }else{
                                //console.log("set to moving, target is bush");
                                //attach path details to object
                                update[i] = updatedData.surfaceObject;
                                brainN = updatedData.brain;
            
                                //set to moving, inits action
                                brainN.action = "Moving";
                                brainN.target = bush;
                                brainN.targetAction = "Eat";
                            }
                        }
                        break;
                    case "Eat Target":
                        //console.log("eating target");
                        //decrease food & hunger by 1
                        for(let z = 0; z < update.length; z++){
                            if(update[z].id === brainN.target.id){
                                updateFood(update[z], -2);
                                updateHunger(update[i], 1);
                            }
                        }
                        break;
                    
                }     

            }
            //console.log(brainN.action);
        }
    }
    return {surfaceObjects: update, brain: brainUpdate};
}