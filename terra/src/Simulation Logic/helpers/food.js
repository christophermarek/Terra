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