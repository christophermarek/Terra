import React from 'react';

function Bush({toggleBorder, x, y, updateMapWithSelectedTile, tileHover}) {
   let borderClass = toggleBorder ? "cell-border" : "no-border";
   let classname = "cellContainer bush " + borderClass 
   return (
      <div
         className={classname}
         onClick={() => updateMapWithSelectedTile(x, y)}
         onMouseEnter={() => tileHover(x, y)}
      > 
      </div>
   );
}

export default Bush;
