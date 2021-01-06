import React from 'react';

function TileSelector({updateSelectedTileType, selectedTile}) {

    return(
        <div className="Tile-Selector">
            <button className={"navBtn inputButtonNoBorder" + (selectedTile === 'grass' ? ' selectedButton' : ' ')} onClick={() => updateSelectedTileType('grass')}>Grass</button>
            <button className={"navBtn inputButtonNoBorder" + (selectedTile === 'dirt' ? ' selectedButton' : ' ')} onClick={() => updateSelectedTileType('dirt')}>Dirt</button>
            <button className={"navBtn inputButtonNoBorder" + (selectedTile === 'rock' ? ' selectedButton' : ' ')} onClick={() => updateSelectedTileType('rock')}>Rock</button>
            <button className={"navBtn inputButtonNoBorder" + (selectedTile === 'water' ? ' selectedButton' : ' ')} onClick={() => updateSelectedTileType('water')}>Water</button>
        </div>
    );
}

export default TileSelector;
