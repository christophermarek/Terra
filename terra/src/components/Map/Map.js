import React, {useState} from 'react';
import './Map.css';
import { VariableSizeGrid as Grid } from 'react-window';
import {returnSurfaceObject} from '../../data/map/surfaceObjects'
import HoverControls from './HoverControls';
import { getBounds } from '../../Simulation Logic/grid';
import SurfaceObjectsPanel from './SurfaceObjectsPanel';
import MapFileHandler from './MapFileHandler';

function Map({map, surfaceObjects, updateMapWithSelectedTile, startClicked, started, isEditor, brain, selectedMapSaveNumber}) {

    const [toggleBorder, setToggleBorder] = useState(false);
    const [hoverEnabled, setHoverEnabled] = useState(false);
    const [mapHover, setMapHover] = useState(' ');
    const [gridEnabled, setGridEnabled] = useState(false);
    const [selectedSurfaceObjectId, setSelectedSurfaceObjectId] = useState(-1);


    let bounds = getBounds();

    function tileHover(x, y){
        if(hoverEnabled){
            setMapHover("Map: " + map[x][y].type);
        }
    }

    function renderGrid(){
        //console.log(map);

        return(
          <p>returned</p>  
        );
    }

    function enableHover(){
        if(hoverEnabled){
            setHoverEnabled(!hoverEnabled);
            setMapHover('');
        }else{
            setHoverEnabled(!hoverEnabled);
        }
    }

    function enableGrid(){
        setGridEnabled(!gridEnabled);
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
            //have to round since you cant have decimal co-ordinates
            let strX = String(Math.round(surfaceObjects[i].x));
            let strY = String(Math.round(surfaceObjects[i].y));
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
            
            if(Number(xIndex) === col && Number(yIndex) === row){
                temp.push(surfaceObjects[i]);
            }
        }
        return temp;
    }

    function fetchBoundsForTile(col, row){
        let temp = [];
        for(let i = 0; i < bounds.length; i++){
            //have to round since you cant have decimal co-ordinates
            let strX = String(Math.round(bounds[i].x));
            let strY = String(Math.round(bounds[i].y));
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
            
            if(Number(xIndex) === col && Number(yIndex) === row){
                temp.push(bounds[i]);
            }
        }
        return temp;
    }

    function renderBounds(col, row){
        let matchingbounds = fetchBoundsForTile(col, row); 
        if(matchingbounds.length > 0){
            //console.log(matchingbounds);
        }else{
            //console.log("no bounds loaded");
        }

        return(
            <svg className="svg">
                {matchingbounds.map((object, i) => {
                    
                    let xToStr = String(Math.round(object.x));
                    let yToStr = String(Math.round(object.y));
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

                    return(
                        <circle cx={x} cy={y} r={1} fill="black"></circle>
                    )
                    
                })}
            </svg>
        );
    }


    function renderSurfaceObjects(col, row){
        let matchingSurfaceObjects = fetchSurfaceObjectsForTile(col, row); 
        if(matchingSurfaceObjects.length > 0){
            //console.log(matchingSurfaceObjects);
        }
        return(
            <svg className="svg">
                {matchingSurfaceObjects.map((object, i) => {
                    //console.log(object);
                    let xToStr = String(Math.round(object.x));
                    let yToStr = String(Math.round(object.y));
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

                    let key = xToStr + "," + yToStr + "," + object.id;
                    
                    return(
                        //<circle className={fetchedObject.type + " " + (selectedSurfaceObjectId === object.id ? "cell-border" : "no-border")} key={key} cx={x} cy={y} r={fetchedObject.size} fill={"url(#" + fetchedObject.type + ")"}>
                        <circle className={fetchedObject.type + " " + (selectedSurfaceObjectId === object.id ? "cell-border" : "no-border")} key={key} cx={x} cy={y} r={fetchedObject.size} fill={fetchedObject.color}>
                            
                        </circle>
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

    const GridCell = ({ columnIndex, rowIndex, style }) => (
        <div
            style={style}
            className={"gridBackground " + (toggleBorder ? "cell-border" : "no-border") + " Cell"}
        >
            {
            //Change to renderGrid Tiles, not sure how to implement it
            //maybe add another variable to grid that is the static walls on the grid,
            //then we can draw the points like we do surfaceObjects? can we?
        
            }
            {renderBounds(columnIndex, rowIndex)}
            
        </div>
    );

    if (!(typeof updateMapWithSelectedTile === "function")) { 
        updateMapWithSelectedTile = function(){}
    }


    return (
        <div className="Map">
            <div className="leftContainer">
                <div className="mapControls">
                    <MapFileHandler brain={brain} map={map} surfaceObjects={surfaceObjects} mapSaveNumber={selectedMapSaveNumber}/>
                    {!isEditor ? (
                        <button className={"navBtn inputButtonNoBorder Tile-Selector" + (started ? ' selectedButton' : ' ')} onClick={startClicked}>{started ? "Stop" : "Start"}</button>
                    ):(<></>)
                    }
                    <button className={"navBtn inputButtonNoBorder Tile-Selector" + (toggleBorder ? ' selectedButton' : ' ')} onClick={toggleCellBorders}>Toggle Cell Borders</button>
                </div>

                <SurfaceObjectsPanel
                    surfaceObjects={surfaceObjects}
                    brain={brain}
                    setSelectedSurfaceObjectId={setSelectedSurfaceObjectId}
                    selectedSurfaceObjectId={selectedSurfaceObjectId}
                />

            </div>
            
            
            <div className="mapContainer">
                {!gridEnabled ? (
                    <>
                    <svg className="assets">
                        <defs>
                            <pattern id="tree" x="0" y="0" height="1" width="1">
                                <image x="0" y="0" href="https://i.ibb.co/GnDLfxG/tree.png"></image>
                            </pattern>   
                            <pattern id="bush" x="0" y="0" height="1" width="1">
                                <image x="0" y="0" href="https://i.ibb.co/FWWLnBd/bush.png"></image>
                            </pattern>   
                            <pattern id="rabbit" x="0" y="0" height="1" width="1">
                                <image x="0" y="0" href="https://i.ibb.co/LCCm7ng/rabbit.png"></image>
                            </pattern>     
                        </defs>   
                    </svg>

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
                    </>
                    

                    
                )
                :
                (
                    <Grid
                        className="Grid"
                        columnCount={map.length}
                        columnWidth={index => columnWidths[index]}
                        height={750}
                        rowCount={map.length}
                        rowHeight={index => rowHeights[index]}
                        width={1000}
                    >
                        {GridCell}
                    </Grid>
                )}
            </div>           
        </div>
    );
}

export default Map;
