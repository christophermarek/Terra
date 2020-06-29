import React from 'react';
import Grass from './Grass';
import Rock from './Rock';
import Dirt from './Dirt';
import Water from './Water';

function TileHandler({tileType}) {

    switch(tileType){
        case 'grass':
            return (
                <Grass />
            );
        case 'dirt':
            return (
                <Dirt />
            );
        case 'rock':
            return (
                <Rock />
            );
        case 'water':
            return (
                <Water />
            );
        default:
            return (
                <Dirt />
            );
    }
    
}

export default TileHandler;
