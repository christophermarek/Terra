import { Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Map.css';
import TileHandler from '../Tiles/TileHandler';
import SurfaceTileHandler from '../SurfaceTiles/SurfaceTileHandler'; 

function Map({map, surfaceTiles, toggleBorder, updateMapWithSelectedTile}) {
    return (
        <div className="Map">
            <div className="mapContainer">
                {map.map(function (item, i){
                let entry = item.map(function (element, j) {
                    if(surfaceTiles[i][j].type != "air"){
                        return(
                            <SurfaceTileHandler 
                                x={element.x} 
                                y={element.y} 
                                tileType={element.type} 
                                toggleBorder={toggleBorder} 
                                key={j} 
                            />
                        );
                    }else{
                        return ( 
                            <TileHandler 
                                x={element.x} 
                                y={element.y} 
                                tileType={element.type} 
                                toggleBorder={toggleBorder} 
                                key={j} 
                                updateMapWithSelectedTile={updateMapWithSelectedTile}
                            />
                        );
                    }
                });
                return (
                    <div className="row" key={i}>{entry}</div>
                );
                })}
            </div>           
        </div>
    );
}

export default Map;
