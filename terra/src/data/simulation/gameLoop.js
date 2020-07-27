

export function gameLoop(){

    console.log("hi");

    //calls loop again
    window.requestAnimationFrame(gameLoop);
}