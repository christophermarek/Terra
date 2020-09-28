import { getDistanceToPoint } from './movement';

//used for bush food property
export function updateFood(obj, amount){
    obj.food = obj.food + amount;

    return obj;
}

export function plantFoodTickUpdate(secondsPassed, obj){
    //where the food tick update rate is food tick rate * time elapsed
    let foodTickRate = 3 * secondsPassed;
    obj = updateFood(obj, foodTickRate);
    
    return obj;
}

//where obj is the surfaceObject we are searching from
//returns null if no bush found
export function getClosestBush(surfaceObjects, obj){
    let bushes = surfaceObjects.filter(object => object.type === 'bush');

    //go through each bush
    let closestBushDistance = -1;
    let closestBush = null;

    for(let i = 0; i < bushes.length; i++){
        let distFromBush = getDistanceToPoint(obj.x, obj.y, bushes[i].x, bushes[i].y); 
        if(distFromBush < closestBushDistance || closestBushDistance == -1){
            closestBushDistance = distFromBush;
            closestBush = bushes[i];
        }
    }

    console.log(closestBush);
    return closestBush;
    
    
}