import { startSearch } from '../pathfinding';

export function getDistanceToPoint(x, y, destX, destY){
    //console.log(" x: " + x + " y: " + y + " destX: " + destX + " destY: " + destY);
    let distance = Math.hypot(destX - x, destY - y);
    return distance;
}

export function getDirectionToPoint(x, y, destX, destY, distance){

    let xDir = (destX - x) / distance
    let yDir = (destY - y) / distance
    
    return {x: xDir, y: yDir};
}

//modifies the objects properties so its ready for pathfinding.
//creates a new path to destination for obj, and sets state it needs to start the "Moving" action
//takes surfaceObject and brainObject
export function initPathfinding(obj, brainN, target, map, surfaceObjects){
    //i pass obj.x obj.y and obj. Refractor to just pass obj instead and pull properties
    brainN.path = startSearch(obj, target, map, surfaceObjects);

    if(!brainN.path){
        return false;
    }

    let nextPoint = brainN.path.shift();
    //console.log(brainN)
    if(nextPoint === undefined){
        return false;
    }else{
        //set endX and endY to the x and y from this
        brainN.movement.endX = nextPoint.x;
        brainN.movement.endY = nextPoint.y;
        brainN.movement.startX = obj.x;
        brainN.movement.startY = obj.y;
    }

    return {surfaceObject: obj, brain: brainN};
}
