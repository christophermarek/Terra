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

            //decide what to do here.

            //thinking
            if(brainN.action === "Idle"){
                brainN.movement.endX = 300;
                brainN.movement.endY = 300;
                brainN.action = "Moving";
            }

            //actions
            if(brainN.action === "Moving"){
                
                //init movement
                if(brainN.isMoving === false){
                    brainN.movement.distanceToPoint = getDistanceToPoint(update[i].x, update[i].y, 250, 250);
                    
                    brainN.movement.startX = update[i].x;
                    brainN.movement.startY = update[i].y;
                    brainN.isMoving = true;
                }else{
                    let direction = getDirectionToPoint(update[i].x, update[i].y, 250, 250, brainN.movement.distanceToPoint);
                    brainN.movement.directionX = direction.x;
                    brainN.movement.directionY = direction.y;
                    update[i].x = update[i].x + (brainN.movement.directionX * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed); 
                    update[i].y = update[i].y + (brainN.movement.directionX * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed);
                    console.log(brainN.movement.directionX * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed);
                    console.log(brainN.movement.directionX * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed); 
                }

                //find why it cant handle multiple

                //init the ai, check if state is idle and if it is then make it move,
                //this is where we set the initial paramaters for movement

                //this doesnt work because x can be greater like what if its going left, how tf to calculate this
                if(Math.sqrt(Math.pow(update[i].x - brainN.startX, 2) + Math.pow(update[i].y - brainN.startY, 2))){
                    brainN.isMoving = false;
                    brainN.action = 'Done moving';
                }
                if(update[i].x > brainN.movement.endX || update[i].y > brainN.movement.endY){
                    //update[i].x = brainN.endX;
                    //update[i].y = brainN.endY;
                    
                }
                
            }
            //update brain object when done with it
            updateBrainObjById(brainN.surfaceObjectId, brainN);
            
        }
        
        //update[0].x = Number(update[0].x.toFixed(2));
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
