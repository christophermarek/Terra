import React, { useState, useEffect } from 'react';
import Map from './Map';
import TileSelector from './TileSelector';
import MapFileHandler from './MapFileHandler';
import SurfaceTileSelector from './SurfaceTileSelector';

function MapEditor() {

    const [mapSize, setSize] = useState(20);
    const [map, setMap] = useState([]);
    const [toggleBorder, setToggleBorder] = useState(true);
    const [selectedTile, setSelectedTile] = useState('grass');
    const [surfaceTiles, setSurfaceTiles] = useState([]);
    const [selectedTileType, setSelectedTileType] = useState('');

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


    function loadMap(importedMap){
        let impMap = JSON.parse(importedMap);
        setMap(map => (impMap));
    }

  
    return (
        <div className = "Map-Editor"> 
            {map.length === 0 ? (
                <>
                    <p>Map Empty</p>
                    <form onSubmit={generateWorld} >
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
                    <MapFileHandler loadMap={loadMap} map={map} />
                    <Map map={map}
                         surfaceTiles={surfaceTiles}
                         toggleBorder={toggleBorder} 
                         updateMapWithSelectedTile={updateMapWithSelectedTile}
                    />
                </>
            )}
        </div>
    );
}

export default MapEditor;
