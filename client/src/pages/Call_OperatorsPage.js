import React, {useState, useEffect, useRef, createRef ,useContext,useCallback} from "react";
import { Redirect } from 'react-router-dom'
import { Image } from "../img/kisspng-avatar-user-medicine-surgery.jpg";
// import Sidebar from '../components/Sidebar'
// import VideoPlayer from '../components/VideoPlayer'
// import Notifications from '../components/Notifications'
import Peer from 'simple-peer';
import openSocket from 'socket.io-client';  


const  socket = openSocket('http://localhost:5000/');


export const Call_OperatorsPage = () => {
  const data = JSON.parse(localStorage.getItem('userData'));
    const name = data.username
  const surname = data.usersurname
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [call, setCall] = useState({});
    const [idToCall, setIdToCall] = useState('');
    const [room, setRoom] = useState({});
    const [message,setMessage] = useState(' ')
    const myVideo = useRef();
    var userVideo = useRef();
    const connectionRef = useRef();
useEffect(() => {

      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
      
          var getUserMedia = (
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia
          );
      
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
          }
      
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
      
        };
      }
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
          setStream(currentStream);
          myVideo.current.srcObject = currentStream;
        });
      // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      // .then(function(stream) {
      //   setStream(stream);
      //   myVideo.current.srcObject = stream;
      // })
      // .catch(function(err) {
      //     console.log("An error occurred: " + err);
      // });  
      // setName(`${data.username}`)

      switch (data.userEmail) {
        case "operator@gmail.com":
          socket.emit('createRoom','room1', 'room1');
          break;
        case "admin2@gmail.com":
          socket.emit('createRoom','room2', 'room2');
          break;
        case "admin3@gmail":
          socket.emit('createRoom', 'room3');
          break;
        case "admin4@gmail":
          socket.emit('createRoom', 'room4');
          break;
        case "admin5@gmail":
          socket.emit('createRoom', 'room5');
          break;
        default:
          break;
      };

      // socket.emit('createRoom','room1', 'room1'); 
      //       socket.on('rooms', (room)=>setRoom(room) )
      // socket.on("message", (message) => setMessage(message))

      // socket.on('adminID', (id) => setAdminID(id));
      socket.on('callUser', ({ from, name: callerName, signal,surname,email }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal, surname:surname,email:email });
      }); 

    
    }, []);


    
    const answerCall = () => {
      setCallAccepted(true);
      const peer = new Peer({ initiator: false, trickle: false, stream });
      peer.on('signal', (data) => {
        socket.emit('answerCall', { signal: data, to: call.from });
      });
      peer.on('stream', (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });
  
      peer.signal(call.signal);
  
      connectionRef.current = peer;
    };
  
    const callUser = (id) => {
      const peer = new Peer({ initiator: true, trickle: false, stream });
  
      peer.on('signal', (data) => {
        socket.emit('callUser', { userToCall: id, signalData: data, from: id, data });
      });
  
      peer.on('stream', (currentStream) => {
        userVideo.current = currentStream;
      });
  
      socket.on('callAccepted', (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });
  
      connectionRef.current = peer;
    };
  
    const leaveCall = () => {
      setCallEnded(true);
      connectionRef.current.destroy();
      window.location.reload();
      // window.location.reload();
    };
    console.log(room);
  console.log(message);
  
    return (

        <div className="container">
            {data.userEmail}
            <p>CallPage</p>
            {/* <VideoPlayer name = {name} callAccepted = {callAccepted} myVideo = {myVideo} userVideo = {userVideo} callEnded = {callEnded} stream = {stream} call = {call} />

                <Sidebar me = {me} callAccepted = {callAccepted} name = { name} setName = {setName} callEnded = {callEnded} leaveCall = {leaveCall} callUser = {callUser} />

                <Notifications answerCall = {answerCall} call={call} callAccepted={callAccepted} /> */}
                        {/* <VideoPlayer props ={[name, callAccepted, myVideo, userVideo, callEnded, stream, call ]} /> */}
                        <div className="row Operators-row">
      {stream && (
      <div className="col-6 video">
        <video playsInline muted ref={myVideo} autoPlay className="video-player" />
               <h1>{name}</h1>
      </div>
      )}
            
              {/* {myVideo ?<div className="col-6 video"><video playsInline muted ref={myVideo} autoPlay className="video-player" /><h1>{name}</h1></div>: 
              <div className="col-6 video">
               <img src={Image} alt="user" />
               </div>
               } */}
      
      {callAccepted && !callEnded && (
        userVideo ?
        <div className="col-6 video">
          <video playsInline ref={userVideo} autoPlay className="video-player-user" />
          <h3>{call.name} {call.surname}</h3>
          <h3>{call.email}</h3>
        </div>: 
              <div className="col-6 video">
               <img src={Image} />
               </div>

      )}
    </div>
    <div>
      <form>
        <div>
          {/* <div>
            <h3>Account Info</h3>
            <input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <img src={Image} alt="user" />
            <h1>  ---------  </h1>
          </div> */}
          <div>
            <h3>Make a call</h3>
            <input label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} />
            {callAccepted && !callEnded ? (
              <button type="button" onClick={leaveCall}>
                Hang Up
              </button>
            ) : (
              <button type="button" onClick={() => callUser(idToCall)}>
                Call
              </button>
              
            )}
            
          </div>
        </div>
      </form>
    </div>
    {call.isReceivingCall && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>
          <button type="submit" onClick={answerCall}>
            Answer
          </button>
        </div>
      )}
                {/* <Sidebar props={[me, callAccepted, name, setName, callEnded, leaveCall, callUser]} /> */}

                {/* <Notifications props={[answerCall, call, callAccepted ]} /> */}
      

        </div>
    )

}


//    switch (data.userEmail) {
//         case "aasanakunuulul@gmaial.com":
//           socket.emit('createRoom','room1', 'room1');
//           break;
//         case "aibekasanakunuulussld@gmail.com":
//           socket.emit('createRoom','room2', 'room2');
//           break;
//         case "admin3@gmail":
//           socket.emit('createRoom', 'room3');
//           break;
//         case "admin4@gmail":
//           socket.emit('createRoom', 'room4');
//           break;
//         case "admin5@gmail":
//           socket.emit('createRoom', 'room5');
//           break;
//         default:
//           break;
//       };