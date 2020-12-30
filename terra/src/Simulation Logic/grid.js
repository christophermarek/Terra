import { returnSurfaceObject } from '../data/map/surfaceObjects';

let grid = [];

export function getNeighbors(grid, node){
    let ret = [];
    let x = node.x;
    let y = node.y;

    //left
    if(grid[x-1] && grid[x-1][y]) {
        ret.push({x: x-1, y: y});
    }

    //right
    if(grid[x+1] && grid[x+1][y]) {
        ret.push({x: x+1, y: y});
    }

    //top
    if(grid[x][y-1] && grid[x][y-1]) {
        ret.push({x: x, y: y-1});
    }

    //bottom
    if(grid[x][y+1] && grid[x][y+1]) {
        ret.push({x: x, y: y+1});
    }

    //top left
    if(grid[x-1] && grid[x-1][y-1]){
        ret.push({x: x-1, y: y-1});
    }
    
    //top right
    if(grid[x+1] && grid[x+1][y-1]){
        ret.push({x: x+1, y: y-1});
    }

    //bottom left
    if(grid[x-1] && grid[x-1][y+1]){
        ret.push({x: x-1, y: y+1});
    }

    //bottom right
    if(grid[x+1] && grid[x+1][y+1]){
        ret.push({x: x+1, y: y+1});
    }
    //console.table(ret);
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
    let grid = [...Array(size)].map(x=>Array(size).fill(0))       

   /*
    for(let i = 0; i < size; i++){
        let columns = [];
        for(let j = 0; j < size; j++){
            grid[i][j] = 0;
        }
        grid.push(columns);
    }
    */
    

    return grid;
}