import { getNeighbors, getGrid, updateWallsOnGrid } from './grid';    
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

//Cells that go inside the grid
function Cell(x, y){
    this.x = x;
    this.y = y;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.parent = null;
    this.isWall = false;
    this.closed = false;
}

export function search(grid, start, end, self, target){
    
    let result = [];
    return result;
}

export function startSearch(self, target, map, surfaceObjects){
    
    
    let grid = getGrid(map, surfaceObjects);

    //updateWallsOnGrid(map, surfaceObjects, true);

    let start = {x: self.x, y: self.y};
    console.log("started search at ", start);
    let end = {x: target.x, y: target.y};
    console.log("end search at ", end);
    let result = search(grid, start, end, self, target);
    console.log(result);

    //updateWallsOnGrid(map, surfaceObjects, false);
    
    return result;
    
    
}