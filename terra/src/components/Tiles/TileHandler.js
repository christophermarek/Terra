import React from 'react';
import Grass from './Grass';
import Rock from './Rock';
import Dirt from './Dirt';
import Water from './Water';

function TileHandler({tileType, toggleBorder, x, y, updateMapWithSelectedTile}) {

    switch(tileType){
        case 'grass':
            return (
                <Grass toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile}/>
            );
        case 'dirt':
            return (
                <Dirt toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile}/>
            );
        case 'rock':
            return (
                <Rock toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile}/>
            );
        case 'water':
            return (
                <Water toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile}/>
            );
        default:
            return (
                <Dirt toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile}/>
            );
    }
    
}

export default TileHandler;
