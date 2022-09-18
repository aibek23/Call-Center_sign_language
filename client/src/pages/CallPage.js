import React, { useState, useEffect, useRef, useContext } from "react";
import Peer from 'simple-peer';
import openSocket from 'socket.io-client';
import styles from '../css/CallPage.module.css'
import operator from '../hooks/operator.hook.js'
//prime
export const CallPage = () => {
  const data = JSON.parse(localStorage.getItem('userData'));
  const name = data.username
  const surname = data.usersurname
  const email = data.userEmail
  const winHeight = window.innerHeight;
  const winWidth = window.innerWidth;
  const socket = openSocket('http://localhost:5000/');
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [call, setCall] = useState({});
  const [online_room, setOnline_room] = useState([]);
  const [busy__room, setBusy__room] = useState(true);
  const [operatorId, setOperatorId] = useState()
  const [tabPanes, setTabPanes] = useState({ screen1: true, screen2: false });
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  useEffect(() => {
    socket.emit('createRoom', email);
    socket.on('busy__room', (data) => { setBusy__room(data); console.log(data, "_____________busy________") });
    socket.on('update', data => console.log(data))
    socket.on('connect_error', err => {console.log(err)
    setTimeout(() => {
      // window.location.reload(); 
    }, 3000);
    })
    socket.on('disconnect', () => { window.location.reload(); })
    socket.on('connect_failed', err => console.log(err))
    socket.on('callEndeMessage', (e) => {
      window.location.reload();
    })
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
    console.log(online_room.length);

    socket.on('online_room', (data) => {
      setOnline_room(data);

    })
  }, []);
  useEffect(() => {
    var rand = Math.floor(Math.random() * online_room.length);
    if (online_room[rand]) {
      let id = online_room[rand]
      setOperatorId(id.operator)
      setBusy__room(false);
    }
  },[online_room])

  // console.log(window.onerror)
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    // ... обработка ошибки ...
    console.log(msg, url, lineNo, columnNo, error);
    // WebSocket connection to 'ws://localhost:5000/socket.io/?EIO=4&transport=websocket&sid=1w0H6G4fnO-eN3CmAAMr' failed: Insufficient resources
    return false;
  }
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
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
  }

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
      socket.emit('callUser', { userToCall: id, signalData: data, from: id, name, surname, email });
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
    socket.emit('callEnde', operatorId);
    // socket.connect('//localhost:5000',{'forceNew':true });
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  const tabPane1 = () => {
    setTabPanes({ screen1: !tabPanes.screen1, screen2: tabPanes.screen1 })
  }

  const tabPane2 = () => {
    setTabPanes({ screen2: !tabPanes.screen2, screen1: tabPanes.screen2 })
  }
  return (

    <div className={styles.container} style={{ "height": `${winHeight - 56}px` }}>
      <div className={styles.video_row}>
        <div className="row">
          <h1>{data.username} {data.usersurname}</h1>
        </div>
        <div className={styles.video + " " + `${tabPanes.screen1 && styles.video_player_little}`} onClick={() => { tabPane1() }}>
          <video playsInline muted ref={myVideo} autoPlay className={styles.video_player_user} />
        </div>
        {callAccepted && !callEnded && (
          <div className={styles.video + " " + `${tabPanes.screen2 && styles.video_player_little}`} onClick={() => { tabPane2() }}>
            <h3>{call.name}</h3>
            <video playsInline ref={userVideo} autoPlay className={styles.video_player_operator} />
          </div>
        )}
      </div>
      <div>
      </div>
      <div className={styles.wraper_callBtn}>
        {callAccepted && !callEnded ? (
          <button type="button" onClick={leaveCall}>
            Hang Up
          </button>
        ) : (online_room.length&&
          <button type="button" className={styles.callBtn} onClick={() => { toColl(); callUser(operatorId); setCallAccepted(true) }} disabled={busy__room ? "disabled" : ""} ></button>
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