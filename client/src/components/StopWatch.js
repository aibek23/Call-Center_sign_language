
import React, { createContext, useState,useContext, useEffect,useCallback } from 'react';
import {useHttp} from '../hooks/http.hook'
import {Context} from '../context/Context'
// import "./StopWatch.css";
import Timer from "./Timer";
import ControlButtons from "./ControlButtons";
  
function StopWatch(props) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(1515);
  const {loading, request} = useHttp()
  const {token} = useContext(Context)
  useEffect(() => {
    let interval = null;
  
    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);
  
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    console.log("start");
  };
  
  const handlePauseResume = useCallback(async () => {
    try {
      const data = await request('/api/time/save', 'POST', {time:time}, {
        Authorization: `Bearer ${token}`
      })
      console.log(data,"ok");
    } catch (e) {console.log(e);}
  }, [token, request])


  
  return (
    <div className="stop-watch">
      <Timer time={time} />
      <ControlButtons
        active={isActive}
        isPaused={isPaused}
        handleStart={handleStart}
        handlePauseResume={handlePauseResume}
      />
    </div>
  );
}
  
export default StopWatch;