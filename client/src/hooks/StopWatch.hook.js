import {useState, useEffect ,useContext } from 'react';
import {toast} from 'react-toastify'
import {Context} from '../context/Context'
import { useHttp } from './http.hook';
export  const useStopWatch = (initialState = 0) => {
    const {request, error, clearError} = useHttp();
    const auth = useContext(Context)
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(initialState);
    
    useEffect(() => {
      let interval = null;
      if (isActive && isPaused === false) {
        interval = setInterval(() => {
          setTime((time) => time + 1);
        }, 1000);
      } else {
        clearInterval(interval);
      }
      return () => {
        clearInterval(interval);
      };
    }, [isActive, isPaused]);

    useEffect(() => {
      error&&toast.error(`${error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
      clearError()
    }, [error, clearError])
    
    const handleStart = () => {
      setIsActive(true);
      setIsPaused(false);
    };
    
    const handlePauseResume = async (username , call) => {
      setIsPaused(!isPaused);
      try {

         await request('/api/time/save', 'POST', {duration: time, videoName: username , callFrom:call}, {
          Authorization: `Bearer ${auth.token}`
        })
      } catch (e) {console.log(e)}
    };
    
  return {
    handleStart,handlePauseResume,time
};
};

export default useStopWatch;