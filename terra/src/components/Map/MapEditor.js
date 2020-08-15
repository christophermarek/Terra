import React, { useState } from 'react';
import Map from './Map';
import TileSelector from './TileSelector';
import MapFileHandler from './MapFileHandler';
import SurfaceObjectSelector from './SurfaceObjectSelector';

function MapEditor() {

    const [mapSize, setSize] = useState(20);
    const [map, setMap] = useState([]);
    const [selectedTile, setSelectedTile] = useState('grass');
    const [selectedTileType, setSelectedTileType] = useState('');
    const [surfaceObjects, setSurfaceObjects] = useState([]);
    

    function generateSurfaceObjects(){
        
        let newSurfaceObjects = [];

        //newSurfaceObjects.push({x: 25, y: 35, type: "tree"});
        //newSurfaceObjects.push({x: 150, y: 350, type: "tree"});
        //newSurfaceObjects.push({x: 350, y: 350, type: "tree"});
        //newSurfaceObjects.push({x: 200, y: 200, type: "rabbit"});
        //newSurfaceObjects.push({x: 425, y: 435, type: "rabbit"});

        setSurfaceObjects(surfaceObjects => (newSurfaceObjects));
        
    }

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

    function updateSelectedTileType(type){
        setSelectedTile(type);
        setSelectedTileType('map');
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

            if(selectedTile === 'rabbit'){
                newObj.type = 'rabbit';
            }else{
                newObj.type = 'tree';
            }
            
            //add id for ai link
            newObj.id = newSurfaceObjects.length;

            newSurfaceObjects.push(newObj);
            setSurfaceObjects(surfaceObjects => (newSurfaceObjects))
            
        }
    }


    function loadMap(importedData){
        let data = JSON.parse(importedData);
        setMap(map => (data.mapData));
        setSurfaceObjects(surfaceObjects => (data.surfaceData));
    }


    function mapSizeChange(e){
        setSize(e.target.value);
    }

  
    return (
        <div className = "Map-Editor"> 
            {map.length === 0 ? (
                <div className="preLoad">
                    <input type="text" value={mapSize} onChange={mapSizeChange}></input>
                    <button className="button" onClick={generateWorld}>Generate</button>
                </div>
            ) : (
                <>  <div className="editorControls">
                    <TileSelector updateSelectedTileType={updateSelectedTileType}/>
                    <SurfaceObjectSelector updateSelectedSurfaceObjectType={updateSelectedSurfaceObjectType}></SurfaceObjectSelector>
                    <MapFileHandler loadMap={loadMap} map={map} surfaceObjects={surfaceObjects}/>
                    </div>
                    
                    <Map map={map}
                         surfaceObjects={surfaceObjects}
                         updateMapWithSelectedTile={updateMapWithSelectedTile}
                    />
                </>
            )}
        </div>
    );
}

export default MapEditor;
