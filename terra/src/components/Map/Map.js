import React, {useState} from 'react';
import './Map.css';
import { VariableSizeGrid as Grid } from 'react-window';
import {returnSurfaceObject} from '../../data/map/surfaceObjects'
import HoverControls from './HoverControls';

function Map({map, surfaceObjects, updateMapWithSelectedTile}) {

    const [toggleBorder, setToggleBorder] = useState(true);
    const [hoverEnabled, setHoverEnabled] = useState(false);
    const [mapHover, setMapHover] = useState(' ');

    function tileHover(x, y){
        if(hoverEnabled){
            setMapHover("Map: " + map[x][y].type);
        }
    }

    function enableHover(){
        if(hoverEnabled){
            setHoverEnabled(!hoverEnabled);
            setMapHover('');
        }else{
            setHoverEnabled(!hoverEnabled);
        }
    }

    function toggleCellBorders(e){
        e.preventDefault();
        setToggleBorder(!toggleBorder);
    }

    const columnWidths = new Array(map.length)
        .fill(true)
        .map(() => 100);

    const rowHeights = new Array(map.length)
        .fill(true)
        .map(() => 100);

    //creates an array of the surfaceObjects that exist in tile at col, row
    function fetchSurfaceObjectsForTile(col, row){
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
            
            if(Number(xIndex) == col && Number(yIndex) == row){
                temp.push(surfaceObjects[i]);
            }
        }
        return temp;
    }

    function renderSurfaceObjects(col, row){
        let matchingSurfaceObjects = fetchSurfaceObjectsForTile(col, row); 

        return(
            <svg className="svg">
                {matchingSurfaceObjects.map((object, i) => {
                    
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
                    
                    let fetchedObject = returnSurfaceObject(object.type);
                    return(
                        <circle cx={x} cy={y} r={fetchedObject.size} fill={fetchedObject.color}></circle>
                    )
                    
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

    if (!(typeof updateMapWithSelectedTile === "function")) { 
        updateMapWithSelectedTile = function(){}
    }

    return (
        <div className="Map">
            <form onSubmit={toggleCellBorders} >
                <button type="Submit">Toggle Cell Borders</button>
            </form>
            <HoverControls mapHover={mapHover} enableHover={enableHover}/>
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
