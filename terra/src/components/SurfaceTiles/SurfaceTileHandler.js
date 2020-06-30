import React from 'react';
import Tree from './Tree';

function SurfaceTileHandler({tileType, toggleBorder, x, y}) {

    switch(tileType){
        case 'tree':
            return (
                <Tree toggleBorder={toggleBorder} x={x} y={y} />
            );
    }
    
}

export default SurfaceTileHandler;
