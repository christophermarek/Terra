import { returnSurfaceObject } from '../data/map/surfaceObjects';

export function getNeighbors(grid, node){
    let ret = [];
    let x = node.x;
    let y = node.y;

    if(grid[x-1] && grid[x-1][y]) {
        ret.push(grid[x-1][y]);
    }

    if(grid[x+1] && grid[x+1][y]) {
        ret.push(grid[x+1][y]);
    }

    if(grid[x][y-1] && grid[x][y-1]) {
        ret.push(grid[x][y-1]);
    }

    if(grid[x][y+1] && grid[x][y+1]) {
        ret.push(grid[x][y+1]);
    }

    return ret;
    
}

//Cells that go inside the grid
function Cell(x, y){
    this.x = x;
    this.y = y;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.visited = false;
    this.parent = null;
    this.visited = false;
    this.closed = false;
    this.isWall = false;
}

export function setupGrid(map, surfaceObjects){

    //the grid will have map.length * 100 elements since there are that many co-ordinates

    let size = map.length * 100;
    let grid = [];

   
    for(let i = 0; i < size; i++){
        let columns = [];
        for(let j = 0; j < size; j++){
            columns.push(new Cell(i, j));
        }
        grid.push(columns);
    }

    //go through surface objects and calculate the walls for this grid.
    for(let k = 0; k < surfaceObjects.length; k++){
        let fetchedData = returnSurfaceObject(surfaceObjects[k].type);
        let radius = fetchedData.size;
        //these two loops create a square around the circle which will be the bounding box for the surfaceObject

        for(let n = (surfaceObjects[k].x - radius);  n < (surfaceObjects[k].x + radius); n++){
          for(let m = (surfaceObjects[k].y - radius);  m < (surfaceObjects[k].y + radius); m++){
            //skip if out of grid bounds
                if(surfaceObjects[k].type === "tree"){
                    if(n >= 0 && m >=0 && n < map.length * 100 && m < map.length * 100 ){
                        //we cannot set isWall for surfaceObjects that need to 
                        //pathfind since there is a wall all around each surface object as the bounding box 
                        grid[n][m].isWall = true;
                    }
                }
            }
        }
    }

    return grid;
}