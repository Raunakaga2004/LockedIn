import { useEffect, useState } from "react";
import { Howl } from "howler";
import alarmSound from "../../../assets/a.mp3"
import clickSound from "../../../assets/click.mp3"

let timeoutId : ReturnType<typeof setTimeout>;;

let shortBreakCount = 0;

interface TimerProps {
  pomomin: number;
  pomosec: number;
  shortmin: number;
  shortsec: number;
  longmin: number;
  longsec: number;
  focusSession: number;
  setbgcolor: React.Dispatch<React.SetStateAction<string>>;
  bgcolor: string;
}

export function Timer(props : TimerProps){
    const [timertype, setTimerType] = useState("Pomodoro");
    
    const [pomomin, setPomomin] = useState(props.pomomin);
    const [pomosec, setPomosec] = useState(props.pomosec);
    const [shortmin, setShortmin] = useState(props.shortmin);
    const [shortsec, setShortsec] = useState(props.shortsec);
    const [longmin, setLongmin] = useState(props.longmin);
    const [longsec, setLongsec] = useState(props.longsec);
    const [focusSession, setFocusSession] = useState(props.focusSession); 

    const curMin = ()=>{
        if(timertype == "Pomodoro") return pomomin;
        else if (timertype == "Short Break") return shortmin;
        else return longmin;
    }

    const curSec = ()=>{
        if(timertype == "Pomodoro") return pomosec;
        else if (timertype == "Short Break") return shortsec;
        else return longsec;
    }

    useEffect(()=>{

        console.log(props.pomomin);
        setPomomin(props.pomomin);
        setPomosec(props.pomosec);
        setShortmin(props.shortmin);
        setShortsec(props.shortsec);
        setLongmin(props.longmin);
        setLongsec(props.longsec);
        setFocusSession(props.focusSession);
    }, [props])

    const [Min, setMin] = useState(curMin);
    const [Sec, setSec] = useState(curSec);

    useEffect(() => {
        if(timertype === "Pomodoro"){
            setMin(pomomin);
            setSec(pomosec);
        } else if(timertype === "Short Break"){
            setMin(shortmin);
            setSec(shortsec);
        } else if(timertype === "Long Break"){
            setMin(longmin);
            setSec(longsec);
        }
    }, [pomomin, pomosec, shortmin, shortsec, longmin, longsec, timertype]);

    const [isTimerOn, setTimer] = useState(false);

    const alarm = new Howl({
        src: [alarmSound],
        volume: 1.0,
    });
    const click = new Howl({
        src: [clickSound],
        volume: 0.1,
        rate: 1.25
    });


    useEffect( ()=>{
        if(isTimerOn){
            if(Min > 0 || Sec>0){
                const updateSec = Sec>0 ? Sec-1 : 59;
                timeoutId = setTimeout(()=>{
                    setSec(updateSec); 
                    if(Sec == 0)
                        setMin(Min-1);
                },1000);
            }
            else{
                alarm.play();
                if(timertype == "Pomodoro"){
                    if(shortBreakCount == focusSession-1){
                        shortBreakCount = 0;
                        setTimerType("Long Break");
                    }
                    else{
                        shortBreakCount++;
                        setTimerType("Short Break");
                    }
                }
                else 
                    setTimerType("Pomodoro");
                
                setTimeout(()=>{
                    alarm.stop();
                },3000);
            }
        }
        else{
            clearTimeout(timeoutId);
        }
    },[Sec, Min, isTimerOn])

    useEffect(()=>{
        setMin(curMin);
        setSec(curSec);
    },[timertype])

    useEffect(()=>{
        if(timertype == "Pomodoro") props.setbgcolor("#CE4257");
        else if(timertype == "Long Break") props.setbgcolor("#1E6091");
        else props.setbgcolor("#0A9396");
        
    },[timertype])
    
    return <div className="text-white flex flex-col bg-neutral-900/20 rounded-xl justify-between select-none p-6 lg:w-[35vw] lg:h-[42vh] md:w-[55vw] md:h-[35vw] h-[35vh] w-[95vw]">
        <div className="flex flex-row md:text-[18px] gap-6 justify-center">
            <button onClick={()=>{setTimerType("Pomodoro"); setTimer(false); setMin(pomomin); setSec(pomosec)}} className={`${timertype == "Pomodoro" ? "bg-neutral-900/40 pl-1.5 pr-1.5 p-0.5 rounded-sm" : "border-0"}`}>Pomodoro</button>
            <button onClick={()=>{setTimerType("Short Break"); setTimer(false); setMin(shortmin); setSec(shortsec)}} className={`${timertype == "Short Break" ? "bg-neutral-900/40 pl-1.5 pr-1.5 p-0.5 rounded-sm" : "border-0"}`}>Short Break</button>
            <button onClick={()=>{setTimerType("Long Break"); setTimer(false); setMin(longmin); setSec(longsec)}} className={`${timertype == "Long Break" ? "bg-neutral-900/40 pl-1.5 pr-1.5 p-0.5 rounded-sm" : "border-0"}`}>Long Break</button>
        </div>
        
        <div className="md:text-9xl text-8xl font-bold text-center py-2">
            {`${Min < 10 ? "0" : ""}${Min} : ${Sec < 10 ? "0" : ""}${Sec}`}
        </div>
        
        <div className="flex justify-center items-center pb-2">
            <button onClick={()=>{setTimer(!isTimerOn); click.play()}} style={{color : props.bgcolor}} className={`${isTimerOn ? "mt-4" : "border-b-5 mt-3 border-slate-300" } px-10 bg-white font-semibold text-2xl py-1 rounded-md` }>{isTimerOn ? "PAUSE" : "START"}</button>
            
            {isTimerOn ? <button onClick={()=>changeTimer()} className="absolute translate-x-[120px] translate-y-[5px]">
                <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-12 w-12">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                    </svg>
                </div>
            </button> : null}
        </div>
        
        <div className="flex justify-center items-center">
            <button onClick={()=>{setTimer(false); click.play(); setMin(curMin); setSec(curSec);}} className={`text-white text-sm text-center bg-neutral-900/20 rounded-sm font-semibold py-1 px-2 `}>RESET</button>
        </div>
        
    </div>

    function changeTimer(){
        if(timertype == "Pomodoro"){
            if(shortBreakCount == focusSession-1){
                setTimerType("Long Break");
                shortBreakCount = 0;
            }
            else{ 
                setTimerType("Short Break");
                shortBreakCount++;
            }
        }
        else
            setTimerType("Pomodoro");

        setTimer(false);
    }
}