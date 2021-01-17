import React, { useState } from 'react';
import Map from '../Map/Map';
import { updateSurfaceObjects } from '../../Simulation Logic/update'; 

import './styles.css';
import { getGrid } from '../../Simulation Logic/grid';

function Simulation() {

    const [map, setMap] = useState([]);
    const [surfaceObjects, setSurfaceObjects] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [started, setStarted] = useState(false);
    const [requestAnimationFrameID, setRequestAnimationFrameID] = useState(undefined); 
    const [brain, setBrain] = useState([]);
    const [selectedMapSaveNumber, setSelectedMapSaveNumber] = useState(0);

    let secondsPassed = 0;
    let oldTimeStamp = 0;

    function mapLoaded(){
        setIsLoaded(true);
    }

    function loadMapClicked(mapSaveNumber){
        setSelectedMapSaveNumber(mapSaveNumber);

        let mapData = window.localStorage.getItem(`map${mapSaveNumber}`);
        let data = JSON.parse(mapData);
        setMap(map => (data.mapData));
        setSurfaceObjects(surfaceObjects => (data.surfaceData));

        let aiData = JSON.parse(window.localStorage.getItem(`map${mapSaveNumber}Ai`));
        setBrain(aiData);
        mapLoaded();
    }

    function deleteMapClicked(mapSaveNumber){
        if(window.confirm(`Are you sure you want to delete save #${mapSaveNumber}`)) {
            localStorage.removeItem(`map${mapSaveNumber}`);
            localStorage.removeItem(`map${mapSaveNumber}Ai`);
            window.location.reload();
          }
    }

    function startClicked(){

        setStarted(!started);

        if(started){
            stopLoop();
        }
        if(!started){
            startLoop();
        }
        
       
    }

    function startLoop(){
        if(!requestAnimationFrameID){
            setRequestAnimationFrameID(window.requestAnimationFrame(gameLoop));
        }
    }

    function stopLoop(){
        if (requestAnimationFrameID) {
            window.cancelAnimationFrame(requestAnimationFrameID);
            setRequestAnimationFrameID(undefined);
         }
    }

    function update(secondsPassed){

        let update = updateSurfaceObjects(secondsPassed, map, surfaceObjects, brain, getGrid(map, surfaceObjects));
        setBrain(brain => (update.brain));
        setSurfaceObjects(surfaceObjects => (update.surfaceObjects));

    }

    function gameLoop(timeStamp){
        setRequestAnimationFrameID(undefined);

        //we can slow down time or speed up this time by multiplying it by a modifier
        let seconds = (timeStamp - oldTimeStamp) / 1000;

        //global vars defined at top, not state vars
        secondsPassed = seconds;

        //limit time skip on pause/start
        secondsPassed = Math.min(secondsPassed, 0.1);
        oldTimeStamp = timeStamp;

        //
        
        update(secondsPassed);
        
        //

        startLoop();

    }
    
    function loadLocalSaves(){

        //this is the amount of saves we are supporting right now
        const numbers = [1, 2, 3, 4, 5];

        return numbers.map((number) => 
            <div key={number} className="saveBar">
                
                <p className="mapSaveFileText">Map {number}</p>

                {localStorage.hasOwnProperty(`map${number}`) ? (
                    <div className="saveControls">
                        <input type="button" className="navBtn inputButtonNoBorder" value="Load" onClick={() => loadMapClicked(number)}></input>
                        <input type="button" className="navBtn inputButtonNoBorder" value="Delete" onClick={() => deleteMapClicked(number)}></input>
                    </div>
                ) 
                :
                (
                    <p className="mapFileSupportingText">does not exist.</p>
                )}

            </div>

                
            
        );
    }

    function backClicked(){
        setIsLoaded(false);
        //pause
        if(started){
            startClicked();
        }
    }

    return(
        <div className="Simulation">
            {!isLoaded ? (
                <div className="loading">

                    <div className="loadPreset">
                        <p className={"mapSaveFileText centeredText"}>Simulation</p>
                        {loadLocalSaves()}
                    </div>
                    
                </div>
            ) : (
                <>
                    <Map map={map}
                         surfaceObjects={surfaceObjects}
                         startClicked={startClicked}
                         started={started}
                         isEditor={false}
                         brain={brain}
                         backClicked={backClicked}
                         selectedMapSaveNumber={selectedMapSaveNumber}
                    />
                    
                </>
            )}

            
        </div>
    );

}

export default Simulation;
