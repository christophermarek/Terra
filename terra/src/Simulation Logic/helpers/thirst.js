//takes a surfaceObject and a thirst modifier and returns the object with the property changed
export function updateThirst(obj, amount){
    obj.thirst = obj.thirst + amount;
    return obj;
}

//takes surfaceObject and time elapsed and updates the objects thirst to the amount lost over the secondsPassed
export function loseThirstOverTime(secondsPassed, obj){
    //where the rate is thirst depletion speed * time elapsed
    // * -1 to make it decrease
    let thirstDepletionAmount = 10 * secondsPassed * - 1;
    obj = updateThirst(obj, thirstDepletionAmount);
    //console.log(obj);
    
    return obj;
}

