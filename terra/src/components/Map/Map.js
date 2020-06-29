import { Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Map.css';
import TileHandler from '../Tiles/TileHandler';

/*
    function updateMap(x, y){
        let newMap = [...props.map];
        newMap[x][y].active = !props.map[x][y].active;
        setMap(board => (newMap));
    }
  
    function clickCell(x, y){
        updateMap(x, y);
    }
    */

    //onClick={() => clickCell(element.x, element.y)}
    //style={{backgroundColor:element.active? "black" : "white"}}


function Map({map}) {
    console.log(map);

    return (
        <div className="Map">
            <div className="mapContainer">
                {map.map(function (item, i){
                let entry = item.map(function (element, j) {
                    return ( 
                            <TileHandler tileType={element.type} key={j}/>
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
