import React, { useState } from 'react';
import Map from '../Map/Map';
import './styles.css';
import { returnSurfaceObject } from '../../data/map/surfaceObjects';
import { GameConsole } from './GameConsole';
import { setupGrid, getNeighbors } from '../../Simulation Logic/grid';
import { getBrainObjectById, deleteBrainObjById } from '../../Simulation Logic/helpers/brain';
import { updateHunger, loseHungerOverTime } from '../../Simulation Logic/helpers/hunger';
import { updateFood, plantFoodTickUpdate } from '../../Simulation Logic/helpers/food';
import { updateHealth } from '../../Simulation Logic/helpers/health';
import { calcHeuristic, search} from '../../Simulation Logic/pathfinding';


function Simulation() {

    const [importedMap, setImportedMap] = useState('');
    const [map, setMap] = useState([]);
    const [surfaceObjects, setSurfaceObjects] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mapPreset, setMapPreset] = useState("map1");
    const [started, setStarted] = useState(false);
    const [requestAnimationFrameID, setRequestAnimationFrameID] = useState(undefined); 
    const [brain, setBrain] = useState([]);
    const [generalMessages, setGeneralMessages] = useState([]);
    const [battleMessages, setBattleMessages] = useState([]);
    const [actionMessages, setActionMessages] = useState([]);


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
    
    
    function startSearch(startX, startY, endX, endY){
        let grid = setupGrid(map, surfaceObjects);
        let start = grid[startX][startY];
        let end = grid[endX][endY];
        let result = search(grid, start, end);
        return result;
    }

    

    function removeFromArrayByIndex(arr, index){
        arr.splice(index, 1);
        return arr;
    }


    function nonBrainObjectUpdate(secondsPassed, update, i){
        
        //nested update logic
        if(update.type === 'bush'){
            plantFoodTickUpdate(secondsPassed, update);
        }

        return update;
    }

    //when refractor-ing add a brainObjectUpdate() 


    function updateSurfaceObjects(secondsPassed){

        //no surfaceObjects exist
        if(surfaceObjects.length === undefined){
            return;
        }

        let update = [...surfaceObjects];
        let brainUpdate = [...brain];

        
        for(let i = 0; i < update.length; i++){

            if(update[i].type === 'bush'){
                update[i] = nonBrainObjectUpdate(secondsPassed, update[i], i);
            }else{
                //brainN has a one to one relationship with a surfaceObject, and it is linked with the surfaceObject id
                let brainN = brainUpdate[brainUpdate.findIndex(x => x.surfaceObjectId === i)];

                update[i] = loseHungerOverTime(secondsPassed, update[i])
            
            //thinking
            //should first be a check for survival needs ie water/food/health, then check other actions to do
            //add a way to know how they died, starved to death or health went to low, I would need
            //to remember the last state and check if it was combat or hungry/starving
            if((update[i].health <= 0 || update[i].hunger <= 0) && brainN.action != "Dying"){
                brainN.action = "Dying";
                addConsoleMessage(i, "Rabbit dying", 'General');
            }else{
                if(brainN.action === "Idle"){
                    //add brain variable of path to find array
                    //here pop out the next point to travel to and set endX and endY to that point
                    //check if path exists, if not generate one to 250, 250

                    //needs to be removed and integrated into a function that needs pathfinding
                    
                    if(brainN.path === undefined){
                        addConsoleMessage(1, "Looking for path", "General");
                        brainN.path = startSearch(update[i].x, update[i].y, 250, 250);
                        let nextPoint = brainN.path.shift();
    
                        if(nextPoint === undefined){
                            console.log("no path found");
                        }else{
                            //set endX and endY to the x and y from this
                            //console.log(brainN);
                            brainN.movement.endX = nextPoint.x;
                            brainN.movement.endY = nextPoint.y;
                            brainN.movement.startX = update[i].x;
                            brainN.movement.startY = update[i].y;
                            brainN.action = "Moving";
                        }
                    }
                    

                    if(update[i].hunger <= 50){
                        brainN.action = "Hungry";
                    }

                    if(update[i].hunger <= 20){
                        brainN.action = "Starving";
                    }

                    if(update[i].hunger >= 100){
                        brainN.action = "Full";
                    }
                }
            }

            //convert this to a switch with a function for each action
            //actions
            if(brainN.action === "Dying"){
                //remove from surfaceObjects
                update = removeFromArrayByIndex(update, i);
                brainUpdate = deleteBrainObjById(brainUpdate, i); 
            }

            if(brainN.action === "Hungry" || brainN.action === "Starving"){
                //eat food
                brainN.action = "Eating";
            }

            if(brainN.action === "Eating"){
                if(update[i].hunger < 100){
                    updateHunger(update[i], 1);
                }
            }

            if(brainN.action === "Moving"){
                update[i] = updateHealth(update[i], -1);

                //init movement
                if(!brainN.isMoving){
                    brainN.movement.distanceToPoint = getDistanceToPoint(update[i].x, update[i].y, brainN.movement.endX, brainN.movement.endY);
                    let direction = getDirectionToPoint(update[i].x, update[i].y, brainN.movement.endX, brainN.movement.endY, brainN.movement.distanceToPoint);
                    brainN.movement.directionX = direction.x;
                    brainN.movement.directionY = direction.y;
                    brainN.isMoving = true;
                }else{
                    //its calculated as x += movementspeed * secondspassed
                    //where movement speed is in pixels per second
                    update[i].x = update[i].x + (brainN.movement.directionX * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed); 
                    update[i].y = update[i].y + (brainN.movement.directionY * returnSurfaceObject(update[i].type).movementSpeed * secondsPassed);
                }
               
                if(Math.hypot(update[i].x - brainN.movement.startX, update[i].y - brainN.movement.startY) >= brainN.movement.distanceToPoint){
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
        }
        
        setBrain(brain => (brainUpdate));
        setSurfaceObjects(surfaceObjects => (update));

            }
            
        
    }

    function update(secondsPassed){
        //need to update plants/then update ai
        //need to filter array by sub-type alive boolean
        //to get an array of plants and an array of ai surfaceObjects
        updateSurfaceObjects(secondsPassed, surfaceObjects)
    }

    function gameLoop(timeStamp){
        setRequestAnimationFrameID(undefined);

        //we can slow down time or speed up this time by multiplying it by a modifier
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
    

    function addConsoleMessage(surfObjId, message, type){

        /*
        consoleMessage Schema
        {time, surfObjId, message}
        */

        
        let date = new Date(); 
        let timeString = date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds();

        let consoleString =  {
            timeStamp: timeString,
            surfaceObjectId: surfObjId,
            message: message
        };
        
        switch(type){
            case 'General':
                setGeneralMessages(generalMessages => [...generalMessages, consoleString]);
                break;
            case 'Battle':
                setBattleMessages(battleMessages => [...battleMessages, consoleString]);
                break;
            case 'Action':
                setActionMessages(actionMessages => [...actionMessages, consoleString]);
                break;
            default:
                setGeneralMessages(generalMessages => [...generalMessages, consoleString]);
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

                    <GameConsole generalMessages={generalMessages}
                                 battleMessages={battleMessages}
                                 actionMessages={actionMessages}
                    />
                    
                </>
            )}

            
        </div>
    );

}

export default Simulation;
