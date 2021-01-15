import React, { useState } from 'react';
import Map from '../Map/Map';
import './styles.css';
import { GameConsole } from './GameConsole';

import { updateSurfaceObjects } from '../../Simulation Logic/update'; 

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
    const [selectedMapSaveNumber, setSelectedMapSaveNumber] = useState(0);


    let secondsPassed = 0;
    let oldTimeStamp = 0;


    function mapLoaded(){
        setIsLoaded(true);
    }

    function loadMapClicked(mapSaveNumber){
        setSelectedMapSaveNumber(mapSaveNumber);

        let mapData = window.localStorage.getItem(`map${mapSaveNumber}`);
        let data = JSON.parse(mapData);
        setMap(map => (data.mapData));
        setSurfaceObjects(surfaceObjects => (data.surfaceData));

        let aiData = JSON.parse(window.localStorage.getItem(`map${mapSaveNumber}Ai`));
        setBrain(aiData);
        mapLoaded();
    }

    function deleteMapClicked(mapSaveNumber){
        if(window.confirm(`Are you sure you want to delete save #${mapSaveNumber}`)) {
            localStorage.removeItem(`map${mapSaveNumber}`);
            localStorage.removeItem(`map${mapSaveNumber}Ai`);
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

    function update(secondsPassed){

        let update = updateSurfaceObjects(secondsPassed, map, surfaceObjects, brain, map)
        setBrain(brain => (update.brain));
        setSurfaceObjects(surfaceObjects => (update.surfaceObjects));

    }

    function gameLoop(timeStamp){
        setRequestAnimationFrameID(undefined);

        //we can slow down time or speed up this time by multiplying it by a modifier
        let seconds = (timeStamp - oldTimeStamp) / 1000;

        //global vars defined at top, not state vars
        secondsPassed = seconds;

        //console.log("seconds passed for loop ", secondsPassed);

        //limit time skip on pause/start
        secondsPassed = Math.min(secondsPassed, 0.1);
        oldTimeStamp = timeStamp;

        //
        
        update(secondsPassed);
        //console.log("new timestamp ", timeStamp);
        
        //

        startLoop();

    }
    
    function loadLocalSaves(){

        //this is the amount of saves we are supporting right now
        const numbers = [1, 2, 3, 4, 5];

        return numbers.map((number) => 
            <div className="saveBar">
                
                <p class="mapSaveFileText">Map {number}</p>

                {localStorage.hasOwnProperty(`map${number}`) ? (
                    <div className="saveControls">
                        <input type="button" class="navBtn inputButtonNoBorder" value="Load" onClick={() => loadMapClicked(number)}></input>
                        <input type="button" class="navBtn inputButtonNoBorder" value="Delete" onClick={() => deleteMapClicked(number)}></input>
                    </div>
                ) 
                :
                (
                    <p class="mapFileSupportingText">does not exist.</p>
                )}

            </div>

                
            
        );
    }

    function backClicked(){
        setIsLoaded(false);
    }

    return(
        <div className="Simulation">
            {!isLoaded ? (
                <div className="loading">

                    <div className="loadPreset">
                        <p className={"mapSaveFileText centeredText"}>Simulation</p>
                        {loadLocalSaves()}
                    </div>
                    
                </div>
            ) : (
                <>
                    <Map map={map}
                         surfaceObjects={surfaceObjects}
                         startClicked={startClicked}
                         started={started}
                         isEditor={false}
                         brain={brain}
                         backClicked={backClicked}
                         selectedMapSaveNumber={selectedMapSaveNumber}
                    />
                    
                </>
            )}

            
        </div>
    );

}

export default Simulation;
