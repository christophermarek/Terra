
export class Pathfinding{

    constructor(){

    }

    //Cells that go inside the grid
    Cell(x, y){
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

    //grid for pathfinding
    setupGrid(){
    
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

    getNeighbors(grid, node){
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

    calcHeuristic(pos0, pos1){
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
        let d1 = Math.abs (pos1.x - pos0.x);
        let d2 = Math.abs (pos1.y - pos0.y);
        return d1 + d2;
    }

    search(grid, start, end){        
        let openList = [];
        openList.push(start);
    
        while(openList.length > 0){
            // Grab the lowest f(x) to process next
            let lowInd = 0;
            for(let i = 0; i < openList.length; i++) {
                if(openList[i].f < openList[lowInd].f) { 
                    lowInd = i; 
                }
            }
                
            let currentNode = openList[lowInd];
    
            // End case -- result has been found, return the traced path
            if(currentNode.x == end.x && currentNode.y == end.y) {
                let curr = currentNode;
                let ret = [];
                while(curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }
                
            // Normal case -- move currentNode from open to closed, process each of its neighbors
            openList.remove(lowInd);
            currentNode.closed = true;
    
            let neighbors = getNeighbors(grid, currentNode);

            for(let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
    
                if(neighbor.closed || neighbor.isWall) {
                    // not a valid node to process, skip to next neighbor
                    continue;
                }
    
                // g score is the shortest distance from start to current node, we need to check if
                //   the path we have arrived at this neighbor is the shortest one we have seen yet
                let gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
                let gScoreIsBest = false;
    
                if(!neighbor.visited) {
                    // This the the first time we have arrived at this node, it must be the best
                    // Also, we need to take the h (heuristic) score since we haven't done so yet
                    gScoreIsBest = true;
                    neighbor.h = calcHeuristic({x: neighbor.x, y: neighbor.y}, {x: end.x, y: end.y});
                    neighbor.visited = true;
                    openList.push(neighbor);

                }else if(gScore < neighbor.g) {
                    // We have already seen the node, but last time it had a worse g (distance from start)
                    gScoreIsBest = true;
                }
    
                if(gScoreIsBest) {
                    // Found an optimal (so far) path to this node.  Store info on how we got here and
                    //  just how good it really is...
                    neighbor.parent = currentNode;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.debug = "F: " + neighbor.f + "<br />G: " + neighbor.g + "<br />H: " + neighbor.h;
                }
            }
        }
    
        // No result was found -- empty array signifies failure to find path
        return [];
    
            
    }

    startSearch(startX, startY, endX, endY){
        let grid = setupGrid();
        let start = grid[startX][startY];
        let end = grid[endX][endY];
        let result = search(grid, start, end);
        return result;
    }
    
}