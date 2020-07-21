import React, { useState, useEffect } from 'react';
import Map from './Map';
import TileSelector from './TileSelector';
import MapFileHandler from './MapFileHandler';
import SurfaceTileSelector from './SurfaceTileSelector';
import HoverControls from './HoverControls';

function MapEditor() {

    const [mapSize, setSize] = useState(200);
    const [map, setMap] = useState([]);
    const [toggleBorder, setToggleBorder] = useState(true);
    const [selectedTile, setSelectedTile] = useState('grass');
    const [surfaceTiles, setSurfaceTiles] = useState([]);
    const [selectedTileType, setSelectedTileType] = useState('');
    const [hoverEnabled, setHoverEnabled] = useState(false);
    const [mapHover, setMapHover] = useState(' ');
    const [surfaceHover, setSurfaceHover] = useState('');

    const [surfaceTobjects, setSurfaceObjects] = useState([]);
 

    function airTile(x, y){
        let airTile = {
            x: x,
            y: y,
            type: "air",
        }
        return airTile;
    }

    function generateSurfaceTiles(){

        let newSurfaceTiles = [];
        
        for(let i = 0; i < mapSize; i++){
            let columns = [];
            for(let j = 0; j < mapSize; j++){
                columns.push(airTile(i, j));
            }

        newSurfaceTiles.push(columns);  
        }

        setSurfaceTiles(surfaceTiles => (newSurfaceTiles));
    };

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
        generateSurfaceTiles();
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

    function surfaceTileAllowed(x, y){
        let plantSurfaceTiles = ['tree', 'bush'];
        let plantMapTiles = ['grass', 'dirt'];

        if(plantSurfaceTiles.includes(selectedTile)){
            if(plantMapTiles.includes(map[x][y].type)){
                return true;
            }else{
                return false;
            }
        }
    }

    function updateMapWithSelectedTile(x, y){
        if(selectedTileType === 'map'){
            let newMap = [...map];
            newMap[x][y].type = selectedTile;
            setMap(map => (newMap));
        }

        if(selectedTileType === 'surface'){
            if(surfaceTileAllowed(x, y) || selectedTile == 'air'){
                let newSurfaceTiles = [...surfaceTiles];
                newSurfaceTiles[x][y].type = selectedTile;
                setSurfaceTiles(surfaceTiles => (newSurfaceTiles));
            }
        }
    }


    function loadMap(importedData){
        let data = JSON.parse(importedData);
        setMap(map => (data.mapData));
        setSurfaceTiles(surfaceTiles => (data.surfaceData))
    }

    function tileHover(x, y){
        if(hoverEnabled){
            setMapHover("Map: " + map[x][y].type);
            setSurfaceHover("Surface: " + surfaceTiles[x][y].type);
        }
    }
    
    function enableHover(){
        if(hoverEnabled){
            setHoverEnabled(!hoverEnabled);
            setMapHover('');
            setSurfaceHover('');
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
                    <SurfaceTileSelector updateSelectedSurfaceTileType={updateSelectedSurfaceTileType} />
                    <MapFileHandler loadMap={loadMap} map={map} surfaceTiles={surfaceTiles}/>
                    <HoverControls surfaceHover={surfaceHover} mapHover={mapHover} enableHover={enableHover}/>
                    <Map map={map}
                         surfaceTiles={surfaceTiles}
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
