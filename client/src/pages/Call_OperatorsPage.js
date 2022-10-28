import React, { useState, useEffect, useRef, useContext } from "react";
// import { Image } from "../img/kisspng-avatar-user-medicine-surgery.jpg";
// import StopWatch from "../components/StopWatch";
// import { HangUp } from "../img/Call_Ende.jpg";
import styles from "../css/Call_OperatorsPage.module.css";
import {toast, ToastContainer} from 'react-toastify'
import Peer from 'simple-peer';
import openSocket from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css'
import { ContextProvider } from "../context/Context";
import { useStopWatch } from "../hooks/StopWatch.hook";
import Timer from "../components/Timer";
import ControlButtons from "../components/ControlButtons";
const socket = openSocket.connect('http://kosg.su', { reconnection: false })
export const Call_OperatorsPage = (props) => {
  const {isActive,isPaused,handleStart,handlePauseResume,time} = useContext(ContextProvider)
  // const [handleStart,handlePauseResume,time] = useStopWatch()
  
  const data = JSON.parse(localStorage.getItem('userData'));
  const name = data.username
  const surname = data.usersurname
  const email = data.userEmail

  const winHeight = window.innerHeight;
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [call, setCall] = useState({});
  const [idToCall, setIdToCall] = useState('');
  // const [message, setMessage] = useState(' ')


  const [online_room, setOnline_room] = useState([]);
  const [busy__room, setBusy__room] = useState(true);
  const [operatorId, setOperatorId] = useState()
  const [tabPanes, setTabPanes] = useState({ screen1: true, screen2: false });

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  
  const socketRef = useRef(socket)

  const [screenStream, setScreenStream] = useState()
  const [voiceStream, setVoiceStream] = useState()
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(true)
  let mediaRecorder = null
  let dataChunks = []
  let room
  let operatorId_mongo = data.userId
  const username = useRef(`${name}_${surname}_${operatorId_mongo}_${Date.now().toString().slice(-4)}`)

  useEffect(() => {
    if(props.props){
      console.log('ок');

      room = 'room' + props.props.operator;
      socketRef.current.emit('user:connect', username.current)
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
      .then((streams) => {
        setStream(streams);
        myVideo.current.srcObject = streams;
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
    navigator.mediaDevices.getDisplayMedia({ video: true })
      .then((stream) => {
        setScreenStream(stream);
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
    navigator.mediaDevices.getUserMedia({audio: true})
      .then((stream) => {
        setVoiceStream(stream)
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
    // socket.on('CallEnded', (callUser) => {
    //   setCallEnded(callUser);
    //   window.location.reload();
    // });
    // socket.on('callUser', ({ name: callerName, signal, surname, email }) => {
    //   setCall({ isReceivingCall: true, name: callerName, signal, surname: surname, email: email })
    // })
    socket.emit('createRoom', email, room, operatorId_mongo)
    socket.on('callUser', ({ from, name: callerName, signal, surname: surname }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal , surname: surname});
    });
    socket.on('update', data => console.log(data))
    socket.on('connect_error', err => console.log(err))
    // socket.on('disconnect', (err) => {
    //   console.log(err)
    //   stopRecording();
    //   // setTimeout(() => {
    //   //   window.location.reload();
    //   // }, 1500);
    // })
    socket.on('callEndeMessage',(data)=>{
      stopRecording();
           setTimeout(() => {
        window.location.reload();
      }, 1500);
    })
    socket.on('connect_failed', err => console.log(err))
    socket.io.on("error", (err) => {
      console.log(err instanceof Error); // true
      toast.error(`перезагрузите браузер ошибка соединения №${err.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
       // not authorized
      console.log(err.data); // { content: "Please retry later" }
    });
  }else{
    console.log(operatorId);
    socket.emit('createRoom', email);
    socket.on('busy__room', (data) => { setBusy__room(data); console.log(data, "_____________busy________") });
    socket.on('update', data => console.log(data))
    socket.on('connect_error', err => {console.log(err)
    setTimeout(() => {
      window.location.reload(); 
    }, 3000);
    })
    socket.on('disconnect', () => { window.location.reload(); })
    socket.on('connect_failed', err => console.log(err))
    socket.on('callEndeMessage', () => {
      window.location.reload();
    })
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
    socket.on('online_room', (data) => {
      setOnline_room(data);
    })

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
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
  }
  }, [])

  useEffect(() => {
    var rand = Math.floor(Math.random() * online_room.length);
    if (online_room[rand]) {
      let id = online_room[rand]
      setOperatorId(id.operator)
      setBusy__room(false);
    }
  },[online_room])
  function startRecording() {
    if (screenStream && voiceStream && !mediaRecorder) {
      setRecording(true)
      let mediaStream
      if (voiceStream === 'unavailable') {
        mediaStream = screenStream
      } else {
        mediaStream = new MediaStream([
          ...screenStream.getVideoTracks(),
          ...voiceStream.getAudioTracks()
        ])
      }
      mediaRecorder = new MediaRecorder(mediaStream)
      mediaRecorder.ondataavailable = ({ data }) => {
        dataChunks.push(data)
        socketRef.current.emit('screenData:start', {
          username: username.current,
          data
        })
      }
      mediaRecorder.onstop = stopRecording
      mediaRecorder.start(150)
    }
  }
  function stopRecording() {
    setRecording(false)
    socketRef.current.emit('screenData:end', username.current)
    mediaRecorder = null
    dataChunks = []
  }
  // const answerCall = () => {
  //   setCallAccepted(true);

  //   const peer = new Peer({ initiator: false, trickle: false, stream: stream});

  //   peer.on('signal', (data) => {
  //     socket.emit('answerCall', { signal: data, to: call.from });
  //   });

  //   peer.on('stream', (currentStream) => {
  //     console.log('stream');
  //     console.log(currentStream);
  //     userVideo.current.srcObject = currentStream;
  //   });
  //   peer.signal(call.signal);

  //   connectionRef.current = peer;
  // };

  // const callUser = (id) => {
  //   const peer = new Peer({ initiator: true, trickle: false, stream: stream});

  //   peer.on('signal', (data) => {
  //     socket.emit('callUser', { userToCall: id, signalData: data, from: email, name });
  //   });

  //   peer.on('stream', (currentStream) => {
  //     console.log('sream1111');
  //     userVideo.current.srcObject = currentStream;
  //   });

  //   socket.on('callAccepted', (signal) => {
  //     setCallAccepted(true);

  //     peer.signal(signal);
  //   });

  //   connectionRef.current = peer;
  // };
 
  const answerCall = () => {
    startRecording()
    setCallAccepted(true);
    const peer = new Peer({ initiator: false,  trickle: false, stream: stream });
    peer.on('signal', (data) => {
      console.log('log№1');
      socket.emit('answerCall', { signal: data, to: call.from });
    });
    peer.on('stream', data => {
      console.log('log№2');
      userVideo.current.srcObject  = data;
    });
    peer.on('error', (err) => {console.log(err);})

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream: stream });

    peer.on('error', (err) => {console.log(err);})
    peer.on('signal', (data) => {
      console.log('log№3');
      socket.emit('callUser', { userToCall: id, signalData: data, from: email, name:name, surname:surname});
    });
    peer.on('stream', (data) => {
      console.log('log№4');
      userVideo.current.srcObject = data;
    });
    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };



  window.onerror = function(msg, url, lineNo, columnNo, error) {
    // ... обработка ошибки ...
   if(msg==='Uncaught Error: Connection failed.'){
    stopRecording();
    toast.error(`Connection failed`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
    setTimeout(() => {
      window.location.reload();
    }, 3500);
   }
    return false;
  }

  const leaveCall = () => {
    stopRecording();
    socket.emit('callEnde', call.from);
    connectionRef.current.destroy();
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  const tabPane1 = () => {
    setTabPanes({ screen1: !tabPanes.screen1, screen2: tabPanes.screen1 })
  }

  const tabPane2 = () => {
    setTabPanes({ screen2: !tabPanes.screen2, screen1: tabPanes.screen2 })
  }
  return (
    <div className="container">
            <ToastContainer
          position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
  />
  {/* <StopWatch/>
  <Timer time={time} />
  <ControlButtons 
    active={isActive}
    isPaused={isPaused}
    handleStart={handleStart}
    handlePauseResume={handlePauseResume}
  /> */}

      {data.userEmail}
      <h1 className={styles.title_callOperator}>Переводчик жестового языка</h1>
      <div className="row Operators-row" >
      <div className={styles.container} >
        {stream && (
          <div className={styles.video_row}>
            <div className={styles.video + " " + `${tabPanes.screen2 && styles.video_player_little}`} onClick={() => { tabPane1() }}>
              <video playsInline ref={myVideo} muted autoPlay className={styles.video_player_user+" "+styles.video_player} />
            </div>
          </div>
        )}
        {callAccepted && !callEnded && (

            <div className={styles.video_row}>
              <div className={styles.video + " " + `${tabPanes.screen1 && styles.video_player_little}`} onClick={() => { tabPane1() }}>
                <video  ref={userVideo} autoPlay className={styles.video_player_operator + ' ' + styles.video_player}></video>
                <h6 className={styles.user_name}>{call.name} {call.surname} </h6>
                <h6 className={styles.user_name}>{call.email} </h6>
              </div> 
            </div> 
            // <div className="col-6 video">
            //   <img src={Image} />
            // </div>
        )}
      </div>
      </div>
      {call.isReceivingCall && !callAccepted && (
        <div  className={styles.btn_call_text}>
          <p className={styles.btn_call_name}>{call.name}</p> 
          <button className={styles.btn_call} onClick={answerCall}>
            <div className={styles.btn_call__ico}>
              <i className="fas fa-phone-alt"></i>
            </div>
        </button>
        </div>
      )}
          
      <div className={styles.wraper_callBtn}>
      {callAccepted && !callEnded ? (
             <div className={styles.HangUp_div}>
                <button type="button" className={styles.call_btn_h} onClick={leaveCall}>
                  {/* Hang Up */}
                </button>
              </div>
        ) : (online_room.length&&
              <div className={styles.HangUp_div}>
                <button type="button" className={styles.callBtn} onClick={() => { callUser(operatorId); setCallAccepted(true)}}>
                   {/* Hang D */}
                </button>
              </div>
            )}
      </div>
      {/* <button onClick={onClick} >
        {!recording ? 'Start' : 'Stop'}
      </button> */}
    </div>
  )
}