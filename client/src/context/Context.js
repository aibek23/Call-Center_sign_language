import { createContext, useState,useContext, useEffect,useCallback } from 'react';
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
const useStopWatch = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const {request} = useHttp()
  const {token} = useContext(AuthContext)
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
      console.log("ok");
   await request('/api/time/seva', 'Post', {TIME: time}, {
        Authorization: `Bearer ${token}`
      })
    } catch (e) {}
  }, [token, request])


  
return (
  handleStart,handlePauseResume(),time,isActive,isPaused
);
};

export const ContextProvider = createContext({
  handleStart:useStopWatch,
})
