
const tree = {
    color: "#42692f",
    size: "30",
}

const rabbit = {
    color: "#9f9289",
    size: "15",
}

const wolf = {
    color: "#FAD7A0",
    size: "25",
}

export function returnSurfaceObject(type){
    switch(type){
        case "tree":
            return tree;
        case "rabbit":
            return rabbit;
        case "wold":
            return wolf;
    }
}