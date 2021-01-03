import { returnSurfaceObject } from '../data/map/surfaceObjects';

let grid = [];
//this is an array of points that are walls in the grid
let bounds = [];

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
        grid = setupGrid(map, surfaceObjects);
        return grid;
    }else{
        return grid;
    }
}

export function getBounds(){
    return bounds;
}



function setupGrid(map, surfaceObjects){

    //the grid will have map.length * 100 elements since there are that many co-ordinates
    console.log("called");
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