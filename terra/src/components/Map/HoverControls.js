import React from 'react';

function HoverControls({ mapHover, enableHover}) {

    return(
        <div className="Hover-Controls">
            <p>{mapHover}</p>
            <button onClick={enableHover}>Enable Hover Data</button>
        </div>
    );
}

export default HoverControls;
