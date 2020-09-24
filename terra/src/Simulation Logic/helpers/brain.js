export function getBrainObjectById(id, brain){
    let brainCopy = [...brain];
    let brainObjCopy = false;

    for(let i = 0; i < brainCopy.length; i++){
        if(brainCopy[i].surfaceObjectId === id){
            brainObjCopy = brainCopy[i];
        }    
    }

    return brainObjCopy;
}

export function deleteBrainObjById(arr, id){
    let brainCopy = arr;
    let index = 0;

    for(let i = 0; i < brainCopy.length; i++){
        if(brainCopy[i].surfaceObjectId === id){
            index = i;
        }    
    }
    
    brainCopy.splice(index, 1); 

    return brainCopy;
}