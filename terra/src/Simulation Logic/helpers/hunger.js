//takes a surfaceObject and a hunger modifier and returns the object with the property changed
export function updateHunger(obj, amount){
    obj.hunger = obj.hunger + amount;

    return obj;
}

//takes surfaceObject and time elapsed and updates the objects hunger to the amount lost over the secondsPassed
export function loseHungerOverTime(secondsPassed, obj){
    //where the rate is hunger depletion speed * time elapsed
    // * -1 to make it decrease
    let hungerDepletionAmount = 1.5 * secondsPassed * - 1;
    obj = updateHunger(obj, hungerDepletionAmount);
    
    return obj;
}

