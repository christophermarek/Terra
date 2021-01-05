import React, { useState } from 'react';

function SurfaceObjectsPanel({surfaceObjects, setSelectedSurfaceObjectId, selectedSurfaceObjectId}) {

    function panelClicked(id){
        if(selectedSurfaceObjectId === id){
            //deselect
            setSelectedSurfaceObjectId(-1);
        }else{
            setSelectedSurfaceObjectId(id);
        }
    }
    /*
    function renderSurfaceObjectRow(surfaceObject){
        console.log(surfaceObject)

        return(
            <p>1</p>
        );
    }

    function renderBrainSurfaceObjects(){
        //console.log(surfaceObjects);
        for(let i = 0; i < surfaceObjects.length; i++){
            //console.log(i);
            if(surfaceObjects[i].type === 'rabbit'){
                //console.log("obj:, ", surfaceObjects[i], " id: ", surfaceObjects[i].id);
                renderSurfaceObjectRow(surfaceObjects[i]);
            }
        }
        

    }
    */
    let surfaceObjCopy = [...surfaceObjects];

    let brainSurfaceObjects = [];
    for(let i = 0; i < surfaceObjCopy.length; i++){
        if(surfaceObjCopy[i].type === 'rabbit'){
            brainSurfaceObjects.push(surfaceObjCopy[i]);
        }
    }

    return(
        <div className="SurfaceObjectsPanels">
            {brainSurfaceObjects.map((object, i) => {
                    
                    return(
                        <div key={object.id} onClick={() => panelClicked(object.id)}>
                            <ul className="panelList Tile-Selector">
                                <li className="listItem">id: {object.id}</li>
                                <li className="listItem">type: {object.type}</li>
                                <li className="listItem">x: {Number(object.x).toFixed(2)}    y: {Number(object.y).toFixed(2)}</li>
                                <li className="listItem">health: {Number(object.health).toFixed(2)}</li>
                                <li className="listItem">hunger: {Number(object.hunger).toFixed(2)}</li>
                            </ul>
                        </div>
                    )
                    
            })}
        </div>
    );
    
}

export default SurfaceObjectsPanel;
