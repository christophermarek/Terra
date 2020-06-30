import React from 'react';

function Tree({toggleBorder, x, y}) {
   let borderClass = toggleBorder ? "cell-border" : "no-border";
   let classname = "cellContainer tree " + borderClass 
   return (
      <div
         className={classname}
      > 
      </div>
   );
}

export default Tree;
