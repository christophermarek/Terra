import { getNeighbors, getGrid, updateWallsOnGrid } from './grid';    
import { returnSurfaceObject } from '../data/map/surfaceObjects';
import { MinPriorityQueue, MaxPriorityQueue } from '@datastructures-js/priority-queue';


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

    //# keep track of where we already checked
    //visited = []
    let visited = [];

    //# create priority queue
    //queue = util.PriorityQueue()
    const queue = new MinPriorityQueue();
    

    //# initial state has 0 cost and 0 priority
    //queue.push((problem.getStartState(), [], 0), 0)
    //initial queue state is an array
    //[0][0] is start x,y [0][1] is path [0][2] is cost 
    queue.enqueue([start, [], 0], 0);
    //# insert initialNode into visited now since we only
    //# insert into visited when we iterate over successors
    //visited.append(problem.getStartState())
    visited.push(start);

    //while not queue.isEmpty():
    while(!queue.isEmpty()){
       //# remove lowest priority node
       //node = queue.pop()
       let node = queue.dequeue();
       console.log(node);

       //# check if goal reached
       //if problem.isGoalState(node[0]):
           //return node[1]

       //# get next nodes to search
       //successors = problem.getSuccessors(node[0])
       //for successor, sucAction, sucCost in successors:
           //# insert into queue if we havent visited it yet
           //# or if the successor is a goal state.
           //# we need the goalState check here or the algorithm sometimes skips
           //# the goal state since it is possible it has been reached by a different path already
           //# and would exist in visited
           //if successor not in visited or problem.isGoalState(successor):
               //# push into the stack the successors position
               //# and concatenate its direction with the current path
               //# increase the total path cost with successor cost and make the priority queues value the path cost
               //# + the heuristic so it prioritizes shorter cost and distance paths
               //visited.append(successor)
               //queue.push((successor, node[1] + [sucAction], node[2] + sucCost), node[2] + sucCost + heuristic(successor, problem))
               //# append all successors onto the visited stack since they
               //# are going to be iterated over now that we pushed them onto the queue
    }
    //console.log(queue.pop())
    //util.raiseNotDefined()
    console.log("------------------")
    return result;
}

export function startSearch(self, target, map, surfaceObjects){
    
    
    let grid = getGrid(map, surfaceObjects);

    //updateWallsOnGrid(map, surfaceObjects, true);

    let start = {x: self.x, y: self.y};
    //console.log("started search at ", start);
    let end = {x: target.x, y: target.y};
    //console.log("end search at ", end);
    let result = search(grid, start, end, self, target);
    //console.log(result);

    //updateWallsOnGrid(map, surfaceObjects, false);

    return result;
    
    
}