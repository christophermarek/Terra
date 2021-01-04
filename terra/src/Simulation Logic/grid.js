import { returnSurfaceObject } from '../data/map/surfaceObjects';


let ndarray = require('ndarray');
let createPlanner = require('l1-path-finder');

let grid = [];
//this is an array of points that are walls in the grid
let bounds = [];

let planner = 0;

export function getNeighbors(grid, node){
    let ret = [];
    //console.log(node);
    let x = node.x;
    let y = node.y;

    //okay neighbours are the 8 x,y pairs around.
    //to the left it is x-1

    //left
    //check if no left neighbours exist
    if(x - 1 >= 0){
        //if(grid[x-1][y] !== 1){
            ret.push({x: x-1, y: y})
        //}
        //console.log(bounds.length)
        //they do
    }
    
    //right
    //check if valid right neighbour
    if(x + 1 < grid.length){
        //if(grid[x+1][y] !== 1){
            ret.push({x: x+1, y: y});
        //}
    }

    //top
    if(y - 1 >= 0) {
        //if(grid[x][y-1] !== 1){
            ret.push({x: x, y: y-1});
        //}
    }

    //bottom
    if(y + 1 < grid.length) {
        //if(grid[x][y+1] !== 1){
            ret.push({x: x, y: y+1});
        //}
    }

    //top left
    if(y - 1 >= 0 && x - 1 >= 0){
        //if(grid[x-1][y-1] !== 1){
            ret.push({x: x-1, y: y-1});
        //}
    }
    
    //top right
    if(y - 1 >= 0 && x + 1 < grid.length){
        //if(grid[x+1][y-1] !== 1){
            ret.push({x: x+1, y: y-1});
        //}
    }

    //bottom left
    if(y + 1 < grid.length && x - 1 >= 0){
        //if(grid[x-1][y+1] !== 1){
            ret.push({x: x-1, y: y+1});
        //}
    }

    //bottom right
    if(y + 1 < grid.length && x + 1 < grid.length){
        //if(grid[x+1][y+1] !== 1){
            ret.push({x: x+1, y: y+1});
        //}
    }
    //console.log("neighbors length ", ret.length);
    return ret;

    
}



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

function setupPlanner(map, surfaceObjects){
    //Create path planner
    planner = createPlanner(getGrid(map, surfaceObjects));
    return planner;
}

export function getBounds(){
    return bounds;
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
        //skip if out of grid bounds
        if(surfaceObjects[k].type === "tree"){
            //console.log("setting walls on grid");
            for (let i = surfaceObjects[k].x - radius ; i <= surfaceObjects[k].x; i++){
                for (let j = surfaceObjects[k].y - radius ; j <= surfaceObjects[k].y; j++){
                    // we don't have to take the square root, it's slow
                    if ((i - surfaceObjects[k].x)*(i - surfaceObjects[k].x) + (j - surfaceObjects[k].y)*(j - surfaceObjects[k].y) <= radius*radius){
                        let xSym = surfaceObjects[k].x - (i - surfaceObjects[k].x);
                        let ySym = surfaceObjects[k].y - (j - surfaceObjects[k].y);
                        // (x, y), (x, ySym), (xSym , y), (xSym, ySym) are in the circle
                        grid.set(i,j, 1);
                        grid.set(i,ySym, 1);
                        grid.set(xSym, j, 1);
                        grid.set(xSym, ySym, 1);
                        bounds.push({x: i, y: j});
                        bounds.push({x: i, y: ySym});
                        bounds.push({x: xSym, y: j});
                        bounds.push({x: xSym, y: ySym});
                    }
                }
            }
        }
    }

    return grid;
}



function setupGrid(map, surfaceObjects){

    //the grid will have map.length * 100 elements since there are that many co-ordinates
    //console.log("called");
    let size = map.length * 100;
    console.log(size);
    let grid = [...Array(size)].map(x=>Array(size).fill(0));
    
    for(let k = 0; k < surfaceObjects.length; k++){
            let fetchedData = returnSurfaceObject(surfaceObjects[k].type);
            let radius = fetchedData.size;
            //skip if out of grid bounds
            if(surfaceObjects[k].type === "tree"){
                //console.log("setting walls on grid");
                for (let i = surfaceObjects[k].x - radius ; i <= surfaceObjects[k].x; i++){
                    for (let j = surfaceObjects[k].y - radius ; j <= surfaceObjects[k].y; j++){
                        // we don't have to take the square root, it's slow
                        if ((i - surfaceObjects[k].x)*(i - surfaceObjects[k].x) + (j - surfaceObjects[k].y)*(j - surfaceObjects[k].y) <= radius*radius){
                            let xSym = surfaceObjects[k].x - (i - surfaceObjects[k].x);
                            let ySym = surfaceObjects[k].y - (j - surfaceObjects[k].y);
                            // (x, y), (x, ySym), (xSym , y), (xSym, ySym) are in the circle
                            grid[i][j] = 1;
                            grid[i][ySym] = 1;
                            grid[xSym][j] = 1;
                            grid[xSym][ySym] = 1;       
                            bounds.push({x: i, y: j});
                            bounds.push({x: i, y: ySym});
                            bounds.push({x: xSym, y: j});
                            bounds.push({x: xSym, y: ySym});

                        }
                    }
                }
            }
        }
    
    
        
    return grid;
}