import React,{useState, useEffect ,useContext } from 'react';
import {toast} from 'react-toastify';
import openSocket from 'socket.io-client';
import {Context} from '../context/Context'
import { useHttp } from '../hooks/http.hook';

const socket = openSocket.connect('http://localhost:5000', { reconnection: false })

export default function OnlineRoom() {

    const [online_room, setOnline_room] = useState([]);
    const [recording, setRecording] = useState([]);
    const [stop_recording, setStop_recording] = useState();
    const [online , setOnline] = useState("не в сети")
    useEffect(()=>{
    socket.on('recording', (data) => {setRecording(data);});
    socket.on('stop_recording', (data) => {setStop_recording(data);});
    socket.on('online_room', (data) => {
        setOnline_room(data);
    });})
	return online
}