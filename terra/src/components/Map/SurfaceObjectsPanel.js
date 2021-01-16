import React from 'react';

function SurfaceObjectsPanel({surfaceObjects, setSelectedSurfaceObjectId, selectedSurfaceObjectId, brain, surfaceObjectsDisplayToggle}) {

    function panelClicked(id){
        if(selectedSurfaceObjectId === id){
            //deselect
            setSelectedSurfaceObjectId(-1);
        }else{
            setSelectedSurfaceObjectId(id);
        }
    }

    let surfaceObjCopy = [...surfaceObjects];

    let brainCopy;

    if(brain !== undefined){
        brainCopy = [...brain];
    }


    let brainSurfaceObjects = [];
    for(let i = 0; i < surfaceObjCopy.length; i++){
        if(surfaceObjectsDisplayToggle){
            if(surfaceObjCopy[i].type === 'rabbit'){
                if(brain !== undefined){
                    let brainN = brainCopy[brain.findIndex(x => x.surfaceObjectId === i)];
                    brainSurfaceObjects.push([surfaceObjCopy[i], brainN]);
                }else{
                    brainSurfaceObjects.push([surfaceObjCopy[i], 0]);
                }
            }
        }else{
            if(surfaceObjCopy[i].type === 'tree' || surfaceObjCopy[i].type === 'bush'){
                if(brain !== undefined){
                    let brainN = brainCopy[brain.findIndex(x => x.surfaceObjectId === i)];
                    brainSurfaceObjects.push([surfaceObjCopy[i], brainN]);
                }else{
                    brainSurfaceObjects.push([surfaceObjCopy[i], 0]);
                }
            }
        }
            
        
    }

    return(
        <div className="SurfaceObjectsPanels">



            {brainSurfaceObjects.map((object, i) => {
                    
                    return(
                        <div key={object[0].id} onClick={() => panelClicked(object[0].id)}>
                            <ul className={"panelList Tile-Selector" + (selectedSurfaceObjectId === object[0].id ? ' selectedButton' : ' ')}>
                                <li className="listItem">id: {object[0].id}</li>
                                <li className="listItem">type: {object[0].type}</li>
                                <li className="listItem">x: {Number(object[0].x).toFixed(2)}    y: {Number(object[0].y).toFixed(2)}</li>
                                {object[0].health != undefined &&
                                    <li className="listItem">health: {Number(object[0].health).toFixed(2)}</li>
                                }
                                {object[0].hunger != undefined &&
                                    <li className="listItem">hunger: {Number(object[0].hunger).toFixed(2)}</li>
                                }                                    
                                {brain !== undefined && object[1] !== undefined && object[0].type === 'rabbit' &&
                                    <li className="listItem">action: {object[1].action}</li>
                                }
                            </ul>
                        </div>
                    )
                    
            })}
        </div>
    );
    
}

export default SurfaceObjectsPanel;
