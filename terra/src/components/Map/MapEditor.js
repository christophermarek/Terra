import React, { useState, useEffect } from 'react';
import Map from './Map';
import TileSelector from './TileSelector';
import MapFileHandler from './MapFileHandler';

function MapEditor() {

    const [mapSize, setSize] = useState(20);
    const [map, setMap] = useState([]);
    const [toggleBorder, setToggleBorder] = useState(true);
    const [selectedTile, setSelectedTile] = useState('grass');

    useEffect(() => {
        
    });

    function Grass(x, y){
        let defaultTile = {
            x: x,
            y: y,
            type:"grass",
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

    function toggleCellBorders(e){
        e.preventDefault();
        setToggleBorder(!toggleBorder);
    }

    function updateSelectedTileType(type){
        setSelectedTile(type);
    } 

    function updateMapWithSelectedTile(x, y){
        let newMap = [...map];
        newMap[x][y].type = selectedTile;
        setMap(map => (newMap));
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
                    <form onSubmit={generateMap} >
                        <button type="Submit">Generate</button>
                    </form>
                </>
            ) : (
                <>  
                    <form onSubmit={toggleCellBorders} >
                        <button type="Submit">Toggle Cell Borders</button>
                    </form>
                    <TileSelector updateSelectedTileType={updateSelectedTileType}/>
                    <MapFileHandler loadMap={loadMap} map={map}/>
                    <Map map={map} toggleBorder={toggleBorder} updateMapWithSelectedTile={updateMapWithSelectedTile}/>
                </>
            )}
        </div>
    );
}

export default MapEditor;
