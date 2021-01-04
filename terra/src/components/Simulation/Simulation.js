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
