import React from 'react';
import Grass from './Grass';

function TileHandler({tileType, key}) {
    console.log(tileType);
    console.log(key);
    switch(tileType){
        case 'grass':
        return (
            <Grass key={key}/>
         );
    }
    
}

export default TileHandler;
