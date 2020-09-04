import React, { useState } from 'react';
import Map from '../Map/Map';
import './styles.css';
import {returnSurfaceObject} from '../../data/map/surfaceObjects'

function Simulation() {

    const [importedMap, setImportedMap] = useState('');
    const [map, setMap] = useState([]);
    const [surfaceObjects, setSurfaceObjects] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mapPreset, setMapPreset] = useState("map1");
    const [started, setStarted] = useState(false);
    const [requestAnimationFrameID, setRequestAnimationFrameID] = useState(undefined); 
    const [brain, setBrain] = useState([]);

    let secondsPassed = 0;
    let oldTimeStamp = 0;


    function mapLoaded(){
        setIsLoaded(true);
    }

    function loadMap(importedData){
        let data = JSON.parse(importedData);
        setMap(map => (data.mapData));
        setSurfaceObjects(surfaceObjects => (data.surfaceData));

        //loadAi
        let aiData = JSON.parse(window.localStorage.getItem('map1Ai'));
        setBrain(aiData);
        mapLoaded();

    }

    function importMapTextHandler(event){
        setImportedMap(event.target.value);
    }

    function dropdownChange(event){
        setMapPreset(event.target.value);
        
    }
    
    function loadFromPreset(event){
        event.preventDefault();
        
        switch(mapPreset){
            case "map1":
                loadMap(window.localStorage.getItem('map1'));
            default:
                loadMap(window.localStorage.getItem('map1'));
        }  
    }

    function startClicked(){

        setStarted(!started);

        if(started){
            stopLoop();
        }
        if(!started){
            startLoop();
        }
        
       
    }

    function startLoop(){
        if(!requestAnimationFrameID){
            setRequestAnimationFrameID(window.requestAnimationFrame(gameLoop));
        }
    }

    function stopLoop(){
        if (requestAnimationFrameID) {
            window.cancelAnimationFrame(requestAnimationFrameID);
            setRequestAnimationFrameID(undefined);
         }
    }

    function getDistanceToPoint(x, y, destX, destY){
        //console.log(" x: " + x + " y: " + y + " destX: " + destX + " destY: " + destY);
        let distance = Math.hypot(destX - x, destY - y);
        return distance;
    }

    function getDirectionToPoint(x, y, destX, destY, distance){

        let xDir = (destX - x) / distance
        let yDir = (destY - y) / distance
        
        return {x: xDir, y: yDir};
    }

    function getBrainObjectById(id){
        let brainCopy = [...brain];
        let brainObjCopy = false;

        for(let i = 0; i < brainCopy.length; i++){
            if(brainCopy[i].surfaceObjectId === id){
                brainObjCopy = brainCopy[i];
            }    
        }

        return brainObjCopy;
    }

    function updateBrainObjById(id, brainObj){
        let brainCopy = [...brain];
        let updated = false;

        for(let i = 0; i < brainCopy.length; i++){
            if(brainCopy[i].surfaceObjectId === id){
                brainCopy[i] = brainObj;
                updated = true;
            }    
        }

        setBrain(brain => (brainCopy));
        
        if(!updated){
            console.log("error updating brain object by id");
        }
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
    
    
        //grid for pathfinding
        function setupGrid(){
    
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
    
            return grid;
        }
    
        function getNeighbors(grid, node){
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
    
        function calcHeuristic(pos0, pos1){
            // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
            let d1 = Math.abs (pos1.x - pos0.x);
            let d2 = Math.abs (pos1.y - pos0.y);
            return d1 + d2;
        }
    
        function search(grid, start, end){        
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
                    }
                    else if(gScore < neighbor.g) {
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
    
        function startSearch(startX, startY, endX, endY){
            let grid = setupGrid();
            let start = grid[startX][startY];
            let end = grid[endX][endY];
            let result = search(grid, start, end);
            return result;
        }

    function updateSurfaceObjects(secondsPassed){
        let update = [...surfaceObjects];

        //its calculated as x += movementspeed * secondspassed
        //where movement speed is in pixels per second

        for(let i = 0; i < update.length; i++){
            let brainN = getBrainObjectById(i);

            console.log("x: " +  brainN.movement.endX + " y: " + brainN.movement.endY);
            //thinking
            if(brainN.action === "Idle"){
                //add brain variable of path to find array
                //here pop out the next point to travel to and set endX and endY to that point

                //check if path exists, if not generate one to 250, 250
                if(brainN.path === undefined){
                    brainN.path = startSearch(update[i].x, update[i].y, 250, 250);
                    let nextPoint = brainN.path.shift();
                    //capture this value we just shifted out and are printing to the console.log
                    //set endX and endY to the x and y from this
                    brainN.movement.endX = nextPoint.x;
                    brainN.movement.endY = nextPoint.y;
                    brainN.movement.startX = update[i].x;
                    brainN.movement.startY = update[i].y;
                    brainN.action = "Moving";
                }

                
            }

            //actions
            if(brainN.action === "Moving"){
                
                //init movement
                if(!brainN.isMoving){
                    brainN.movement.distanceToPoint = getDistanceToPoint(update[i].x, update[i].y, brainN.movement.endX, brainN.movement.endY);
                    let direction = getDirectionToPoint(update[i].x, update[i].y, brainN.movement.endX, brainN.movement.endY, brainN.movement.distanceToPoint);
                    brainN.movement.directionX = direction.x;
                    brainN.movement.directionY = direction.y;
                    brainN.isMoving = true;
                }else{
                    update[i].x = update[i].x + (brainN.movement.directionX * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed); 
                    update[i].y = update[i].y + (brainN.movement.directionY * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed);
                }
               
                if(Math.hypot(update[i].x - brainN.movement.startX, update[i].y - brainN.movement.startY) >= brainN.movement.distanceToPoint){
                    
                    //why is it moving past the point, the correct path is being popped in the console but the actual svg will not update its co ordinates properly
                    //maybe we need to skip some points like pop until we are where we are at 

                    //else get next point.
                    //when point reached
                    //if last point then set to done moving
                    if(brainN.path.length == 0){
                        brainN.isMoving = false;
                        brainN.action = 'Done moving';
                        update[i].x = brainN.movement.endX;
                        update[i].y = brainN.movement.endY;
                    }else{
                        let nextPoint = brainN.path.shift();
                        update[i].x = brainN.movement.endX;
                        update[i].y = brainN.movement.endY;
                        brainN.movement.endX = nextPoint.x;
                        brainN.movement.endY = nextPoint.y;
                        
                    }
                    
                }
                
            }
            console.log(brainN.path);
            //update brain object when done with it
            updateBrainObjById(brainN.surfaceObjectId, brainN);
            
        }
        
        setSurfaceObjects(surfaceObjects => (update));

        
    }

    function update(secondsPassed){
        updateSurfaceObjects(secondsPassed)
    }

    function gameLoop(timeStamp){
        setRequestAnimationFrameID(undefined);
        let seconds = (timeStamp - oldTimeStamp) / 1000;
        //global vars defined at top, not state vars
        secondsPassed = seconds;
        //limit time skip on pause/start
        secondsPassed = Math.min(secondsPassed, 0.1);
        oldTimeStamp = timeStamp;

        //
        
        update(secondsPassed);
        
        //
        startLoop();
    }




    return(
        <div className="Simulation">
            {!isLoaded ? (
                <div className="loading">

                    <div className="loadMap">
                        <textarea placeholder="Paste imported map here" onChange={importMapTextHandler}>{importedMap}</textarea>
                        <button className="button" onClick={() => loadMap(importedMap)}>Import Map</button>
                    </div>
                    

                    <div className="loadPreset">
                            
                            <select value={mapPreset} onChange={dropdownChange}>
                                <option value="map1">map1</option>
                            </select>
                            <button className="button" onClick={loadFromPreset}>Submit</button>
                    </div>
                    
                </div>
            ) : (
                <>
                    <Map map={map}
                         surfaceObjects={surfaceObjects}
                         startClicked={startClicked}
                         started={started}
                    />
                </>
            )}

            
        </div>
    );

}

export default Simulation;
