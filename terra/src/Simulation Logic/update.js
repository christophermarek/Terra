import { getDirectionToPoint, getDistanceToPoint, initPathfinding } from './helpers/movement';
import { updateHunger, loseHungerOverTime } from './helpers/hunger';
import { upddateThirst, loseThirstOverTime, updateThirst } from './helpers/thirst';
import { updateFood, plantFoodTickUpdate, getClosestBush } from './helpers/food';
import { updateHealth } from './helpers/health';
import { deleteBrainObjById } from './helpers/brain';
import { returnSurfaceObject } from '../data/map/surfaceObjects';
import { getGridElementAtKey, getNearbyPointThatIsntWall } from '../Simulation Logic/grid';


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
export function updateSurfaceObjects(secondsPassed, mapCopy, surfaceObjectsPreUpdate, brainPreUpdate, grid){
    //no surfaceObjects exist
    if(surfaceObjectsPreUpdate.length === undefined){
        return;
    }

    let update = [...surfaceObjectsPreUpdate];
    let brainUpdate = [...brainPreUpdate];

    
    for(let i = 0; i < update.length; i++){
        //update[i].x = Math.round(update[i].x);
        //update[i].y = Math.round(update[i].y);

        let brainN = brainUpdate[brainUpdate.findIndex(x => x.surfaceObjectId === update[i].id)];
        //need a bool property for this
        if(update[i].type === 'bush' || update[i].type === 'tree'){
            update[i] = nonBrainObjectUpdate(secondsPassed, update[i], i);
        }else{

            if((update[i].health <= 0) && brainN.action !== "Dying"){
                brainN.action = "Dying";
                continue;
            }else{
                //TICK STATUS MODIFIERS

                //starve to death
                if(update[i].hunger <= 0 && update[i].health > 0){
                    update[i] = updateHealth(update[i], -1);
                    continue;
                }

                if(update[i].thirst <= 0 && update[i].health > 0){
                    update[i] = updateHealth(update[i], -1);
                    continue;
                }

                
                update[i] = loseHungerOverTime(secondsPassed, update[i]);
                update[i] = loseThirstOverTime(secondsPassed, update[i]);
                
                if(update[i].hunger >= 100){
                    brainN.action = "Idle";
                    continue;
                }

                if(update[i].thirst >= 100){
                    brainN.action = "Idle";
                    continue;
                }

                //movement disruptors
                if(brainN.action === 'Moving' && brainN.targetAction === 'Wander'){
                    if(update[i].hunger <= 50){
                        brainN.action = "Hungry";
                        continue;
                    }
                    if(update[i].thirst <= 50){
                        brainN.action = "Thirsty";
                        continue;
                    }
                }


                //THINKING
                switch (brainN.action){
                    case "Idle":
                        if(update[i].hunger <= 50){
                            brainN.action = "Hungry";
                            break;
                        }

                        if(update[i].thirst <= 50){
                            brainN.action = "Thirsty";
                            break;
                        }

                        //default action, pick a random point and move to it.
                        //for wander movement
                        //pick a random point 200px any direction from surface object
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
                            if(getGridElementAtKey(randomX, randomY) === 1){
                                randomX = -1;
                            }
                        }
                        
                        let randomPoint = {x: randomX, y: randomY};
                        let updatedData = initPathfinding(update[i], brainN, randomPoint, mapCopy, update, grid);
                        //no path found, set state to idle
                        if(!updatedData){

                            console.log("idle no path found for, ", brainN.surfaceObjectId);

                            //need to catch the error for when we are trapped in a tree
                            //we will never make a valid path because update[i] is going to have starting
                            //coords that are a wall.

                            //need to find a nearby point that is not a wall.
                            let nearbyValidPoint = getNearbyPointThatIsntWall(update[i].x, update[i].y);
                            //reset surfaceObject to this x,y. will be so close usually that you cant tell.
                            update[i].x = nearbyValidPoint.x;
                            update[i].y = nearbyValidPoint.y;

                            brainN.action = "Idle";
                            break;
                        }else{
                            //attach path details to object
                            update[i] = updatedData.surfaceObject;
                            brainN = updatedData.brain;
                            //set to moving, inits action
                            brainN.action = "Moving";
                            brainN.targetAction = "Wander";
                        }
                        break;

                    case "Reached Target":
                        if(brainN.targetAction === "Eat"){
                            brainN.action = "Eat Target";
                        }else if(brainN.targetAction === "Drink"){
                            brainN.action = "Drink Target";
                        }else{
                            brainN.action = "Idle";
                        }

                        break;
                    case "Moving":
                        if(getGridElementAtKey(update[i].x, update[i].y) === 1){
                            let point = getNearbyPointThatIsntWall(update[i].x, update[i].y);
                            update[i].x = point.x;
                            update[i].y = point.y;

                            break;
                        }

                        if((Math.hypot(update[i].x - brainN.movement.startX, update[i].y - brainN.movement.startY) >= brainN.movement.distanceToPoint)){
                            if(brainN.path.length === 0){
                                brainN.isMoving = false;
                                brainN.action = "Reached Target";
                            }else{
                                let nextPoint = brainN.path.shift();
                                brainN.movement.endX = nextPoint.x;
                                brainN.movement.endY = nextPoint.y;
                                //recalculate movement for new point
                                brainN.isMoving = false;
                            }
                            
                        }
                    
                        //init movement
                        if(!brainN.isMoving){
                            brainN.movement.distanceToPoint = getDistanceToPoint(update[i].x, update[i].y, brainN.movement.endX, brainN.movement.endY);
                            let direction = getDirectionToPoint(update[i].x, update[i].y, brainN.movement.endX, brainN.movement.endY, brainN.movement.distanceToPoint);
                            brainN.movement.directionX = direction.x;
                            brainN.movement.directionY = direction.y;
                            brainN.isMoving = true;
                            break;                            
                        }else{

                            update[i].x = update[i].x + (brainN.movement.directionX * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed); 
                            update[i].y = update[i].y + (brainN.movement.directionY * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed);

                            //check if this movement will make us go into a wall
                            //if it does we need to reset our path
                            if(getGridElementAtKey(update[i].x, update[i].y) === 1){
                                //console.log("movement will make us go into a wall, resetting to");
                                let point = getNearbyPointThatIsntWall(update[i].x, update[i].y);
                                update[i].x = point.x;
                                update[i].y = point.y;
                                brainN.isMoving = false;

                            }
                        }
                        break;
                    case "Dying":
                        update = removeFromArrayByIndex(update, i);
                        brainUpdate = deleteBrainObjById(brainUpdate, update.id); 
                        break;
                    case "Thirsty":
                        //find a water nearby
                        let closestWaterTile = 0;
                        let closestWaterDistance = -1;
                        for(let i = 0; i < mapCopy.length; i++){
                            for(let j = 0; j < mapCopy.length; j++){
                                if(mapCopy[i][j].type === 'water'){
                                    let x = j * 100;
                                    let y = i * 100;
                                    let distFromWater = getDistanceToPoint(update[i].x, update[i].y, x, y); 
                                    if(distFromWater < closestWaterDistance || closestWaterDistance === -1){
                                        closestWaterDistance = distFromWater;
                                        closestWaterTile = {x: x, y: y};
                                    }
                                }
                            }
                        }
                        if(closestWaterTile === 0){
                            brainN.action = "Idle";
                        }

                        //this is only the top left corner of the tile. Now we need to get a point on the perimiter that is
                        //the closest to the surfaceObject to go to.
                        //can just do corners and midpoints.
                        let topLeft = closestWaterTile;
                        let topMid = {x: closestWaterTile.x + 50, y: closestWaterTile.y}
                        let topRight = {x: closestWaterTile.x + 100, y: closestWaterTile.y}
                        let left = {x: closestWaterTile.x, y: closestWaterTile.y + 50};
                        let right = {x: closestWaterTile.x + 100, y: closestWaterTile.y + 50};
                        let bottomLeft = {x: closestWaterTile.x + 0, y: closestWaterTile.y + 100}
                        let bottomMid = {x: closestWaterTile.x + 50, y: closestWaterTile.y + 100}
                        let bottomRight = {x: closestWaterTile.x + 100, y: closestWaterTile.y + 100}
                        let points = [topLeft, topMid, topRight, left, right, bottomLeft, bottomMid, bottomRight];
                        let closestPoint = 0;
                        let closestPointDistance = -1;
                        for(let v = 0; v < points.length; v++){
                            let distFromPoint = getDistanceToPoint(update[i].x, update[i].y, points[v].x, points[v].y);
                            if(distFromPoint < closestPointDistance || closestPointDistance === -1){
                                closestPointDistance = distFromPoint;
                                closestPoint = {x: points[v].x, y: points[v].y};
                            }
                        }
                        closestPoint = getNearbyPointThatIsntWall(closestPoint.x, closestPoint.y);
                        let waterUpdatedData = initPathfinding(update[i], brainN, closestPoint, mapCopy, update, grid);

                        //no path found, set state to idle
                        if(!waterUpdatedData){
                            console.log("no water")
                            let nearbyValidPoint = getNearbyPointThatIsntWall(update[i].x, update[i].y);
                            //reset surfaceObject to this x,y. will be so close usually that you cant tell.
                            update[i].x = nearbyValidPoint.x;
                            update[i].y = nearbyValidPoint.y;
                            brainN.action = "Idle";
                            break;
                        }else{

                            update[i] = waterUpdatedData.surfaceObject;
                            brainN = waterUpdatedData.brain;
            
                            //set to moving, inits action
                            brainN.action = "Moving";
                            brainN.target = closestPoint;
                            brainN.targetAction = "Drink";
                        }
                        

                        break;

                    case "Hungry":
                        let bush = getClosestBush(update, update[i], brainN);
                        if(bush === null){
                            //stay hungry
                        }else{
                            let updatedData;
                            //we need to check if start point is wall.
                            //if it is then we need to find the closest point that is not a wall.
                            //and change start point to that
                            updatedData = initPathfinding(update[i], brainN, bush, mapCopy, update, grid);

                            //no path found, set state to idle
                            if(!updatedData){
                                let nearbyValidPoint = getNearbyPointThatIsntWall(update[i].x, update[i].y);
                                //reset surfaceObject to this x,y. will be so close usually that you cant tell.
                                update[i].x = nearbyValidPoint.x;
                                update[i].y = nearbyValidPoint.y;
                                brainN.action = "Idle";
                                break;
                            }else{
                                brainN.closestPoint = 0;
                                brainN.counter = 0;
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

                    case "Drink Target":
                        //calculate new path
                        //15 is rabbit size and 10 is how close i want to be to target
                        if(!(Math.hypot(update[i].x - brainN.target.x, update[i].y - brainN.target.y) <= (15 + 10))){
                            let updatedData = initPathfinding(update[i], brainN, brainN.target, mapCopy, update, grid);
                            //no path found, set state to idle
                            if(!updatedData){
                                brainN.action = "Idle";
                            }else{
                                //attach path details to object
                                update[i] = updatedData.surfaceObject;
                                brainN = updatedData.brain;
            
                                //set to moving, inits action
                                brainN.action = "Moving";
                                brainN.targetAction = "Drink";
                            }
                            break;
                        }else{
                            updateThirst(update[i], 1);
                            break;
                        }
                    case "Eat Target":
                        //calculate new path
                        //15 and 10 are bush size and rabbit size
                        if(!(Math.hypot(update[i].x - brainN.target.x, update[i].y - brainN.target.y) <= (15 + 10))){
                            let updatedData = initPathfinding(update[i], brainN, brainN.target, mapCopy, update, grid);
                            //no path found, set state to idle
                            if(!updatedData){
                                brainN.action = "Idle";
                            }else{
                                //attach path details to object
                                update[i] = updatedData.surfaceObject;
                                brainN = updatedData.brain;
            
                                //set to moving, inits action
                                brainN.action = "Moving";
                                brainN.targetAction = "Eat";
                            }
                        }else{
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

            }
        }
    }
    return {surfaceObjects: update, brain: brainUpdate};
}