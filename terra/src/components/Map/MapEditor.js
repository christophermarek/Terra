import React, { useState } from 'react';
import Map from './Map';
import TileSelector from './TileSelector';
import SurfaceObjectSelector from './SurfaceObjectSelector';
import { returnSurfaceObject } from '../../data/map/surfaceObjects';

function MapEditor() {

    const [map, setMap] = useState([]);
    const [selectedTile, setSelectedTile] = useState('grass');
    const [selectedTileType, setSelectedTileType] = useState('');
    const [surfaceObjects, setSurfaceObjects] = useState([]);
    const [selectedMapSaveNumber, setSelectedMapSaveNumber] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    function generateSurfaceObjects(){
        
        let newSurfaceObjects = [];
        setSurfaceObjects(surfaceObjects => (newSurfaceObjects));
        
    }

    //generateMap from mapSize args
    function generateMap(inputSize){

        let newMap = [];

        for(let i = 0; i < inputSize; i++){
            let columns = [];
            for(let j = 0; j < inputSize; j++){
                let defaultTile = {
                    x: i,
                    y: j,
                    type: "grass",
                }; 
                columns.push(defaultTile);
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

    function deleteSurfaceObjectClicked(){
        setIsDeleting(!isDeleting);
    }

    function deleteSurfaceObject(e, x, y){
        let TileX = (x * 100);
        let TileY = (y * 100);
        let xOffset = (e.nativeEvent.offsetX);
        let yOffset = (e.nativeEvent.offsetY);

        let CalcX = (TileY) + (xOffset);
        let CalcY = (TileX) + (yOffset);

        let target = {
            x: CalcX,
            y: CalcY
        }
        //now we need to find the surfaceObject that intersects with this one.
        for(let i = 0; i < surfaceObjects.length; i++){
            let radius = returnSurfaceObject(surfaceObjects[i].type).size;
            //point is inside of surfaceObject if true
            if(Math.pow(target.x - surfaceObjects[i].x, 2) + Math.pow(target.y - surfaceObjects[i].y, 2) < Math.pow(radius, 2)){
                //remove surfaceObject from array without mutating
                const selectedRemoved = [...surfaceObjects.slice(0, i), ...surfaceObjects.slice(i + 1)];
                setSurfaceObjects(selectedRemoved);
            } 
               
        }
            
    }

    function updateMapWithSelectedTile(e, x, y){
        if(isDeleting){
            deleteSurfaceObject(e, x, y);
        }else{
            if(selectedTileType === 'map'){
                let newMap = [...map];
                newMap[x][y].type = selectedTile;
                setMap(map => (newMap));
            }
            if(selectedTileType === 'surface'){
                let newSurfaceObjects = [...surfaceObjects];
                let TileX = (x * 100);
                let TileY = (y * 100);
                let xOffset = (e.nativeEvent.offsetX);
                let yOffset = (e.nativeEvent.offsetY);
    
                let CalcX = (TileY) + (xOffset);
                let CalcY = (TileX) + (yOffset);
    
                //x y have to be flipped for svg
                let newObj = {
                    x: CalcX,
                    y: CalcY,
                }
    
                let objData = returnSurfaceObject(selectedTile);
                
                newObj.health = objData.maxHealth;
    
                if(objData.type === 'rabbit'){
                    newObj.hunger = 100;
                    newObj.thirst = 100;
                }
    
                if(objData.type === 'bush'){
                    newObj.food = 100;
                }
    
                newObj.type = objData.type;
    
                newObj.id = newSurfaceObjects.length;
                newSurfaceObjects.push(newObj);

                setSurfaceObjects(surfaceObjects => (newSurfaceObjects));
            }
        }
    }
    
    function editMapClicked(mapSaveNumber){
        setSelectedMapSaveNumber(mapSaveNumber);

        let data = JSON.parse(window.localStorage.getItem(`map${mapSaveNumber}`));
        setMap(map => (data.mapData));
        setSurfaceObjects(surfaceObjects => (data.surfaceData));
    }

    function generateMapClicked(mapSaveNumber){

        setSelectedMapSaveNumber(mapSaveNumber);

        let sizePrompt = prompt("Enter a map size as an integer between 1 - 6:");
        if (sizePrompt === null || sizePrompt === "") {
            alert("Invalid map size, please enter a integer between 1-6");
            return;
        } else {
            let parsedSize = parseInt(sizePrompt);

            if(!(parsedSize > 0 && parsedSize < 7)){
                alert("Invalid map size, please enter a integer between 1-6");
                return;
            }
            generateWorld(parsedSize);
        } 
    }

    function deleteMapClicked(mapSaveNumber){
        if(window.confirm(`Are you sure you want to delete save #${mapSaveNumber}`)) {
            localStorage.removeItem(`map${mapSaveNumber}`);
            localStorage.removeItem(`map${mapSaveNumber}Ai`);
            window.location.reload();
        }
    }
    

    function loadLocalSaves(){

        //this is the amount of saves we are supporting right now
        const numbers = [1, 2, 3, 4, 5];

        return numbers.map((number) => 
            <div key={number} className="saveBar">
                
                <p className="mapSaveFileText">Map {number}</p>

                {localStorage.hasOwnProperty(`map${number}`) ? (
                    <div className="saveControls">
                        <input type="button" value="Edit" className="navBtn inputButtonNoBorder" onClick={() => editMapClicked(number)}></input>
                        <input type="button" value="Delete" className="navBtn inputButtonNoBorder" onClick={() => deleteMapClicked(number)}></input>
                    </div>
                ) 
                :
                (
                    <div className="saveControls">
                        <input type="button" value="Generate" className="navBtn inputButtonNoBorder" onClick={() => generateMapClicked(number)}></input>
                    </div>
                )}

            </div>

                
            
        );
    }

    function backClicked(){
        setMap([]);
    }
  
    return (
        <div className = "Map-Editor"> 
            {map.length === 0 ? (
                <div className="preEditor">
                    <div className="preLoad">
                        <p className="mapSaveFileText centeredText" >Map Editor</p>
                        {loadLocalSaves()}
                    </div>
                </div>
                
            ) : (
                <>  
                    <div className="topBar">
                        <div className="editorControls">
                            <TileSelector selectedTile={selectedTile} updateSelectedTileType={updateSelectedTileType}/>
                            <SurfaceObjectSelector selectedTile={selectedTile} updateSelectedSurfaceObjectType={updateSelectedSurfaceObjectType}></SurfaceObjectSelector>
                            <button className={"navBtn inputButtonNoBorder Tile-Selector"  + (isDeleting ? ' selectedButton' : ' ')} onClick={deleteSurfaceObjectClicked}>{"Delete"}</button>
                        </div>
                    </div>
                    
                    <Map map={map}
                        backClicked={backClicked}
                        surfaceObjects={surfaceObjects}
                        isEditor={true}
                        selectedMapSaveNumber={selectedMapSaveNumber}
                        updateMapWithSelectedTile={updateMapWithSelectedTile}
                    />
                </>
            )}
        </div>
    );
}

export default MapEditor;
