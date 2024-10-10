import algoList from "./Algorithms/SortingAlgorithmList";
import PlayerState from "./playerState";

const handleNumberOfElementChange = 
    (isAnimating, setNumberOfElements, generateNewArray) => (event) => {
    if(!isAnimating){
        setNumberOfElements(event.target.value);
        generateNewArray();
    }
}

const handleAnimationSpeedChange = (setAnimationSpeed) => (event) =>{
    const newSpeed = 1100 - event.target.value;
    setAnimationSpeed(newSpeed)
}



const handleAlgorithmChange = (options, setSelectedOption, setCurrentIndex, setSortAlgorithm) => (event) => {
    if(options.includes(event.target.value)){
        setSelectedOption(event.target.value);
        setCurrentIndex(0);
        setSortAlgorithm(() => algoList(event.target.value));
    }
}

const handleReverse = (setPlayerState) => () =>{
    setPlayerState(prevState => {
        const newState = new PlayerState(); 
        Object.assign(newState, prevState);
        newState.reverse();
        return newState;
    });
}

const handlePlayPause = (setPlayerState) => () => { 
    setPlayerState((prevState) => {
        const newState = new PlayerState();
        Object.assign(newState, prevState);
    
        if(newState.get() === PlayerState.PLAYING_FORWARD || newState.get() === PlayerState.PLAYING_REVERSE){
            newState.pause();
        }else if(newState.get() === PlayerState.PAUSED || newState.get() === PlayerState.INACTIVE){
            newState.play();
        }else{
            newState.pause();
        }
        
        return newState;
    });
};

const handleForward = (setPlayerState) => () => {
    setPlayerState(prevState => {
        const newState = new PlayerState();
        Object.assign(newState, prevState);
        newState.forward();
        return newState;
    });
};

export {
    handleAnimationSpeedChange, 
    handleNumberOfElementChange, 
    handleAlgorithmChange,
    handleReverse,
    handlePlayPause,
    handleForward
};