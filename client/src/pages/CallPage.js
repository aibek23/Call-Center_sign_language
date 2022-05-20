import React, {useState, useEffect, useRef, useContext} from "react";
import Peer from 'simple-peer';
import openSocket from 'socket.io-client';  
import styles from '../css/CallPage.module.css'


const  socket = openSocket('http://localhost:5000/');

//prime
export const CallPage = () => {
  const data = JSON.parse(localStorage.getItem('userData'));
  const name = data.username
  const surname = data.usersurname
  const email = data.userEmail
  const winHeight = window.innerHeight;
  const winWidth = window.innerWidth;
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [call, setCall] = useState({});
    const [idToCall, setIdToCall] = useState('');
    const [room, setRoom] = useState({});
    const [message,setMessage] = useState(' ')
    const [tabPanes, setTabPanes] = useState({screen1:true,screen2:false});
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
  const toColl = () => {
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
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(function(stream) {
        setStream(stream);
        myVideo.current.srcObject = stream;
      })
      .catch(function(err) {
          console.log("An error occurred: " + err);
      });    
      socket.on('rooms', (room)=>setRoom(room) )
      // socket.on("message", (message) => setMessage(message))

      // socket.on('adminID', (id) => setAdminID(id));
      socket.on('callUser', ({ from, name: callerName, signal, surname, email }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal,surname:surname,email:email });
      });
  }
    
    const answerCall = () => {
      setCallAccepted(true);
      const peer = new Peer({ initiator: false, trickle: false, stream });
      peer.on('signal', (data) => {
        socket.emit('answerCall', { signal: data, to: call.from });
      });
      peer.on('stream', (currentStream) => {
        userVideo.current
         = currentStream;
      });
      peer.signal(call.signal);
      connectionRef.current = peer;
    };
  
    const callUser = (id) => {
      const peer = new Peer({ initiator: true, trickle: false, stream });
      peer.on('signal', (data) => {
        socket.emit('callUser', { userToCall: id, signalData: data, from: id, name , surname , email});
      });
      peer.on('stream', (currentStream) => {
        userVideo.current.srcObject = currentStream;
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
    };
    const tabPane1 = () =>{
    setTabPanes({screen1:true,screen2:false})
  }
  const tabPane2 = () =>{
    setTabPanes({screen1:false,screen2:true})
  }
  
    return (

        <div className={styles.container} style={{"height":`${winHeight-56}px`}}>
            {/* <VideoPlayer name = {name} callAccepted = {callAccepted} myVideo = {myVideo} userVideo = {userVideo} callEnded = {callEnded} stream = {stream} call = {call} />

                <Sidebar me = {me} callAccepted = {callAccepted} name = { name} setName = {setName} callEnded = {callEnded} leaveCall = {leaveCall} callUser = {callUser} />

                <Notifications answerCall = {answerCall} call={call} callAccepted={callAccepted} /> */}
                        {/* <VideoPlayer props ={[name, callAccepted, myVideo, userVideo, callEnded, stream, call ]} /> */}
        <div className={styles.video_row}>
          <div className="row">
          <h1>{data.username} {data.usersurname}</h1>
        </div>

        <div className={styles.video+" "+`${tabPanes.screen1&&styles.video_player_little}`} onClick={()=>{tabPane1 ()}}>
          <video playsInline muted ref={myVideo} autoPlay className={styles.video_player_user} />
        </div>

      {callAccepted && !callEnded && (
        <div className={styles.video+" "+`${tabPanes.screen2&&styles.video_player_little}`} onClick={()=>{tabPane2 ()}}>
          <h3>{call.name}</h3>
          <video playsInline ref={userVideo} autoPlay className={styles.video_player_operator} />
        </div>
      )}
    </div>
    <div>
      {/* <form>
        <div>
          <div>
            <h3>Account Info</h3>
            <input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
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
      </form> */}
    </div>
    <div className={styles.wraper_callBtn}>
            {callAccepted && !callEnded ? (
              <button type="button" onClick={leaveCall}>
                Hang Up
              </button>
            ) : (
              // <button type="button" onClick={() => callUser(idToCall)}>
              //   Call
              // </button>
               <button type="button" className={styles.callBtn} onClick={()=>{toColl();callUser('room1');setCallAccepted(true)}}></button>
            )}
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