import React, { useState } from 'react';
import Map from '../Map/Map';
import './styles.css';

function Simulation() {

    const [importedMap, setImportedMap] = useState('');
    const [map, setMap] = useState([]);
    const [surfaceObjects, setSurfaceObjects] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);


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
    

    return(
        <div className="Simulation">
            {!isLoaded ? (
                <div className="loading">
                    <p>Simulation</p>
                    <textarea placeholder="Paste imported map here" onChange={importMapTextHandler}>{importedMap}</textarea>
                    <button onClick={() => loadMap(importedMap)}>Import Map</button>
                </div>
            ) : (
                <>
                    <Map map={map}
                         surfaceObjects={surfaceObjects}/>
                </>
            )}

            
        </div>
    );

}

export default Simulation;
