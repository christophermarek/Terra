import React from 'react';
import Grass from './Grass';
import Rock from './Rock';
import Dirt from './Dirt';
import Water from './Water';

function TileHandler({tileType, toggleBorder, x, y, updateMapWithSelectedTile, tileHover}) {

    switch(tileType){
        case 'grass':
            return (
                <Grass toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile} tileHover={tileHover}/>
            );
        case 'dirt':
            return (
                <Dirt toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile} tileHover={tileHover}/>
            );
        case 'rock':
            return (
                <Rock toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile} tileHover={tileHover}/>
            );
        case 'water':
            return (
                <Water toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile} tileHover={tileHover}/>
            );
        default:
            return (
                <Dirt toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile} tileHover={tileHover}/>
            );
    }
    
}

export default TileHandler;
