import React from 'react';
import Tree from './Tree';
import Bush from './Bush';
import Air from './Air';

function SurfaceTileHandler({tileType, toggleBorder, x, y, updateMapWithSelectedTile}) {

    switch(tileType){
        case 'tree':
            return (
                <Tree toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile}/>
            );
        case 'bush':
            return (
                <Bush toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile}/>
            );
        case 'air':
            return (
                <Air toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile}/>
            );
    }
    
}

export default SurfaceTileHandler;
