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
            setupGrid();
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

    function updateSurfaceObjects(secondsPassed){
        let update = [...surfaceObjects];

        //its calculated as x += movementspeed * secondspassed
        //where movement speed is in pixels per second

        for(let i = 0; i < update.length; i++){
            let brainN = getBrainObjectById(i);


            //thinking
            if(brainN.action === "Idle"){
                brainN.movement.endX = 250;
                brainN.movement.endY = 250;
                brainN.movement.startX = update[i].x;
                brainN.movement.startY = update[i].y;
                brainN.action = "Moving";
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
                    brainN.isMoving = false;
                    brainN.action = 'Done moving';
                    update[i].x = brainN.movement.endX;
                    update[i].y = brainN.movement.endY;
                }
                
            }

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

    //Cells that go inside the grid
    function Cell(x, y){
        this.x = x;
        this.y = y;
    }

    //grid for pathfinding
    function setupGrid(){
        //console.log(map.length);

        //map.length
        //the grid will have map.length * 100 elements since there that many co-ordinates in the 
        //world and each map index is a tile with 100px of coordinates.

        let size = map.length * 100;
        let grid = [];

       
        for(let i = 0; i < size; i++){
            let columns = [];
            for(let j = 0; j < size; j++){
                columns.push(new Cell(i, j));
            }
            grid.push(columns);
        }

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
