import React, { useState } from 'react';

function MapFileHandler({map, loadMap, surfaceObjects, mapSaveNumber}) {

    const [exportedMap, setExportedMap] = useState(' ');

    function generateAI(){
        let brain = [];
        
        let surfObjCopy = [...surfaceObjects];

        for(let i = 0; i < surfObjCopy.length; i++){

            let linkedId = surfObjCopy[i].id;

            let brainObj = {
                surfaceObjectId: linkedId,
                isMoving: false,
                action: 'Idle',
                movement: {
                    distanceToPoint: '',
                    directionX: '',
                    directionY: '',
                    startX: 0,
                    startY: 0,
                    endX: 0,
                    endY: 0,
                }
            }

            brain.push(brainObj);
        }

        return JSON.stringify(brain);

    }

    function mapExport(){
        let mapCopy = [...map];
        let surfaceObjectsCopy = [...surfaceObjects];
        let saveData = {mapData: mapCopy, surfaceData: surfaceObjectsCopy};
        let saveDataString = JSON.stringify(saveData);
        setExportedMap(saveDataString);

        window.localStorage.setItem(`map${mapSaveNumber}`, saveDataString);
        window.localStorage.setItem(`map${mapSaveNumber}Ai`, generateAI());
        
    }


    return(
        <div className="Tile-Selector">
            <button class="navBtn inputButtonNoBorder" onClick={mapExport}>Save Map</button>
        </div>
    );
    
}

export default MapFileHandler;
