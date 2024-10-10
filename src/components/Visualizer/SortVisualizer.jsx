import React, {useState, useEffect, useCallback} from "react";
import {CgPlayPauseO} from "react-icons/cg";
import {BsFillPlayCircleFill} from "react-icons/bs";
import {IoPlayForward, IoPlayBack} from "react-icons/io5";
import { TiArrowShuffle } from "react-icons/ti";
import DB from "./DB/AlgoDB";
import PlayerState from "./playerState";
import * as StateHandler from "./stateHandler";
import swapsRegisterManager from "./swapsRegisterManager"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MathJax from 'react-mathjax2';

function generateRandomArray(numberOfElements){
    const array = [];
    for(let i = 0; i < numberOfElements; i++){
        array.push(randomInt(5,300));
    }
    return array;
}

function randomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function SortVisualizer(){
    const [array,setArray] = useState([]);
    const [numberOfElements, setNumberOfElements] = useState(10);
    const [animationSpeed, setAnimationSpeed] = useState(150);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swapsRegister, setSwapsRegister] = useState([[]]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [playerState, setPlayerState] = useState(new PlayerState());
    const [selectedOption, setSelectedOption] = useState('');
    const [options, setOptions] = useState([]);
    const [sortAlgorithm, setSortAlgorithm] = useState(null);
    const [algoInfo, setAlgoInfo] = useState({
        id: null,
        name: "",
        description: "",  
        code: "",
        complexity: ""
    }); 

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const db = new DB();
                await db.init();
                const algorithmNames = db.getNames();
                setOptions(algorithmNames);
            } catch (error) {
                console.error("Error while DB init", error);
            }
        };
        
        loadOptions();
    }, []);

    useEffect(() => {
        const fetchAlgoInfo = async () => {
            if (selectedOption !== "") {
                try {
                    const db = new DB();
                    await db.init();
                    const index = options.indexOf(selectedOption);
                    const data = db.getAll(index);
                    setAlgoInfo(data);
                } catch (error) {
                    console.error("Error fetching algorithm info:", error);
                }
            }
        };

        fetchAlgoInfo();
    }, [selectedOption, options]);



    const generateNewArray = useCallback(() => {
       const newArray = generateRandomArray(numberOfElements);
       setArray(newArray);
       setCurrentIndex(0);
       setIsAnimating(false);
       setSwapsRegister([newArray]);
    },[numberOfElements]);


    useEffect(()=>{
        generateNewArray();
    }, [generateNewArray]);
    
    swapsRegisterManager.loadSwapsRegister(array,setSwapsRegister,sortAlgorithm);
    swapsRegisterManager.swapManager(swapsRegister, playerState, setPlayerState, setIsAnimating, currentIndex, setCurrentIndex, animationSpeed);

    return(
        <>
            <div className="shadow-xl rounded-xl"> 
                <nav className="flex justify-between p-2 items-start">
                    <div className="flex items-center">
                        <div className="justify-start p-4 rounded-md transition ease-in-out delay-150 hover: -translate-y-1 hover:scale-110 duration-300">
                            <button className="text-black transition ease-in-out" onClick={() => {
                                if(playerState.get() == PlayerState.PAUSED || playerState.get() == PlayerState.INACTIVE){
                                    generateNewArray();
                                }
                            }}><TiArrowShuffle size={30}/></button>
                        </div>
                        
                        <form className="justify-start  p-4"> 
                            <select className="bg-white shadow-lg text-sm rounded-lg block w-full p-2.5 text-black transition ease-in-out delay-150 hover: -translate-y-1 hover:scale-110 duration-300"
                                onChange={StateHandler.handleAlgorithmChange(options,setSelectedOption,setCurrentIndex, setSortAlgorithm)} 
                                disabled={playerState.get() === PlayerState.PLAYING_FORWARD || playerState.get() === PlayerState.PLAYING_REVERSE} 
                            >
                                <option selected>Select an algorithm</option>
                                {options.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </form>
                    </div>
                    
                    <div className="flex items-center gap-4 justify-end">
                        <b className="w-20 text-right font-semibold">Elements:</b>
                        <div className="p-4">
                            <input type="range" min="5" max="100" value={numberOfElements} onChange={StateHandler.handleNumberOfElementChange(isAnimating,setNumberOfElements,generateNewArray)} disabled={isAnimating}></input>
                        </div>
                        <b className="w-20 text-right font-semibold">Speed:</b>
                        <div className="p-4">
                            <input type="range" min="800" max="1050" value={1100 - animationSpeed} onChange={StateHandler.handleAnimationSpeedChange(setAnimationSpeed)}></input>
                        </div>
                    </div>
                </nav>
                {swapsRegister.length > 1 && swapsRegister[currentIndex] && swapsRegister[currentIndex].map((value,index) =>{
                    let style = {height: `${value}px`};

                    if(currentIndex > 0 && value !== swapsRegister[currentIndex-1][index]){
                        style.backgroundColor = 'red';
                    }
                    
                    if(currentIndex === swapsRegister.length-1 && swapsRegister.length != 1){
                        style.backgroundColor = 'green';
                    }

                    return <div className="w-1 bg-black inline-block mx-[1px]" key={index} style={style}></div>

                })}

                <br></br>

                <nav className="flex p-2 justify-center h-16">
                    <div className="flex items-center text-center">
                        <button className="p-4 text-black" onClick={StateHandler.handleReverse(setPlayerState)}><IoPlayBack size={30}/></button>
                        
                        <button className="p-4 text-black" onClick={StateHandler.handlePlayPause(setPlayerState)}>
                                {playerState.get() !== PlayerState.PAUSED && playerState.get() !== PlayerState.INACTIVE ? <CgPlayPauseO size={50}/> : <BsFillPlayCircleFill size={50}/>}
                        </button>
                        
                        <button className="p-4 text-black" onClick={StateHandler.handleForward(setPlayerState)}><IoPlayForward size={30}/></button>
                    </div>
                </nav>
            </div>
            {selectedOption !== "" ? 
                <div className="mt-7 p-6 font-sans shadow-2xl rounded-xl">
                    <div className="max-w-4xl mx-auto rounded-lg p-6 flex gap-6 ">
                        <div className="flex-[2] min-w-[300px] shadow-xl rounded-lg h-fit">
                            <div className="rounded-lg p-4 h-full">
                                <h2 className="text-2xl font-semibold border-b border-gray-300 pb-2 mb-4">
                                    {algoInfo.name}:
                                </h2>
                                <div className="font-mono text-sm leading-relaxed space-y-4">
                                    <SyntaxHighlighter language="cpp" style={tomorrow} customStyle={{ backgroundColor: '#1a1a1a'}} showLineNumbers>
                                        {algoInfo.code}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-w-[200px] space-y-6">
                            <div className="shadow-md rounded-lg p-4">
                                <h2 className="text-xl text-left font-semibold border-b border-gray-300 pb-2">
                                    Complexity:
                                </h2>
                                <MathJax.Context
                                    input='tex'
                                    options={{
                                        tex: {
                                            inlineMath: [['$', '$'], ['\\(', '\\)']],
                                            processEscapes: true
                                        },
                                        displayMath: [['$$', '$$']],
                                    }}                                
                                >
                                    <div>
                                        <MathJax.Node>{algoInfo.complexity}</MathJax.Node>
                                    </div>
                                </MathJax.Context>
                            </div>

                            <div className="shadow-md rounded-lg p-4">
                                <h2 className="text-xl text-left font-semibold border-b border-gray-300 pb-2">
                                   Description:
                                </h2>
                                <p className="text-left">
                                    {algoInfo.description}
                                </p>                           
                            </div>
                        </div>
                    </div>
                </div>
            : null}   
        </>
    )
}

export default SortVisualizer;