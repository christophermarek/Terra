import { returnSurfaceObject } from '../data/map/surfaceObjects';

let ndarray = require('ndarray');
let createPlanner = require('l1-path-finder');

//let grid = [];
//let planner = 0;

//checks if surface object is at this point, will its bounds collide with anything
export function isPointInBounds(surfaceObjectId, point, surfaceObjects, grid){

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

export function setupPlanner(map, surfaceObjects, grid){
    //console.log(grid);
    return createPlanner(grid);
}

export function getGridElementAtKey(x, y, grid){
    x = Math.round(x);
    //console.log(grid);
    y = Math.round(y);
   // console.log(grid);
   /*
    if(grid.get(x,y) === 1){
        console.log("x,y",x,y, " grid: " , grid.get(x, y));
    }\
    */
    return grid.get(x, y);
}

export function getNearbyPointThatIsntWall(x, y, grid){
    x = Math.round(x);
    y = Math.round(y);
    let counter = 0;
    let validPoint = 0;
    while(validPoint === 0){

        if(grid.get(x + counter, y + counter) === 0 && grid.get(x + counter, y + counter) !== undefined){
            validPoint = {x: x + counter, y: y + counter};
            break;
        }
        if(grid.get(x - counter, y - counter) === 0 && grid.get(x + counter, y + counter) !== undefined){
            validPoint = {x: x - counter, y: y - counter};
            break;
        }
        if(grid.get(x + counter, y - counter) === 0 && grid.get(x + counter, y + counter) !== undefined){
            validPoint = {x: x + counter, y: y - counter};
            break;
        }
        if(grid.get(x - counter, y + counter) === 0 && grid.get(x + counter, y + counter) !== undefined){
            validPoint = {x: x - counter, y: y + counter};
            break;
        }
        counter += 1;
    }

    return validPoint;
}


export function setupNdGrid(map, surfaceObjects){
    //console.log("generating new grid");
    let grid = [];
    let size = (map.length * 100) * (map.length * 100);
    //fill with 0s
    for(let i = 0; i < size; i++){
        grid[i] = 0;
    }

    //Create a maze as an ndarray
    grid = ndarray(grid, [map.length * 100, map.length * 100]);

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

    for(let q = 0; q < map.length; q++){
        for(let w = 0; w < map.length; w++){
            if(map[q][w].type === 'water'){
                //they are flipped x and y coords for some reason
                let x = w * 100;
                let y = q * 100;
                for(let u = 0; u < 100; u++){
                    for(let t = 0; t < 100; t++){
                        grid.set(x+u, y+t, 1);
                    }
                }
            }
        }
    }

    return grid;
}
