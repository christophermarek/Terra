import { Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Map.css';
import { VariableSizeGrid as Grid } from 'react-window';

function Map({map, surfaceTiles, toggleBorder, updateMapWithSelectedTile, tileHover}) {
    
    const columnWidths = new Array(map.length)
        .fill(true)
        .map(() => 100);

    const rowHeights = new Array(map.length)
        .fill(true)
        .map(() => 100);

    const Cell = ({ columnIndex, rowIndex, style }) => (
        <div
            style={style}
            className={map[rowIndex][columnIndex].type + " " + (toggleBorder ? "cell-border" : "no-border") + " Cell"}
            onClick={() => updateMapWithSelectedTile(map[rowIndex][columnIndex].x, map[rowIndex][columnIndex].y)}
            onMouseEnter={() => tileHover(map[rowIndex][columnIndex].x, map[rowIndex][columnIndex].y)}
        >
            {((columnIndex == 4) && rowIndex == 4) ? (
                <svg className="svg">
                    <circle cx="100" cy="100" r="15" fill="yellow" />
                    <circle cx="100" cy="0" r="15" fill="yellow" />
                    <circle cx="0" cy="100" r="15" fill="yellow" />
                    <circle cx="0" cy="0" r="15" fill="yellow" />
                </svg>) : (<svg className="svg"></svg>)
                
            }
            
        </div>
    );
    console.log(map);
    return (
        <div className="Map">
            <div className="mapContainer">
                {
                    <Grid
                    className="Grid"
                    columnCount={map.length}
                    columnWidth={index => columnWidths[index]}
                    height={750}
                    rowCount={map.length}
                    rowHeight={index => rowHeights[index]}
                    width={1000}
                  >
                    {Cell}
                  </Grid>
                }
                
                
            </div>           
        </div>
    );
}

export default Map;
