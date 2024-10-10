import { useEffect } from 'react';
import PlayerState from './playerState'; 

const swapManager = (swapsRegister, playerState, setPlayerState, setIsAnimating, currentIndex, setCurrentIndex, animationSpeed) => {
    useEffect(() => {
        if (playerState.get() === PlayerState.PLAYING_FORWARD || playerState.get() === PlayerState.PLAYING_REVERSE && swapsRegister.length > 1) {
            setIsAnimating(true);
            const timer = setInterval(() => {
                if (playerState.get() !== PlayerState.PLAYING_REVERSE) {
                    if (currentIndex < swapsRegister.length - 1) {
                        setCurrentIndex(currentIndex + 1);
                    } else {
                        setIsAnimating(false);
                        let newState = new PlayerState();
                        Object.assign(newState, playerState);
                        newState.pause();
                        setPlayerState(newState);
                    }
                } else {
                    if (currentIndex > 0) {
                        setCurrentIndex(currentIndex - 1);
                    } else {
                        setIsAnimating(false);
                        let newState = new PlayerState();
                        Object.assign(newState, playerState);
                        newState.pause();
                        setPlayerState(newState);
                    }
                }
            }, animationSpeed);

            return () => clearInterval(timer);
        }
    });
};

const loadSwapsRegister = (array, setSwapsRegister, sortAlgorithm) => {
    useEffect(()=>{
        if(array !== null &&  typeof sortAlgorithm === 'function'){
            const newSwapsRegister = sortAlgorithm([...array]);
            setSwapsRegister([array, ...newSwapsRegister]);
        }else{
            setSwapsRegister([array]);
        }
    }, [array, sortAlgorithm]);
}

export default {swapManager, loadSwapsRegister};