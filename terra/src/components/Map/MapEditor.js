import Map from './Map';
import React, { useState, useEffect } from 'react';

function MapEditor() {

    const [mapSize, setSize] = useState(20);
    const [map, setMap] = useState([]);

    useEffect(() => {
        
    });

    function Grass(x, y){
        let defaultTile = {
            active:false,
            x: x,
            y: y,
            updated: false,
            type:"grass",
            color:"green",
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
                    <p>Map</p>
                    <Map map={map}/>
                </>
            )}
        </div>
    );
}

export default MapEditor;
