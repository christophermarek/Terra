import React from 'react';
import Tree from './Tree';
import Bush from './Bush';
import Air from './Air';

function SurfaceTileHandler({tileType, toggleBorder, x, y, updateMapWithSelectedTile, tileHover}) {

    switch(tileType){
        case 'tree':
            return (
                <Tree toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile} tileHover={tileHover}/>
            );
        case 'bush':
            return (
                <Bush toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile} tileHover={tileHover}/>
            );
        case 'air':
            return (
                <Air toggleBorder={toggleBorder} x={x} y={y} updateMapWithSelectedTile={updateMapWithSelectedTile} tileHover={tileHover}/>
            );
    }
    
}

export default SurfaceTileHandler;
