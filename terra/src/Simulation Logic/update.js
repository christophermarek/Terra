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

function nonBrainObjectUpdate(secondsPassed, update, i){
    
    //nested update logic
    if(update.type === 'bush'){
        plantFoodTickUpdate(secondsPassed, update);
    }

    return update;

}


//when refractor-ing add a brainObjectUpdate() 
export function updateSurfaceObjects(secondsPassed, mapCopy, surfaceObjectsPreUpdate, brainPreUpdate){

    //no surfaceObjects exist
    if(surfaceObjectsPreUpdate.length === undefined){
        return;
    }

    let update = [...surfaceObjectsPreUpdate];
    let brainUpdate = [...brainPreUpdate];

    
    for(let i = 0; i < update.length; i++){

        if(update[i].type === 'bush'){
            update[i] = nonBrainObjectUpdate(secondsPassed, update[i], i);
        }else{
            //brainN has a one to one relationship with a surfaceObject, and it is linked with the surfaceObject id
            let brainN = brainUpdate[brainUpdate.findIndex(x => x.surfaceObjectId === i)];

        
        //thinking
        //should first be a check for survival needs ie water/food/health, then check other actions to do
        //add a way to know how they died, starved to death or health went to low, I would need
        //to remember the last state and check if it was combat or hungry/starving
        if((update[i].health <= 0 || update[i].hunger <= 0) && brainN.action != "Dying"){
            brainN.action = "Dying";
        }else{
            //root thinking
            if(brainN.action === "Idle"){
                update[i] = loseHungerOverTime(secondsPassed, update[i])

                //add brain variable of path to find array
                //here pop out the next point to travel to and set endX and endY to that point
                //check if path exists, if not generate one to 250, 250

                //needs to be removed and integrated into a function that needs pathfinding
                
                /*
                if(brainN.path === undefined){
                    
                }
                */
               
                //trigger functions
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
                //brainN.action = "Full";
            }

            if(brainN.action === "Reached Target"){
                
                //check target action and do that
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
            let bush = getClosestBush(update, update[i]);
            if(bush === null){
                //stay hungry
                console.log("no bush");
            }

            let target = {x: bush.x, y: bush.y};

            //init pathfinding
            let updatedData = initPathfinding(update[i], brainN, target, mapCopy, update);

            update[i] = updatedData.surfaceObject;
            brainN = updatedData.brain;

            //set to moving, inits action
            brainN.action = "Moving";
            brainN.target = bush;
            brainN.targetAction = "Eat";

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