//takes a surfaceObject and a hunger modifier and returns the object with the property changed
export function updateHunger(obj, amount){
    obj.hunger = obj.hunger + amount;

    return obj;
}

//takes surfaceObject and time elapsed and updates the objects hunger to the amount lost over the secondsPassed
export function loseHungerOverTime(secondsPassed, obj){
    //where the rate is hunger depletion speed * time elapsed
    let hungerDepletionAmount = 10 * secondsPassed * -1;
    obj = updateHunger(obj, hungerDepletionAmount);
    
    return obj;
}

