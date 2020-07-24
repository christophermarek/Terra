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
            let strX = String(surfaceObjects[i].x);
            let strY = String(surfaceObjects[i].y);
            //fix if [0][y] or [x][0]
            if(strX.length <= 2){
                strX = "0" + strX;
            }
            if(strY.length <= 2){
                strY = "0" + strY;
            }

            //fetch only the coords for col/row. last two digits are internal svg coords
            let xIndex = strX.substring(0, strX.length - 2);
            let yIndex = strY.substring(0, strY.length - 2);
            //have to check if x or y is not a 
            if(xIndex == col && yIndex == row){
                temp.push(surfaceObjects[i]);
            }
        }
        return(
            <svg className="svg">
                {temp.map((object, i) => {
                    
                    let xToStr = String(object.x);
                    let yToStr = String(object.y);
                    if(xToStr.length <= 2){
                        xToStr = "0" + xToStr;
                    }
                    if(yToStr.length <= 2){
                        yToStr = "0" + yToStr;
                    }

                    //since x,y are ints, cast to string and get the last two indexes
                    //since the begining index's are the tile's index
                    let x = xToStr.slice(-2);
                    let y = yToStr.slice(-2);

                    if(object.type == "tree"){
                        return(
                            <rect  x={x} y={y} fill={object.color} height="50" width="50"></rect>
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
            onClick={(e) => updateMapWithSelectedTile(e, map[rowIndex][columnIndex].x, map[rowIndex][columnIndex].y)}
            onMouseEnter={() => tileHover(map[rowIndex][columnIndex].x, map[rowIndex][columnIndex].y)}
        >
            {renderSurfaceObjects(columnIndex, rowIndex)}
            
        </div>
    );
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
