import React from 'react';

function Water({toggleBorder, x, y, updateMapWithSelectedTile, tileHover}) {
   let borderClass = toggleBorder ? "cell-border" : "no-border";
   let classname = "cellContainer water " + borderClass 
   return (
      <div
         className={classname}
         onClick={() => updateMapWithSelectedTile(x, y)}
         onMouseEnter={() => tileHover(x, y)}
      > 
      </div>
   );
}

export default Water;
