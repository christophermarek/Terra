import React from 'react';

function HoverControls({ mapHover, enableHover}) {

    return(
        <>
            <p>{mapHover}</p>
            <button className="button" onClick={enableHover}>Enable Hover Data</button>
        </>
    );
}

export default HoverControls;
