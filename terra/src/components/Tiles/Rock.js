import React from 'react';

function Rock({toggleBorder, x, y, updateMapWithSelectedTile, tileHover}) {
   let borderClass = toggleBorder ? "cell-border" : "no-border";
   let classname = "cellContainer rock " + borderClass 
   return (
      <div
         className={classname}
         onClick={() => updateMapWithSelectedTile(x, y)}
         onMouseEnter={() => tileHover(x, y)}
      > 
      </div>
   );
}

export default Rock;
