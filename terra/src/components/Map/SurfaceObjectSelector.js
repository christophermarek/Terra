import React from 'react';

function SurfaceObjectSelector({updateSelectedSurfaceObjectType}) {

    return(
        <div className="Tile-Selector">
            <button class="navBtn inputButtonNoBorder" onClick={() => updateSelectedSurfaceObjectType('tree')}>Tree</button>
            <button class="navBtn inputButtonNoBorder" onClick={() => updateSelectedSurfaceObjectType('bush')}>Bush</button>
            <button class="navBtn inputButtonNoBorder" onClick={() => updateSelectedSurfaceObjectType('rabbit')}>Rabbit</button>
        </div>
    );

}

export default SurfaceObjectSelector;
