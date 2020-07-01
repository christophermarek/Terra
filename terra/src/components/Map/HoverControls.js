import React from 'react';

function HoverControls({surfaceHover, mapHover, enableHover}) {

    return(
        <div className="Hover-Controls">
            <p>{surfaceHover + " " + mapHover}</p>
            <button onClick={enableHover}>Enable Hover Data</button>
        </div>
    );
}

export default HoverControls;
