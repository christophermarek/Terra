import { returnSurfaceObject } from '../data/map/surfaceObjects';

let grid = [];

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
        //they do
        ret.push({x: x-1, y: y})
    }
    
    //right
    //check if valid right neighbour
    if(x + 1 < grid.length){
        ret.push({x: x+1, y: y});
    }

    //top
    if(y - 1 >= 0) {
        ret.push({x: x, y: y-1});
    }

    //bottom
    if(y + 1 < grid.length) {
        ret.push({x: x, y: y+1});
    }

    //top left
    if(y - 1 >= 0 && x - 1 >= 0){
        ret.push({x: x-1, y: y-1});
    }
    
    //top right
    if(y - 1 >= 0 && x + 1 < grid.length){
        ret.push({x: x+1, y: y-1});
    }

    //bottom left
    if(y + 1 < grid.length && x - 1 >= 0){
        ret.push({x: x-1, y: y+1});
    }

    //bottom right
    if(y + 1 < grid.length && x + 1 < grid.length){
        ret.push({x: x+1, y: y+1});
    }
    return ret;
    
}



export function getGrid(map, surfaceObjects){

    //I wonder if this will create a new grid, if we have a grid loaded from one map,
    //and then load into a different map in the same session. 
    if(grid.length == 0){
        grid = setupGrid(map, surfaceObjects);
        return grid;
    }else{
        return grid;
    }
}

//unused right now
export function updateWallsOnGrid(map, surfaceObjects, isTrue){
//go through surface objects and calculate the walls for this grid.
    //each surfaceObject has a wall around it as a bounding box
    for(let k = 0; k < surfaceObjects.length; k++){
        let fetchedData = returnSurfaceObject(surfaceObjects[k].type);
        let radius = fetchedData.size;
        //these two loops create a square around the circle which will be the bounding box for the surfaceObject

        for(let n = (surfaceObjects[k].x - radius);  n < (surfaceObjects[k].x + radius); n++){
          for(let m = (surfaceObjects[k].y - radius);  m < (surfaceObjects[k].y + radius); m++){
            //skip if out of grid bounds
                //if(surfaceObjects[k].type === "tree"){
                    if(n >= 0 && m >=0 && n < map.length * 100 && m < map.length * 100 ){
                        try{
                            grid[n][m].isWall = isTrue;
                        }catch{
                            console.log(n);
                            console.log(m);

                        }
                    }
                //}
            }
        }
    }
}

function setupGrid(map, surfaceObjects){

    //the grid will have map.length * 100 elements since there are that many co-ordinates

    let size = map.length * 100;
    console.log(size);
    let grid = [...Array(size)].map(x=>Array(size).fill(0))       
    
    for(let k = 0; k < surfaceObjects.length; k++){
        if(surfaceObjects[k].type === "tree"){
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
                        }
                    }
                }
            }
        }
    }
        
    return grid;
}