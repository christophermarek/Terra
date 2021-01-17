import { returnSurfaceObject } from '../data/map/surfaceObjects';

let ndarray = require('ndarray');
let createPlanner = require('l1-path-finder');

let grid = [];

let planner = 0;

export function getGrid(map, surfaceObjects){

    //I wonder if this will create a new grid, if we have a grid loaded from one map,
    //and then load into a different map in the same session. 
    if(grid.length === 0){
        grid = setupNdGrid(map, surfaceObjects);
        return grid;
    }else{
        return grid;
    }
}

export function getPlanner(map, surfaceObjects){
    if(planner === 0){
        planner = setupPlanner(map, surfaceObjects);
        return planner;
    }else{
        return planner;
    }
}  

//checks if surface object is at this point, will its bounds collide with anything
export function isPointInBounds(surfaceObjectId, point, surfaceObjects){

    let surfaceObj;
    for(let n = 0; n < surfaceObjects.length; n++){
        if(surfaceObjects[n].id === surfaceObjectId){
            surfaceObj = surfaceObjects[n];
        }
    }

    let radius = returnSurfaceObject(surfaceObj.type).size;

    for (let i = point.x - radius ; i <= point.x; i++){
        for (let j = point.y - radius ; j <= point.y; j++){
            if ((i - point.x)*(i - point.x) + (j - point.y)*(j - point.y) <= radius*radius){
                let xSym = point.x - (i - point.x);
                let ySym = point.y - (j - point.y);
                // (x, y), (x, ySym), (xSym , y), (xSym, ySym) are in the circle                
                if(grid.get(i, j) === 1){
                    return true;
                }

                if(grid.get(i, ySym) === 1){
                    return true;
                }

                if(grid.get(xSym, j) === 1){
                    return true;
                }

                if(grid.get(xSym, ySym) === 1){
                    return true;
                }

            }
        }
    }

    return false;
}

function setupPlanner(map, surfaceObjects){
    //Create path planner
    planner = createPlanner(getGrid(map, surfaceObjects));
    return planner;
}

export function getGridElementAtKey(x, y){
    return grid.get(Math.round(x), Math.round(y))
}

export function getNearbyPointThatIsntWall(x, y){
    x = Math.round(x);
    y = Math.round(y);
    //console.log(`grid get at x: ${x} y: ${y} = ` + grid.get(x, y));
    let counter = 0;
    let validPoint = 0;
    while(validPoint === 0){

        if(grid.get(x + counter, y + counter) === 0){
            validPoint = {x: x + counter, y: y + counter};
            break;
        }


        if(grid.get(x - counter, y - counter) === 0){
            validPoint = {x: x - counter, y: y - counter};
            break;
        }
        if(grid.get(x + counter, y - counter) === 0){
            validPoint = {x: x + counter, y: y - counter};
            break;
        }
        if(grid.get(x - counter, y + counter) === 0){
            validPoint = {x: x - counter, y: y + counter};
            break;
        }
        counter += 1;
    }

    return validPoint;
}


function setupNdGrid(map, surfaceObjects){
    let size = (map.length * 100) * (map.length * 100);
    //fill with 0s
    for(let i = 0; i < size; i++){
        grid[i] = 0;
    }

    //Create a maze as an ndarray
    grid = ndarray(grid, [map.length * 100, map.length * 100])
    
    for(let k = 0; k < surfaceObjects.length; k++){
        let fetchedData = returnSurfaceObject(surfaceObjects[k].type);
        let radius = fetchedData.size;
        //if tree then set as wall
        if(surfaceObjects[k].type === "tree"){
            for (let i = surfaceObjects[k].x - radius ; i <= surfaceObjects[k].x; i++){
                for (let j = surfaceObjects[k].y - radius ; j <= surfaceObjects[k].y; j++){
                    if ((i - surfaceObjects[k].x)*(i - surfaceObjects[k].x) + (j - surfaceObjects[k].y)*(j - surfaceObjects[k].y) <= radius*radius){
                        let xSym = surfaceObjects[k].x - (i - surfaceObjects[k].x);
                        let ySym = surfaceObjects[k].y - (j - surfaceObjects[k].y);
                        // (x, y), (x, ySym), (xSym , y), (xSym, ySym) are in the circle
                        grid.set(i,j, 1);
                        grid.set(i,ySym, 1);
                        grid.set(xSym, j, 1);
                        grid.set(xSym, ySym, 1);
                    }
                }
            }
        }
    }

    return grid;
}
