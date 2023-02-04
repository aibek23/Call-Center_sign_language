import {useState, useEffect ,useContext ,useCallback} from 'react';
import openSocket from 'socket.io-client';
import {toast} from 'react-toastify'
import {Context} from '../context/Context'
import { useHttp } from './http.hook';


const socket = openSocket.connect('http://localhost:5000/', { reconnection: false })
export  const useOnlineRoom = (initialState ) => {
    const auth = useContext(Context);
    const {request} = useHttp();
    const [isActive, setIsActive] = useState("не в сети");
    const [time, setTime] = useState(false);
    const [online_room, setOnline_room] = useState([]);
    const data = JSON.parse(localStorage.getItem('userData'));
    const email = data.userEmail;
    useEffect(()=>{
        socket.emit('createRoom', email);
        socket.on('online_room', (data) => {
          setOnline_room(data);
     })
    },[])
    useEffect(() => {

        if(online_room.length==0){
            setIsActive("не в сети")
        }else{
            let online = online_room
            for (let index = 0; index < online.length; index++) {
                const element = online[index];
                if (element.operator === `room${initialState}`) {
                    setIsActive("online")
                }
            }
           
            }
        
        // setRoom(online_room.find(`operator${room}`))
       
    },[online_room])

          const fetchLinks = useCallback(async () => {
            try {
              const fetched = await request(`/api/time/${initialState}`, 'GET', null, {
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
            if (initialState) {
              fetchLinks()
            }
          }, [fetchLinks])

  return {
    isActive, time, online_room, setOnline_room
};
};

export default useOnlineRoom;