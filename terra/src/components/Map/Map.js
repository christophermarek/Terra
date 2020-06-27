import { Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Map.css';

function Map() {

    const [mapSize, setSize] = useState(20);
    const [map, setMap] = useState([]);

    useEffect(() => {
        generateMap();
    });

    //generateMap from mapSize args
    function generateMap(){

        let newMap = [];
        
        for(let i = 0; i < mapSize; i++){
        let columns = [];
        for(let j = 0; j < mapSize; j++){
            
            columns.push(Grass());
        }
        newMap.push(columns);  
        }

        setMap(map => (newMap));
    };

    function updateMap(x, y){
        let newMap = [...map];
        newMap[x][y].active = !map[x][y].active;
        setMap(board => (newMap));
    }
  
    function clickCell(x, y){
        updateMap(x, y);
    }

    function Grass(){
        let defaultTile = {
            active:false,
            x: i,
            y: j,
            updated: false,
            type:"grass",
            color:"green",
        };
        return defaultTile;

    return (
        <div className="Map">
            <p>map</p>
            <div className="mapContainer">
                {map.map(function (item, i){
                let entry = item.map(function (element, j) {
                    if(element.type === "grass"){
                        <Grass />
                    }
                    return ( 
                        
                        
                        <div 
                            className="cellContainer" 
                            key={j}
                            onClick={() => clickCell(element.x, element.y)}
                            style={{backgroundColor:element.active? "black" : "white"}}
                            ></div>
                        );
                });
                return (
                    <div className="row" key={i}>{entry}</div>
                );
                })}
            </div>
        </div>
    );
}

export default Map;
