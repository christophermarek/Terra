import React from 'react';

function MapFileHandler({map, surfaceObjects, mapSaveNumber, brain}) {


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
        let brainDataString = JSON.stringify(brain);
        let saveDataString = JSON.stringify(saveData);
        
        window.localStorage.setItem(`map${mapSaveNumber}`, saveDataString);

        if(brain === undefined){
            window.localStorage.setItem(`map${mapSaveNumber}Ai`, generateAI());
        }else{
            window.localStorage.setItem(`map${mapSaveNumber}Ai`, brainDataString);
        }
        
        alert("Map saved");
        
    }


    return(
        <button className="navBtn inputButtonNoBorder Tile-Selector" onClick={mapExport}>Save Map</button>
    );
    
}

export default MapFileHandler;
