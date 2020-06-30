import React, { useState } from 'react';

function MapFileHandler({map, loadMap}) {

    const [exportedMap, setExportedMap] = useState(' ');
    const [importedMap, setImportedMap] = useState('');

    function mapExport(){
        let mapCopy = [...map];
        let parsedMap = JSON.stringify(mapCopy);
        setExportedMap(parsedMap);
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
