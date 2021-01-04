import { getNeighbors, getGrid, updateWallsOnGrid, getBounds, getPlanner } from './grid';    
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

       //# check if goal reached
       //if problem.isGoalState(node[0]):
           //return node[1]
        if(node.element[0].x === end.x && node.element[0].y === end.y){
            return node.element[1];
        }

       //# get next nodes to search
       //successors = problem.getSuccessors(node[0])
       let neighbors = getNeighbors(grid, node.element[0]);
       //console.log(neighbors);
       for(let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            //wall is if grid[x][y] = 1;
            if (!visited.includes(neighbor) || (neighbor.x === end.x && neighbor.y === end.y)){
                    //# push into the stack the successors position
                    //# and concatenate its direction with the current path
                    //# increase the total path cost with successor cost and make the priority queues value the path cost
                    //# + the heuristic so it prioritizes shorter cost and distance paths
                visited.push(neighbor);
                //if(grid[neighbor.x][neighbor.y] !== 1){
                    queue.enqueue([neighbor, node.element[1].concat(neighbor), node.element[2] + 1], node.element[2] + 1 + calcHeuristic(neighbor, end));
                //}
                
                    //console.log('pushing to queue');
                    //# append all successors onto the visited stack since they
                    //# are going to be iterated over now that we pushed them onto the queue
            }
            
            
       }
    }
    //console.log(queue.pop())
    //util.raiseNotDefined()
    return result;
}

export function startSearch(self, target, map, surfaceObjects){
    
    
    /*
    let grid = getGrid(map, surfaceObjects);

    //updateWallsOnGrid(map, surfaceObjects, true);

    let start = {x: self.x, y: self.y};
    let end = {x: target.x, y: target.y};
    let result = search(grid, start, end, self, target);

    //updateWallsOnGrid(map, surfaceObjects, false);
    */

    
    //import the planner and call it to create a path
    //should be very simple

    //Find path
    let path = [];
    let planner = getPlanner(map, surfaceObjects);
    let fixedPath = [];

    //this sets path to a 1d array of x,y cordinates where the x value is an element and the y value follows it
    // [30, 20, 1, 5]
    // { x: 30, y: 20 } { x: 1, y: 5 }

    let dist = planner.search(self.x,self.y,  target.x,target.y, path);

    //console.log(path);

    //convert path to a array of object x,y cordinates
    for(let i = 0; i < path.length; i+= 2){
        let parsedX = path[i];
        let parsedY = path[i+1]; 
        //console.log({x: parsedX, y: parsedY});
        fixedPath.push({x: parsedX, y: parsedY});
    }



    //Log output
    //console.log('path length=', dist)
    

    

    return fixedPath;
    
    
}