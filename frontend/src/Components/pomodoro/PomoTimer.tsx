import { useState } from "react";
import { Timer } from "./components/Timer";

export default function PomoTimer() {
  // const [bgcolor, setbgcolor] = useState("");

  const [setting, setSetting] = useState(false);

  // timer setting variables
  const [pomoMin, setPomoMin] = useState(25);
  const [pomoSec, setPomoSec] = useState(0);

  const [shortMin, setShortMin] = useState(5);
  const [shortSec, setShortSec] = useState(0);

  const [longMin, setLongMin] = useState(15);
  const [longSec, setLongSec] = useState(0);

  const [focusSession, setFocusSession] = useState<number>(4);

  const handleSettingsButton = ()=>{
    setSetting(true);
  }

  const handleCloseSetting = ()=>{
    setSetting(false);
  }

  return (
    <div className={`flex flex-col justify-center items-center`}>

      {/* Settings */}
      {setting && <>
        <div className='absolute bg-white min-h-[300px] max-h-[300px] max-w-[300px] min-w-[300px] z-3 rounded-lg p-6'>
          <div className='' onClick={handleCloseSetting}>
            <svg className="w-6 h-6 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
          </div>

          {/* content of setting */}
          <div className='text-center text-xs mb-[30px]'>
            Set the time according to your desire and then close the menu
          </div>
          <div className='flex flex-col justify-center gap-5'>
            <label className='flex justify-between'>
              Pomodoro
              <input type='number' defaultValue={pomoMin} className='w-[30px]  bg-slate-100 rounded-lg text-center outline-none border-b-2 border-r-2 border-slate-400' onChange={(e)=>{
                if(typeof e.target.value == 'number' && e.target.value >= 0)
                  setPomoMin(e.target.value)}}/>
              :
              <input type='number'defaultValue={pomoSec} className='w-[30px]  bg-slate-100 rounded-lg text-center outline-none border-b-2 border-r-2 border-slate-400' onChange={(e)=> {
                if(typeof e.target.value == 'number' && e.target.value < 60 && e.target.value >= 0)
                  setPomoSec(e.target.value)}}/>
            </label>

            <label className='flex justify-between'>
              Short Rest
              <input type='number' defaultValue={shortMin} className='w-[30px]  bg-slate-100 rounded-lg text-center outline-none border-b-2 border-r-2 border-slate-400' onChange={(e)=>{
                if(typeof e.target.value == 'number' && e.target.value >= 0)
                  setShortMin(e.target.value)}}/>
              :
              <input type='number'defaultValue={shortSec} className='w-[30px]  bg-slate-100 rounded-lg text-center outline-none border-b-2 border-r-2 border-slate-400' onChange={(e)=>{
                if(typeof e.target.value == 'number' && e.target.value < 60 && e.target.value >= 0)
                  setShortSec(e.target.value)}}/>
            </label>

            <label className='flex justify-between'>
              Long Rest
              <input type='number' defaultValue={longMin} className='w-[30px]  bg-slate-100 rounded-lg text-center outline-none border-b-2 border-r-2 border-slate-400' onChange={(e)=>{
                if(typeof e.target.value == 'number' && e.target.value >= 0)
              setLongMin(e.target.value)}}/>
              :
              <input type='number'defaultValue={longSec} className='w-[30px]  bg-slate-100 rounded-lg text-center outline-none border-b-2 border-r-2 border-slate-400' onChange={(e)=>{
                if(typeof e.target.value == 'number' && e.target.value < 60 && e.target.value >= 0)
                  setLongSec(e.target.value)}}/>
            </label>

            <label className='flex justify-between'>
              Number of focus Session before Long break
              <input type='number'defaultValue={focusSession} className='w-[30px]  bg-slate-100 rounded-lg text-center outline-none border-b-2 border-r-2 border-slate-400' onChange={(e)=>setFocusSession(parseInt(e.target.value))}/>
            </label>
          </div>

        </div>
      </>}
  
      <Timer pomomin={pomoMin} pomosec={pomoSec} shortmin={shortMin} shortsec={shortSec} longmin={longMin} longsec={longSec} focusSession={focusSession}/>

      <div className='text-2 right-0' onClick={handleSettingsButton}>
        Setting
      </div>
    </div>
  )
}