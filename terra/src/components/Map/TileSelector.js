import React from 'react';

function TileSelector({updateSelectedTileType}) {

    return(
        <div className="Tile-Selector">
            <button class="navBtn inputButtonNoBorder" onClick={() => updateSelectedTileType('grass')}>Grass</button>
            <button class="navBtn inputButtonNoBorder" onClick={() => updateSelectedTileType('dirt')}>Dirt</button>
            <button class="navBtn inputButtonNoBorder" onClick={() => updateSelectedTileType('rock')}>Rock</button>
            <button class="navBtn inputButtonNoBorder" onClick={() => updateSelectedTileType('water')}>Water</button>
        </div>
    );
}

export default TileSelector;
