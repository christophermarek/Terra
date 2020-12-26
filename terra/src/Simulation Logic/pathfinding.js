import { getNeighbors, setupGrid } from './grid';    
import { returnSurfaceObject } from '../data/map/surfaceObjects';

//need these for pathfinding
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }
        for (; from < len; ++from) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }
    return -1;
    };
}
    
if (!Array.prototype.remove) {
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };
}

export function calcHeuristic(pos0, pos1){
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    //this is just manhattan distance
    let d1 = Math.abs (pos1.x - pos0.x);
    let d2 = Math.abs (pos1.y - pos0.y);
    return d1 + d2;
}

function isWallMyself(x, y, radius, neighbor){

    //console.log("checking if wall is myself");
    //console.log("self x/y: " + x + "," + y)
    let leftX = x - radius;
    let lowY = y - radius
    let rightX = x + radius;
    let highY = y + radius;
    /*
    console.log("bounds of self at x: " + leftX + " to " + rightX);
    console.log("bounds of self at y: " + lowY + " to " + highY);


    console.log(neighbor.x + "," + neighbor.y);
    console.log(neighbor.x);
    console.log(leftX);
    console.log(neighbor.x >= leftX);
    console.log((rightX >= neighbor.x));
    console.log((neighbor.y >= lowY));
    console.log((highY >= neighbor.y));
    */
    //check if exists in own bounds
    if (((neighbor.x >= leftX) && (rightX >= neighbor.x)) && ((neighbor.y >= lowY) && (highY >= neighbor.y))){
        //console.log("exists in bounds");
        return true;
    }else{
        //console.log("not in bounds")
        return false;
    }
}

export function search(grid, start, end, self, target){
    //console.log(target);
    //extra data fetching
    let selfData = returnSurfaceObject(self.type);
    let selfRadius = selfData.size;
    //want to get bottom left and top right of the self obj
    //so we can see if the xy we are iterating on is ourself
    //console.log("starting search");
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

            if(neighbor.closed) {
                continue;
            }

            if(neighbor.isWall){
                //get target surface object type to find radius
                //check if we are going to a point or to a surfaceObject
                let targetSize = returnSurfaceObject(target.type).size;
                //check if current neighbour is the target or myself so we ignore the walls for pathfinding
                if(!(isWallMyself(self.x, self.y, selfRadius, neighbor) || isWallMyself(target.x, target.y, targetSize, neighbor))){
                    //console.log('b4 continue');
                    //console.log(neighbor);
                    continue;
                }

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
    //console.log("Unable to find path for :" + start.x + "," + start.y + " to dest " + end.x + "," + end.y);
    return [];

        
}

export function startSearch(self, target, map, surfaceObjects){
    let grid = setupGrid(map, surfaceObjects);
    let start = grid[self.x][self.y];
    let end = grid[target.x][target.y];
    let result = search(grid, start, end, self, target);
    return result;
}