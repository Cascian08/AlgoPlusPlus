import React, {useState, useEffect, useCallback} from "react";
import BubbleSort from "./Algorithms/SortingAlgorithms/BubbleSort";
import QuickSort from "./Algorithms/SortingAlgorithms/QuickSort";
import MergeSort from "./Algorithms/SortingAlgorithms/MergeSort";
import InsertionSort from "./Algorithms/SortingAlgorithms/InsertionSort";
import {CgPlayPauseO} from "react-icons/cg";
import {BsFillPlayCircleFill} from "react-icons/bs";
import {IoPlayForward, IoPlayBack} from "react-icons/io5";
import { TiArrowShuffle } from "react-icons/ti";
import initSqlJs from "sql.js";

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
    
    class PlayerState {
        static INACTIVE = "Inactive";
        static PLAYING_FORWARD = "Playing forward";
        static PLAYING_REVERSE = "Playing reverse";
        static PAUSED = "Paused";

        constructor(){
            this.state = PlayerState.INACTIVE;
            this.lastDirection = PlayerState.PLAYING_FORWARD;
        }

        play(){
            this.state = this.lastDirection;
        }

        pause(){
            if(this.state !== PlayerState.PAUSED){
                this.lastDirection = this.state;
                this.state = PlayerState.PAUSED;
            }else{
                this.state = this.lastDirection;
            }
        }

        reverse(){
            this.state = PlayerState.PLAYING_REVERSE;
            this.lastDirection = PlayerState.PLAYING_REVERSE;
        }

        forward(){
            this.state = PlayerState.PLAYING_FORWARD;
            this.lastDirection = PlayerState.PLAYING_FORWARD;
        }

        get(){
            return this.state;
        }
    }

    class DB{
        constructor() {
            this.SQL = null;
            this.db = null;
            this.isOpen = true;
        }

        async init() {
            this.SQL = await initSqlJs({
                locateFile: file => `https://sql.js.org/dist/${file}`
            });
            this.response = await fetch('AlgoDB/AlgoDB.sqlite');
            this.arrayBuffer = await this.response.arrayBuffer();
            
            this.db = new this.SQL.Database(new Uint8Array(this.arrayBuffer));
        }

        getNames() {
            const result = this.db.exec("SELECT name FROM ALGORITHMS");
            this.db.close();
            return result[0] ? result[0].values.map(row => row[0]) : [];
        }

        getAll(rowIndex) {
            const result = this.db.exec("SELECT * FROM ALGORITHMS");
            this.db.close();
            
            const algoInfo = {
                id: result[0].values[rowIndex][0], 
                name: result[0].values[rowIndex][1], 
                action: result[0].values[rowIndex][2], 
                description: result[0].values[rowIndex][3], 
                code: result[0].values[rowIndex][4], 
                complexity: result[0].values[rowIndex][5]
            };
            
            return algoInfo;
        }
        
        isDbOpen(){
            return this.isOpen;
        }

        closeDb(){
            if(this.db){
                this.db.close();
                this.isOpen = false;
            }
        }
    }
    const [playerState, setPlayerState] = useState(new PlayerState());
    const [selectedOption, setSelectedOption] = useState('');
    const [options, setOptions] = useState([]);
    const [sortAlgorithm, setSortAlgorithm] = useState(null);

    useEffect(() =>{
        const fetchAlgorithmsList = async() =>{
            const db = new DB();
            await db.init();
            const names = db.getNames();
            //Filter out null or empty names;
            setOptions(names.filter(name => name !== null && name !== ""));
        };
        fetchAlgorithmsList();
    },[]);
    
    const generateNewArray = useCallback(() => {
       const newArray = generateRandomArray(numberOfElements);
       setArray(newArray);
       setCurrentIndex(0);
       setSwapsRegister([newArray]);
    },[numberOfElements]);

    //Generates a random array;
    useEffect(()=>{
        generateNewArray();
    }, [generateNewArray]);

    //Starts animation,sorts and fills setSwapRegister with all the swaps;
    useEffect(()=>{
        if(array !== null &&  typeof sortAlgorithm === 'function'){
            const newSwapsRegister = sortAlgorithm([...array]);
            setSwapsRegister([array, ...newSwapsRegister]);
        }else{
            setSwapsRegister([array]);
        }
    }, [array, sortAlgorithm]);

    
    //If Play button is clicked it's going to start the "animation".
    useEffect(()=>{
        if(playerState.get() == PlayerState.PLAYING_FORWARD || playerState.get() == PlayerState.PLAYING_REVERSE && swapsRegister.length > 1){
            setIsAnimating(true);
            const timer = setInterval(() => {
                if(playerState.get() !== PlayerState.PLAYING_REVERSE){
                    if(currentIndex < swapsRegister.length - 1){
                        setCurrentIndex(currentIndex + 1);
                    }else{
                        setIsAnimating(false);
                        let newState = new PlayerState();
                        Object.assign(newState, playerState);     
                        newState.pause();
                        setPlayerState(newState);
                    } 
                }else{
                    if(currentIndex > 0){
                        setCurrentIndex(currentIndex - 1);
                    }else{
                        setIsAnimating(false);
                        let newState = new PlayerState();
                        Object.assign(newState, playerState);
                        newState.pause();
                        setPlayerState(newState);
                    }
                }
            }, animationSpeed);

            return () => {
                clearInterval(timer);
            }
        }
    }, [swapsRegister, playerState, setCurrentIndex,currentIndex]);


    const handleNumberOfElementsChange = (event) => {
        if(!isAnimating) {
            setNumberOfElements(event.target.value);
            generateNewArray();
        }
    }
    //TODO: Adjust animation speed;
    const handleAnimationSpeedChange = (event) =>{
        const newSpeed = 1100 - event.target.value;
        setAnimationSpeed(newSpeed);
    }
    
    const handleAlgorithmChange = async (event) => {
        const db = new DB();
        await db.init();
    
        if (options.includes(event.target.value)) {
            const index = options.indexOf(event.target.value);
            setSelectedOption(event.target.value);
            // Check if the database is open before proceeding
            if (db.isDbOpen()) {
                setCurrentIndex(0);
                try {
                    const action = db.getAll(index).action;
                    setSortAlgorithm(() => eval(action));
                } catch (error) {
                    console.error("Error retrieving action from database:", error);
                }
            } else {
                console.error("Database is closed.");
            }
        }
    };

    const handlePlayPause = () => { 
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
    
    const handleReverse = () =>{
        setPlayerState(prevState => {
            const newState = new PlayerState();
            Object.assign(newState, prevState);
            newState.reverse();
            return newState;
        });
    };
    
    const handleForward = () =>{
        setPlayerState(prevState => {
            const newState = new PlayerState();
            Object.assign(newState, prevState);
            newState.forward();
            return newState;
        });
    };
    
    return(
        <>
            <div className="shadow-2xl rounded-xl"> 
                <nav className="flex justify-between p-2 items-start">{/*NavBar*/}
                    <div className="flex items-center">
                        <div className="justify-start p-4 rounded-md transition ease-in-out delay-150 hover: -translate-y-1 hover:scale-110 duration-300">
                            <button className="text-black transition ease-in-out" onClick={() => {
                                if(playerState.get() == PlayerState.PAUSED || playerState.get() == PlayerState.INACTIVE){
                                    generateNewArray();
                                }
                            }}><TiArrowShuffle size={30}/></button>
                        </div>
                        
                        <form className="justify-start  p-4"> {/*DropDown menu*/}
                            <select className="bg-white shadow-lg text-sm rounded-lg block w-full p-2.5 text-black transition ease-in-out delay-150 hover: -translate-y-1 hover:scale-110 duration-300"
                                onChange={handleAlgorithmChange} 
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
                    
                    <div className="flex justify-end">
                        <div className="p-4 "> {/*numberOfElements-slider-container*/}
                            <input type="range" min="5" max="100" value={numberOfElements} onChange={handleNumberOfElementsChange} disabled={isAnimating}></input>
                        </div>
                
                        <div className="p-4">{/*animationSpeed-slider-container*/}
                            <input type="range" min="800" max="1050" value={1100 - animationSpeed} onChange={handleAnimationSpeedChange}></input>
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
                        <button className="p-4 text-black" onClick={handleReverse}><IoPlayBack size={30}/></button>
                        
                        <button className="p-4 text-black" onClick={handlePlayPause}>
                                {playerState.get() !== PlayerState.PAUSED && playerState.get() !== PlayerState.INACTIVE ? <CgPlayPauseO size={50}/> : <BsFillPlayCircleFill size={50}/>}
                        </button>
                        
                        <button className="p-4 text-black" onClick={handleForward}><IoPlayForward size={30}/></button>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default SortVisualizer;