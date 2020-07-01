import React from 'react';

function Grass({toggleBorder, x, y, updateMapWithSelectedTile, tileHover}) {
   let borderClass = toggleBorder ? "cell-border" : "no-border";
   let classname = "cellContainer grass " + borderClass 
   return (
      <div
         className={classname}
         onClick={() => updateMapWithSelectedTile(x, y)}
         onMouseEnter={() => tileHover(x, y)}
      > 
      </div>
   );
}

export default Grass;
