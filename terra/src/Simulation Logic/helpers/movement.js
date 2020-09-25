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