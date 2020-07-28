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

    function gameLoop(){
        setRequestAnimationFrameID(undefined);
        //
        //call in the middle
        console.log("looping...");
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
