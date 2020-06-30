import React from 'react';

function SurfaceTileSelector({updateSelectedSurfaceTileType}) {

    return(
        <div className="Tile-Selector">
            <button onClick={() => updateSelectedSurfaceTileType('tree')}>Tree</button>
            <button onClick={() => updateSelectedSurfaceTileType('bush')}>Bush</button>
            <button onClick={() => updateSelectedSurfaceTileType('air')}>Air</button>
        </div>
    );

}

export default SurfaceTileSelector;
