import {useState, useEffect ,useContext ,useCallback} from 'react';
import openSocket from 'socket.io-client';
import {toast} from 'react-toastify'
import {AuthContext} from '../context/AuthContext'
import { useHttp } from './http.hook';


const socket = openSocket.connect('http://localhost:5000', { reconnection: false })
export  const useStopWatch = (initialState ) => {
    const {request, error, clearError} = useHttp();
    const auth = useContext(AuthContext)
    const [isActive, setIsActive] = useState("не в сети");
    const [time, setTime] = useState(false);
    const [room, setRoom] = useState(initialState);
    const [online_room, setOnline_room] = useState([]);
        socket.on('online_room', (data) => {
            setOnline_room(data);
          })

    useEffect(() => {

        if(online_room.length==0){
            setIsActive("не в сети")
        }else{
            let online = online_room
            for (let index = 0; index < online.length; index++) {
                const element = online[index];
                if (element.operator === `room${room}`) {
                    setIsActive("online")
                }
            }
           
            }
        
        // setRoom(online_room.find(`operator${room}`))
       
    },[online_room])

          const fetchLinks = useCallback(async () => {
            try {
              const fetched = await request(`/api/time/${room}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
              })
              setTime(fetched)
            } catch (e) {toast.error(`${e}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });}
          }, [auth.token, request])
        
          useEffect(() => {
            fetchLinks()
          }, [fetchLinks])

  return {
    isActive,time
};
};

export default useStopWatch;