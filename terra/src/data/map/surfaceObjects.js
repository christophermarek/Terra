
const tree = {
    color: "#42692f",
    size: "30",
    movementSpeed: 50
}

const rabbit = {
    color: "#9f9289",
    size: "15",
    movementSpeed: 75,
}

const wolf = {
    color: "#FAD7A0",
    size: "25",
    movementSpeed: 70,
}


export function returnSurfaceObject(type){
    switch(type){
        case "tree":
            return tree;
        case "rabbit":
            return rabbit;
        case "wold":
            return wolf;
        default:
            return tree;
    }
}