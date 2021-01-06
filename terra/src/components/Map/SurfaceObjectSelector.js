import React from 'react';

function SurfaceObjectSelector({updateSelectedSurfaceObjectType, selectedTile}) {

    return(
        <div className="Tile-Selector">
            <button className={"navBtn inputButtonNoBorder"  + (selectedTile === 'tree' ? ' selectedButton' : ' ')} onClick={() => updateSelectedSurfaceObjectType('tree')}>Tree</button>
            <button className={"navBtn inputButtonNoBorder"  + (selectedTile === 'bush' ? ' selectedButton' : ' ')} onClick={() => updateSelectedSurfaceObjectType('bush')}>Bush</button>
            <button className={"navBtn inputButtonNoBorder"  + (selectedTile === 'rabbit' ? ' selectedButton' : ' ')} onClick={() => updateSelectedSurfaceObjectType('rabbit')}>Rabbit</button>
        </div>
    );

}

export default SurfaceObjectSelector;
