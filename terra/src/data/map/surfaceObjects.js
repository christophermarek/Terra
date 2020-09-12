
const tree = {
    color: "#42692f",
    type: 'tree',
    size: 30,
    movementSpeed: 50
}

const rabbit = {
    color: "#9f9289",
    type: 'rabbit',
    size: 15,
    movementSpeed: 75,
    maxHealth: 40,
}

const wolf = {
    color: "#FAD7A0",
    type: 'wolf',
    size: 25,
    movementSpeed: 70,
    maxHealth: 60,
}


export function returnSurfaceObject(type){
    switch(type){
        case "tree":
            return tree;
        case "rabbit":
            return rabbit;
        case "wolf":
            return wolf;
        default:
            return tree;
    }
}