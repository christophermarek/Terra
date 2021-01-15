import { returnSurfaceObject } from '../../data/map/surfaceObjects';

//takes a surface object and a health modifier amount and returns the object with the property changed
export function updateHealth(obj, amount){
    obj.health = obj.health + amount;

    if(obj.health >= returnSurfaceObject(obj.type).maxHealth){
        obj.health = returnSurfaceObject(obj.type).maxHealth;
    }

    if(obj.health <= 0){
        obj.health = 0;
    }

    return obj;
}