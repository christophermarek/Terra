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

    function startSimulation(){
        setStarted(!started);
    }

    return(
        <div className="Simulation">
            {!isLoaded ? (
                <div className="loading">
                    <p>Simulation</p>
                    <textarea placeholder="Paste imported map here" onChange={importMapTextHandler}>{importedMap}</textarea>
                    <button onClick={() => loadMap(importedMap)}>Import Map</button>

                    <form onSubmit={loadFromPreset}>
                        <label>
                        Select a preset:
                        <select value={mapPreset} onChange={dropdownChange}>
                            <option value="map1">map1</option>
                        </select>
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            ) : (
                <>
                    <button onClick={startSimulation}>Play</button>
                    <Map map={map}
                         surfaceObjects={surfaceObjects}/>
                </>
            )}

            
        </div>
    );

}

export default Simulation;
