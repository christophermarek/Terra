import React from 'react';

function SurfaceObjectSelector({updateSelectedSurfaceObjectType}) {

    return(
        <div className="Tile-Selector">
            <button onClick={() => updateSelectedSurfaceObjectType('tree')}>Tree</button>
            <button onClick={() => updateSelectedSurfaceObjectType('rabbit')}>Rabbit</button>
        </div>
    );

}

export default SurfaceObjectSelector;
