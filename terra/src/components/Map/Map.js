import { Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Map.css';
import { VariableSizeGrid as Grid } from 'react-window';

function Map({map, surfaceTiles, surfaceObjects, toggleBorder, updateMapWithSelectedTile, tileHover}) {
    
    const columnWidths = new Array(map.length)
        .fill(true)
        .map(() => 100);

    const rowHeights = new Array(map.length)
        .fill(true)
        .map(() => 100);

    function renderSurfaceObjects(col, row){
        let temp = [];
        for(let i = 0; i < surfaceObjects.length; i++){
            if(String(surfaceObjects[i].x).charAt(0) == col && String(surfaceObjects[i].y).charAt(0) == row){
                temp.push(surfaceObjects[i]);
            }
        }
        return(
            <svg className="svg">
                {temp.map((object, i) => {
                    //since x,y are ints, cast to int and remove the first index
                    //since the first index is the tile index
                    let x = String(object.x).substr(1);
                    let y = String(object.y).substr(1);
                    if(object.type == "tree"){
                        console.log("got a tree");
                        return(
                            <rect x={x} y={y} fill={object.color} height="50" width="50"></rect>
                        )
                    }else{
                        return(
                            <circle cx={x} cy={y} r="15" fill={object.color}></circle>
                        )
                    }
                })}
            </svg>
        );
    }

    const Cell = ({ columnIndex, rowIndex, style }) => (
        <div
            style={style}
            className={map[rowIndex][columnIndex].type + " " + (toggleBorder ? "cell-border" : "no-border") + " Cell"}
            onClick={() => updateMapWithSelectedTile(map[rowIndex][columnIndex].x, map[rowIndex][columnIndex].y)}
            onMouseEnter={() => tileHover(map[rowIndex][columnIndex].x, map[rowIndex][columnIndex].y)}
        >
            {renderSurfaceObjects(columnIndex, rowIndex)}
            
        </div>
    );
    console.log(surfaceObjects);
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
