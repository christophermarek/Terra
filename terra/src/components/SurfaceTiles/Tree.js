import React from 'react';

function Tree({toggleBorder, x, y, updateMapWithSelectedTile}) {
   let borderClass = toggleBorder ? "cell-border" : "no-border";
   let classname = "cellContainer tree " + borderClass 
   return (
      <div
         className={classname}
         onClick={() => updateMapWithSelectedTile(x, y)}
      > 
      </div>
   );
}

export default Tree;
