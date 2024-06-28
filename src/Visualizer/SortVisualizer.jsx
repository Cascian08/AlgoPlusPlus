import React, {useState, useEffect} from "react";
import BubbleSort from "./Algorithms/SortingAlgorithms/BubbleSort"
import QuickSort from "./Algorithms/SortingAlgorithms/QuickSort";
import {CgPlayPauseO} from "react-icons/cg";
import {BsFillPlayCircleFill} from "react-icons/bs";
import {IoPlayForward, IoPlayBack} from "react-icons/io5";
import { TiArrowShuffle } from "react-icons/ti";
//import "./SortVisualizer.css"

function generateRandomArray(numberOfElements){
    const array = [];
    for(let i = 0; i < numberOfElements; i++){
        array.push(randomInt(5, 300));
    }
    return array;
}

function randomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function SortVisualizer(){
    const [array,setArray] = useState([]);
    const [numberOfElements, setNumberOfElements] = useState(10);
    const [animationSpeed, setAnimationSpeed] = useState(200);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swapsRegister, setSwapRegister] = useState([[]]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBackPlaying, setIsBackPlaying] = useState(false);


    //Generates a random array;
    useEffect(()=>{
        setArray(generateRandomArray(numberOfElements));
    }, [numberOfElements])

    //Starts animation and sort and fills setSwapRegister with all the swaps;
    useEffect(()=>{
        //TODO: You should probably sort only if isPlaying is true;
        setSwapRegister(QuickSort([...array]));         
    }, [array])

    
    //If Play button is clicked it's going to start the "animation".
    useEffect(()=>{
        if(isPlaying){
            if(isBackPlaying === false){
                setIsAnimating(true);
                const timer = setInterval(()=>{
                    if(currentIndex < swapsRegister.length - 1){
                        setCurrentIndex(currentIndex+1);
                    }else{
                        setIsAnimating(false);
                        setIsPlaying(false);
                    }
                }, animationSpeed);

                return() => {
                    clearInterval(timer);
                };
            }else{
                setIsAnimating(true);
                const timer = setInterval(() =>{
                    if(currentIndex > 0){
                        setCurrentIndex(currentIndex - 1);
                    }else{
                        setIsAnimating(false);
                        setIsPlaying(false);
                    }
                }, animationSpeed);

                return() => {
                    clearInterval(timer);
                };
            }
        }
    }, [swapsRegister,isPlaying, setIsPlaying, setCurrentIndex,currentIndex]);

    const handleNumberOfElementsChange = (event) => {
        if(!isAnimating) {
            setNumberOfElements(event.target.value);
            setArray(generateRandomArray(event.target.value));
            setCurrentIndex(0);
        }
    }
    
    const handleAnimationSpeedChange = (event) =>{
        const newSpeed = 1100 - event.target.value;
        setAnimationSpeed(newSpeed);
    }

    return(
        <>
            <div className="array-container"> 
                <nav className="flex justify-between p-2">
                    <div className="justify-start p-4 border border-slate-950 rounded-md transition ease-in-out delay-150 hover: -translate-y-1 hover:scale-110 duration-300">
                        <button className="text-black transition ease-in-out" onClick={() => {
                            if(!isAnimating){
                                setArray(generateRandomArray(numberOfElements));
                                setCurrentIndex(0);
                            }
                        }}><TiArrowShuffle size={30}/></button> {/*<TiArrowShuffle size={30}/>*/}
                    </div>

                    <div className=" flex justify-end">
                        <div className="p-4 "> {/*numberOfElements-slider-container*/}
                            <input type="range" min="5" max="100" value={numberOfElements} onChange={handleNumberOfElementsChange} disabled={isAnimating}></input>
                        </div>
                
                        <div className="p-4">{/*animationSpeed-slider-container*/}
                            <input type="range" min="100" max="1050" value={1100 - animationSpeed} onChange={handleAnimationSpeedChange}></input>
                        </div>
                    </div>
                </nav>
                {swapsRegister[currentIndex] && swapsRegister[currentIndex].map((value,index) =>{
                    let style = {height: `${value}px`, backgroundColor: "black"};

                    if(currentIndex > 0 && value !== swapsRegister[currentIndex-1][index]){
                        style.backgroundColor = 'red';
                    }
                    
                    if(currentIndex === swapsRegister.length-1){
                        style.backgroundColor = 'green';
                    }

                    return <div className="w-1 bg-white inline-block mx-[1px]" key={index} style={style}></div>

                })}
                <br></br>

                <nav className="flex p-2 justify-center h-16">
                    <div className="flex items-center text-center">
                        <button className="p-4 text-black" onClick={() => setIsBackPlaying(true)}><IoPlayBack size={30}/></button>
                        <button className="p-4 text-black" onClick={() => {isPlaying ? setIsPlaying(false):setIsPlaying(true)}}>{isPlaying ? <CgPlayPauseO size={50}/>:<BsFillPlayCircleFill size={50}/>}</button>
                        <button className="p-4 text-black" onClick={() => setIsBackPlaying(false)}><IoPlayForward size={30}/></button>
                    </div>
                 </nav>
            </div>
        </>
    )
}

export default SortVisualizer;