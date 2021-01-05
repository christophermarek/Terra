import React, { useState } from 'react';
import Map from './Map';
import TileSelector from './TileSelector';
import MapFileHandler from './MapFileHandler';
import SurfaceObjectSelector from './SurfaceObjectSelector';
import {returnSurfaceObject} from '../../data/map/surfaceObjects'
function MapEditor() {

    const [map, setMap] = useState([]);
    const [selectedTile, setSelectedTile] = useState('grass');
    const [selectedTileType, setSelectedTileType] = useState('');
    const [surfaceObjects, setSurfaceObjects] = useState([]);
    const [selectedMapSaveNumber, setSelectedMapSaveNumber] = useState(0);

    function generateSurfaceObjects(){
        
        let newSurfaceObjects = [];

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
    function generateMap(inputSize){

        let newMap = [];
        
        for(let i = 0; i < inputSize; i++){
            let columns = [];
            for(let j = 0; j < inputSize; j++){
                columns.push(Grass(i, j));
            }
            newMap.push(columns);  
        }

        setMap(map => (newMap));
    };

    function generateWorld(inputSize){
        generateMap(inputSize);
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

            let objData = returnSurfaceObject(selectedTile);

            newObj.health = objData.maxHealth;

            if(objData.type === 'rabbit'){
                newObj.hunger = 100;
            }

            if(objData.type === 'bush'){
                newObj.food = 100;
            }

            newObj.type = objData.type;
            
            //add id for ai link
            newObj.id = newSurfaceObjects.length;

            newSurfaceObjects.push(newObj);
            setSurfaceObjects(surfaceObjects => (newSurfaceObjects))
            
        }
    }

    //unused function
    function loadMap(importedData){
        let data = JSON.parse(importedData);
        setMap(map => (data.mapData));
        setSurfaceObjects(surfaceObjects => (data.surfaceData));
    }
    
    function editMapClicked(mapSaveNumber){

        setSelectedMapSaveNumber(mapSaveNumber);

        let data = JSON.parse(window.localStorage.getItem(`map${mapSaveNumber}`));
        setMap(map => (data.mapData));
        setSurfaceObjects(surfaceObjects => (data.surfaceData));

    }

    function generateMapClicked(mapSaveNumber){

        setSelectedMapSaveNumber(mapSaveNumber);

        var sizePrompt = prompt("Enter a map size as an integer:");
        if (sizePrompt == null || sizePrompt == "") {
            alert("Invalid map size, please enter a integer between 1-10");
            return;
        } else {
            let parsedSize = parseInt(sizePrompt);
            //can make mapsize 0, and when mapsize is not 0 is when we call generate world(),
            //YO WE CAN JUST CALL GENERATE WORLD WITH ARGS THAT ARE THE MAP SIZE,
            //I THINK ITS ONLY USED TO GENERATE THE MAP FOR THIS ONE FUNCTION
            //console.log(mapSize);
            generateWorld(parsedSize);
        } 
    }

    function deleteMapClicked(mapSaveNumber){
        if(window.confirm(`Are you sure you want to delete save #${mapSaveNumber}`)) {
            localStorage.removeItem(`map${mapSaveNumber}`);
            localStorage.removeItem(`map${mapSaveNumber}Ai`);
          }
    }
    

    function loadLocalSaves(){

        //this is the amount of saves we are supporting right now
        const numbers = [1, 2, 3, 4, 5];

        return numbers.map((number) => 
            <div className="saveBar">
                
                <p class="mapSaveFileText">Map {number}</p>

                {localStorage.hasOwnProperty(`map${number}`) ? (
                    <div className="saveControls">
                        <input type="button" value="Edit" class="navBtn inputButtonNoBorder" onClick={() => editMapClicked(number)}></input>
                        <input type="button" value="Delete" class="navBtn inputButtonNoBorder" onClick={() => deleteMapClicked(number)}></input>
                    </div>
                ) 
                :
                (
                    <div className="saveControls">
                        <input type="button" value="Generate" class="navBtn inputButtonNoBorder" onClick={() => generateMapClicked(number)}></input>
                    </div>
                )}

            </div>

                
            
        );
    }
  
    return (
        <div className = "Map-Editor"> 
            {map.length === 0 ? (
                <div className="preEditor">
                    <div className="preLoad">
                        {loadLocalSaves()}
                    </div>
                </div>
                
            ) : (
                <>  
                    <div className="editorControls">
                        <TileSelector updateSelectedTileType={updateSelectedTileType}/>
                        <SurfaceObjectSelector updateSelectedSurfaceObjectType={updateSelectedSurfaceObjectType}></SurfaceObjectSelector>
                        <MapFileHandler loadMap={loadMap} map={map} surfaceObjects={surfaceObjects} mapSaveNumber={selectedMapSaveNumber}/>
                    </div>
                    
                    <Map map={map}
                         surfaceObjects={surfaceObjects}
                         isEditor={true}
                         updateMapWithSelectedTile={updateMapWithSelectedTile}
                    />
                </>
            )}
        </div>
    );
}

export default MapEditor;
