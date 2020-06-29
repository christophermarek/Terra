import React from 'react';

function TileSelector({updateSelectedTileType}) {

    return(
        <div className="Tile-Selector">
            <button onClick={() => updateSelectedTileType('grass')}>Grass</button>
            <button onClick={() => updateSelectedTileType('dirt')}>Dirt</button>
            <button onClick={() => updateSelectedTileType('rock')}>Rock</button>
            <button onClick={() => updateSelectedTileType('water')}>Water</button>
        </div>
    );
}

export default TileSelector;
