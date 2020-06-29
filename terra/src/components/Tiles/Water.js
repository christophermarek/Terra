import React from 'react';

function Water({toggleBorder, x, y, updateMapWithSelectedTile}) {
   let borderClass = toggleBorder ? "cell-border" : "no-border";
   let classname = "cellContainer water " + borderClass 
   return (
      <div
         className={classname}
         onClick={() => updateMapWithSelectedTile(x, y)}
      > 
      </div>
   );
}

export default Water;
