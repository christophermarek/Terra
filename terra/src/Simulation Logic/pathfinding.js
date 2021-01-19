
export function startSearch(self, target, map, surfaceObjects, planner){
    //Find path
    let path = [];
    let fixedPath = [];

    planner.search(self.x,self.y,  target.x,target.y, path);

    //format to {x, y} object
    for(let i = 0; i < path.length; i+= 2){
        let parsedX = path[i];
        let parsedY = path[i+1]; 
        fixedPath.push({x: parsedX, y: parsedY});
    }
    
    return fixedPath;
    
}