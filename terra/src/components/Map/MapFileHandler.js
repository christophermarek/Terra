import React, { useState } from 'react';

function MapFileHandler({map, loadMap, surfaceTiles}) {

    const [exportedMap, setExportedMap] = useState(' ');
    const [importedMap, setImportedMap] = useState('');

    function mapExport(){
        let mapCopy = [...map];
        let surfaceTilesCopy = [...surfaceTiles];
        let saveData = {mapData: mapCopy, surfaceData: surfaceTilesCopy};
        let saveDataString = JSON.stringify(saveData);
        setExportedMap(saveDataString);
    }

    function importMapTextHandler(event){
        setImportedMap(event.target.value);
    }


    return(
        <div className="Map-File-Handler">
            <textarea placeholder="Paste imported map here" onChange={importMapTextHandler}>{importedMap}</textarea>
            <button onClick={() => loadMap(importedMap)}>Import Map</button>
            <button onClick={mapExport}>Export Map</button>
            <textarea placeholder="Map exported here" value={exportedMap}></textarea>
        </div>
    );
    
}

export default MapFileHandler;
