import React, { useState, useEffect } from 'react';
import Map from './Map';
import TileSelector from './TileSelector';
import MapFileHandler from './MapFileHandler';
import SurfaceTileSelector from './SurfaceTileSelector';
import HoverControls from './HoverControls';
import SurfaceObjectSelector from './SurfaceObjectSelector';
import {tree, rabbit} from '.././surfaceObjects';

function MapEditor() {

    const [mapSize, setSize] = useState(200);
    const [map, setMap] = useState([]);
    const [toggleBorder, setToggleBorder] = useState(true);
    const [selectedTile, setSelectedTile] = useState('grass');
    const [surfaceTiles, setSurfaceTiles] = useState([]);
    const [selectedTileType, setSelectedTileType] = useState('');
    const [hoverEnabled, setHoverEnabled] = useState(false);
    const [mapHover, setMapHover] = useState(' ');

    const [surfaceObjects, setSurfaceObjects] = useState([]);
    



    function generateSurfaceObjects(){
        
        let newSurfaceObjects = [];

        newSurfaceObjects.push({x: 25, y: 35, type: tree.type});
        newSurfaceObjects.push({x: 150, y: 350, type: tree.type});
        newSurfaceObjects.push({x: 350, y: 350, type: tree.type});
        newSurfaceObjects.push({x: 200, y: 200, type: rabbit.type});
        newSurfaceObjects.push({x: 425, y: 435, type: rabbit.type});

        setSurfaceObjects(surfaceObjects => (newSurfaceObjects));
        
    }

    //move function out of this file to separate handler
    function Grass(x, y){
        let defaultTile = {
            x: x,
            y: y,
            type: "grass",
        }; 

        return defaultTile;
    }


    //generateMap from mapSize args
    function generateMap(){

        let newMap = [];
        
        for(let i = 0; i < mapSize; i++){
            let columns = [];
            for(let j = 0; j < mapSize; j++){
                columns.push(Grass(i, j));
            }
            newMap.push(columns);  
        }

        setMap(map => (newMap));
    };

    function generateWorld(){
        generateMap();
        generateSurfaceObjects();
    }

    function toggleCellBorders(e){
        e.preventDefault();
        let newMap = [];
        let size = 200;
        for(let i = 0; i < size; i++){
            let columns = [];
            for(let j = 0; j < size; j++){
                columns.push(Grass(i, j));
            }
            newMap.push(columns);  
        }
        setToggleBorder(!toggleBorder);
    }

    function updateSelectedTileType(type){
        setSelectedTile(type);
        setSelectedTileType('map');
    } 

    function updateSelectedSurfaceTileType(type){
        setSelectedTile(type);
        setSelectedTileType('surface');
    }

    function updateSelectedSurfaceObjectType(type){
        setSelectedTile(type);
        setSelectedTileType('surface');
    }

    function updateMapWithSelectedTile(e, x, y){
        if(selectedTileType === 'map'){
            let newMap = [...map];
            newMap[x][y].type = selectedTile;
            setMap(map => (newMap));
        }

        if(selectedTileType === 'surface'){
            let newSurfaceObjects = [...surfaceObjects];
            
            let CalcX = Number(String(x) + String(e.nativeEvent.offsetX));
            let CalcY = Number(String(y) + String(e.nativeEvent.offsetY));
            //x y have to be flipped for svg
            let newObj = {
                x: CalcY,
                y: CalcX,
            }


            if(selectedTile == 'rabbit'){
                newObj.color= rabbit.color;
                newObj.shape = rabbit.shape;
                newObj.type = 'rabbit';
            }else{
                newObj.color= tree.color;
                newObj.shape = tree.shape;
                newObj.type = 'tree';
            }
            
            newSurfaceObjects.push(newObj);
            setSurfaceObjects(surfaceObjects => (newSurfaceObjects))
            
        }
    }


    function loadMap(importedData){
        let data = JSON.parse(importedData);
        setMap(map => (data.mapData));
        setSurfaceObjects(surfaceObjects => (data.surfaceData));
        console.log("map loaded");

    }

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

    function mapSizeChange(e){
        setSize(e.target.value);
    }

  
    return (
        <div className = "Map-Editor"> 
            {map.length === 0 ? (
                <>
                    <p>Map Empty</p>
                    <form onSubmit={generateWorld} >
                        <input type="text" value={mapSize} onChange={mapSizeChange}></input>
                        <button type="Submit">Generate</button>
                    </form>
                </>
            ) : (
                <>  
                    <form onSubmit={toggleCellBorders} >
                        <button type="Submit">Toggle Cell Borders</button>
                    </form>
                    <TileSelector updateSelectedTileType={updateSelectedTileType}/>
                    <SurfaceObjectSelector updateSelectedSurfaceObjectType={updateSelectedSurfaceObjectType}></SurfaceObjectSelector>
                    <MapFileHandler loadMap={loadMap} map={map} surfaceObjects={surfaceObjects}/>
                    <HoverControls mapHover={mapHover} enableHover={enableHover}/>
                    <Map map={map}
                         surfaceTiles={surfaceTiles}
                         surfaceObjects={surfaceObjects}
                         toggleBorder={toggleBorder} 
                         updateMapWithSelectedTile={updateMapWithSelectedTile}
                         tileHover={tileHover}
                    />
                </>
            )}
        </div>
    );
}

export default MapEditor;
