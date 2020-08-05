import React, { useState } from 'react';
import Map from '../Map/Map';
import './styles.css';
import { map1 } from '../../data/map/map1';

function Simulation() {

    const [importedMap, setImportedMap] = useState('');
    const [map, setMap] = useState([]);
    const [surfaceObjects, setSurfaceObjects] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mapPreset, setMapPreset] = useState("map1");
    const [started, setStarted] = useState(false);
    const [requestAnimationFrameID, setRequestAnimationFrameID] = useState(undefined); 

    let secondsPassed = 0;
    let oldTimeStamp = 0;


    function mapLoaded(){
        setIsLoaded(true);
    }

    function loadMap(importedData){
        let data = JSON.parse(importedData);
        setMap(map => (data.mapData));
        setSurfaceObjects(surfaceObjects => (data.surfaceData));
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
                loadMap(JSON.stringify(map1));
            default:
                loadMap(JSON.stringify(map1));
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

    function update(secondsPassed){
        let update = [...surfaceObjects];
        //its calculated as x += movementspeed * secondspassed
        //where movement speed is in pixels per second
        update[0].x = update[0].x + (30 * secondsPassed); 
        update[0].y = update[0].y + (30 * secondsPassed); 
        //update[0].x = Number(update[0].x.toFixed(2));
        setSurfaceObjects(surfaceObjects => (update));
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
