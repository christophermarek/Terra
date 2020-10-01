import { getDistanceToPoint } from './movement';

//used for bush food property
export function updateFood(obj, amount){
    if(obj.food + amount <= 0 ){
        obj.food = 0;
    }else{
        obj.food = obj.food + amount;
    }


    return obj;
}

export function plantFoodTickUpdate(secondsPassed, obj){
    //where the food tick update rate is food tick rate * time elapsed
    let foodTickRate = 1 * secondsPassed;
    obj = updateFood(obj, foodTickRate);
    
    return obj;
}

export function checkDepletedBushesDurations(surfaceObjects, brainN){
    
    /*

    Not a good implementation 

    let bushes = surfaceObjects.filter(object => object.type === 'bush');

    for(let i = 0; i < bushes; i++){
        if(Math.floor(Date.now() / 1000) - brainN.depletedBushes[i].timestamp >= 10){
            
        }
    }

    return obj;
    */
}

//where obj is the surfaceObject we are searching from
//returns null if no bush found
export function getClosestBush(surfaceObjects, obj, brainN){

    if(brainN.depletedBushes === undefined){
        brainN.depletedBushes = [];
    }

    let bushes = surfaceObjects.filter(object => object.type === 'bush');

    //go through each bush
    let closestBushDistance = -1;
    let closestBush = null;

    bushLoop:
        for(let i = 0; i < bushes.length; i++){
            
            for(let j = 0; j < brainN.depletedBushes.length; j++){
                if(bushes[i].id === brainN.depletedBushes[j].id){
                    //if it has been depleted for more than 10 seconds we can go back to it again
                    if(Math.floor(Date.now() / 1000) - brainN.depletedBushes[i].timestamp >= 10){
                        //I would update the brainN object but I cannot here because this isnt a brain
                        //modifying function.
                        //this check might be useless since I think I have to make a cleanDepletedBushes() before I call this function
                        //anyways or else deplete bushes will never empty.
                    }else{
                        //skip searching this bush
                        continue bushLoop;
                    }
                }
            }

            let distFromBush = getDistanceToPoint(obj.x, obj.y, bushes[i].x, bushes[i].y); 
            if(distFromBush < closestBushDistance || closestBushDistance == -1){
                closestBushDistance = distFromBush;
                closestBush = bushes[i];
            }
        }

    return closestBush;    
    
}