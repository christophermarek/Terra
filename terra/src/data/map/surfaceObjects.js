
const tree = {
    color: "#265031",
    type: 'tree',
    size: 30,
    movementSpeed: 0
}

const bush = {
    color: "#1fcb72",
    type: 'bush',
    size: 10,
    movementSpeed: 0
}

const rabbit = {
    color: "#f7e1da",
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
        case "bush":
            return bush;
        case "rabbit":
            return rabbit;
        case "wolf":
            return wolf;
        default:
            return tree;
    }
}