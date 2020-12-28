import { getDirectionToPoint, getDistanceToPoint, initPathfinding } from './helpers/movement';
import { updateHunger, loseHungerOverTime } from './helpers/hunger';
import { updateFood, plantFoodTickUpdate, getClosestBush } from './helpers/food';
import { updateHealth } from './helpers/health';
import { getBrainObjectById, deleteBrainObjById } from './helpers/brain';
import { returnSurfaceObject } from '../data/map/surfaceObjects';
import { calcHeuristic, search, startSearch } from './pathfinding';

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
export function updateSurfaceObjects(secondsPassed, mapCopy, surfaceObjectsPreUpdate, brainPreUpdate, map){

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

        if(update[i].type === 'bush'){
            update[i] = nonBrainObjectUpdate(secondsPassed, update[i], i);
        }else{

        //thinking
        //should first be a check for survival needs ie water/food/health, then check other actions to do
        //add a way to know how they died, starved to death or health went to low, I would need
        //to remember the last state and check if it was combat or hungry/starving
        if((update[i].health <= 0 || update[i].hunger <= 0) && brainN.action != "Dying"){
            brainN.action = "Dying";
        }else{

            //always loses hunger no matter what
            update[i] = loseHungerOverTime(secondsPassed, update[i])

            //root thinking
            if(brainN.action === "Idle"){            
    
                //trigger functions
                //if this is not in idle then hunger loop will reset
                if(update[i].hunger <= 50){
                    brainN.action = "Hungry";
                }
                
            }

            //after idle thoughts
            //maybe call it secondary thoughts
            
            /*
            if(update[i].hunger <= 20){
                brainN.action = "Starving";
            }
            */

            

            if(update[i].hunger >= 100){
                //move this property initialization somewhere else
                brainN.depletedBushes = [];

                //we push the current time in seconds so we can remove it from this data structure if its been more than
                //a certain time
                let currentTimeInSeconds = Math.floor(Date.now() / 1000);
                let depletedBush = {id: brainN.target.id,
                                    timestamp: currentTimeInSeconds
                                   }

                brainN.depletedBushes.push(depletedBush);

                brainN.action = "Idle";
            }

            if(brainN.action === "Reached Target"){
                if(brainN.targetAction === "Eat"){
                    brainN.action = "Eat Target";
                }else{
                    brainN.action = "Idle";
                }
            }
            
        }

        //convert this to a switch with a function for each action
        //actions
        if(brainN.action === "Dying"){
            //remove from surfaceObjects
            update = removeFromArrayByIndex(update, i);
            brainUpdate = deleteBrainObjById(brainUpdate, i); 
        }

        if(brainN.action === "Hungry"){
            let bush = getClosestBush(update, update[i], brainN);
            if(bush === null){
                //stay hungry
                console.log("no bush");
            }else{
                //let target = {x: 101, y: 298};
                //console.log(target);
                //init pathfinding
                let updatedData = initPathfinding(update[i], brainN, bush, mapCopy, update);
                
                console.log(updatedData);
                
                //no path found, set state to idle
                if(!updatedData){
                    brainN.action = "Idle";
                }else{
                    //attach path details to object
                    update[i] = updatedData.surfaceObject;
                    brainN = updatedData.brain;

                    //set to moving, inits action
                    brainN.action = "Moving";
                    brainN.target = bush;
                    brainN.targetAction = "Eat";
                }
                

            }

            
        }

        /*
        if(brainN.action === "Hungry" || brainN.action === "Starving"){
            //eat food
            brainN.action = "Eating";
        }

        if(brainN.action === "Eating"){
            if(update[i].hunger < 100){
                updateHunger(update[i], 1);
            }
        }
        */
        
        if(brainN.action === "Eat Target"){
            //decrease food & hunger by 1
            for(let z = 0; z < update.length; z++){
                if(update[z].id === brainN.target.id){
                    updateFood(update[z], -2);
                    updateHunger(update[i], 1);
                }
            }

        }
        
        //default action when nothing else is chosen
        if(brainN.action === "Idle"){
            //get a random point somewhere
            //set to moving right like how we do when we get a random bush
        }
        

        if(brainN.action === "Moving"){
            //update[i] = updateHealth(update[i], -1);
            //init movement
            if(!brainN.isMoving){
                brainN.movement.distanceToPoint = getDistanceToPoint(update[i].x, update[i].y, brainN.movement.endX, brainN.movement.endY);
                let direction = getDirectionToPoint(update[i].x, update[i].y, brainN.movement.endX, brainN.movement.endY, brainN.movement.distanceToPoint);
                brainN.movement.directionX = direction.x;
                brainN.movement.directionY = direction.y;
                brainN.isMoving = true;
            }else{
                //its calculated as x += movementspeed * secondspassed
                //where movement speed is in pixels per second
                update[i].x = update[i].x + (brainN.movement.directionX * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed); 
                update[i].y = update[i].y + (brainN.movement.directionY * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed);
            }
           
            if(Math.hypot(update[i].x - brainN.movement.startX, update[i].y - brainN.movement.startY) >= brainN.movement.distanceToPoint){
                //else get next point.
                //when point reached
                //if last point then set to done moving
                if(brainN.path.length == 0){
                    brainN.isMoving = false;
                    brainN.action = "Reached Target";
                    update[i].x = brainN.movement.endX;
                    update[i].y = brainN.movement.endY;
                }else{
                    let nextPoint = brainN.path.shift();
                    update[i].x = brainN.movement.endX;
                    update[i].y = brainN.movement.endY;
                    brainN.movement.endX = nextPoint.x;
                    brainN.movement.endY = nextPoint.y;

                }
                
            }
            
        
        }


    }


    
    

        }
        
    return {surfaceObjects: update, brain: brainUpdate};

}