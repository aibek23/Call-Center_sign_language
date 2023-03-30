import React, { useState, useEffect, useRef } from "react";
import ringtony from "../audeo/skayp-call.mp3"
import toot from "../audeo/toot.mp3"
import styles from "../css/CallPage.module.css";
import {toast, ToastContainer} from 'react-toastify'
import Peer from 'simple-peer';
import openSocket from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css'
import useStopWatch  from "../hooks/StopWatch.hook";
import Timer from "../components/Timer";
import { useRandomString } from "../hooks/random.string.hook";
const socket = openSocket.connect('https://kosg.su', { reconnection: false })
// const socket = openSocket.connect('http://localhost:5000', { reconnection: false })
export const CallPage = (props) => {
const {handleStart,handlePauseResume,time} = useStopWatch(0);
  
  const data = JSON.parse(localStorage.getItem('userData'));
  const name = data.username;
  const surname = data.usersurname;
  const email = data.userEmail;
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [call, setCall] = useState({});
  const [online_room, setOnline_room] = useState([]);
  const [busy__room, setBusy__room] = useState(true);
  const [operatorId, setOperatorId] = useState();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socketRef = useRef(socket);
  
  const [screenStream, setScreenStream] = useState(null);
  const [voiceStream, setVoiceStream] = useState(null);
  const [recording, setRecording] = useState(false);
  // const [loading, setLoading] = useState(true);
  let mediaRecorder = null;
  let dataChunks = [];
  let room;
  let operatorId_mongo = data.userId;
  const username = useRef(`${name}_${operatorId_mongo}_${new Date().toLocaleDateString().replace(/\./g, '')}_${new Date().toLocaleTimeString().replace(/\:/g, '')}_${useRandomString(8)}`);
  const Audeo_Call = new Audio(ringtony);
  const Toot_Call = new Audio(toot);

  //style
  const [tabPanes, setTabPanes] = useState({ screen1: true, screen2: false });
  const [mScreen, setMSreen] = useState(false);
  const [modal , setModal] = useState(false);
  const [callEndeBtnM, setCallEndeBtnM ] = useState(100)

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(stream);
        myVideo.current.srcObject = stream;
      } catch (err) {
        console.log("An error occurred: " + err);
      }
    };
    if (props.props) {
      const room = 'room' + props.props.operator;
      socketRef.current.emit('user:connect', username.current);
      getMediaDevices();
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then((screenStream) => setScreenStream(screenStream))
        .catch((err) => console.log("An error occurred while getting screen media: " + err));
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((voiceStream) => setVoiceStream(voiceStream))
        .catch((err) => console.log("An error occurred while getting audio media: " + err));
      socket.emit('createRoom', email, room, operatorId_mongo);
      socket.on('callUser', ({ from, name: callerName, signal, surname }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal, surname });
      });
    } else {
      socket.emit('createRoom', email);
      socket.on('busy__room', (data) => { setBusy__room(data); });
      socket.on('online_room', (data) => { setOnline_room(data); });
      getMediaDevices();
    }
    socket.on('update', data => console.log(data));
    socket.on('connect_error', err => {
      console.log(err);
      setTimeout(() => { window.location.reload(); }, 500);
    });
    socket.on('disconnect', () => { window.location.reload(); });
    socket.on('callEndeMessage', (e) => { window.location.reload(); console.log(e);});
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

  }, [props.props, email]);

  useEffect(() => {
    var rand = Math.floor(Math.random() * online_room.length);
    if (online_room[rand]) {
      let id = online_room[rand]
      setOperatorId(id.operator)
      console.log(online_room);
      setBusy__room(false);
    }
  },[online_room]);

  // let mediaRecorder;
  // let dataChunks = [];

  function startRecording() {
    if (screenStream && voiceStream && !mediaRecorder) {
      setRecording(true);
      handleStart();
      let mediaStream;
      if (voiceStream === 'unavailable') {
        mediaStream = screenStream;
      } else {
        mediaStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...voiceStream.getAudioTracks()
        ]);
      }
      mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.ondataavailable = ({ data }) => {
        dataChunks.push(data);
        socketRef.current.emit('screenData:start', {
          username: username.current,
          data
        });
      };
      mediaRecorder.onstop = stopRecording;
      mediaRecorder.start(150);
    }
  }

  function stopRecording() {
    handlePauseResume(username.current, call.from);
    setRecording(false);
    socketRef.current.emit('screenData:end', username.current);
    mediaRecorder = null;
    dataChunks = [];
  }
  const answerCall = () => {

    startRecording();
    Audeo_Call.loop = false;
    Audeo_Call.pause();
    setCallAccepted(true);
    const peer = new Peer({ initiator: false,  trickle: false, stream: stream });
    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from ,room:'room' + props.props.operator});
    });
    peer.on('stream', data => {
      userVideo.current.srcObject  = data;
    });
    peer.on('error', (err) => {
      console.log(err);
      if(err="RTCError: User-Initiated Abort, reason=Close called"){
        toast.error(`связь прервана №${err.message}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        stopRecording();
        socket.emit('callEnde', call.from);
        connectionRef.current.destroy();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
      })
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    Toot_Call.loop = true;
    Toot_Call.play();
    const peer = new Peer({ initiator: true, trickle: false, stream: stream });

    peer.on('error', (err) => {console.log(err);})
    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: email, name:name, surname:surname});
    });
    peer.on('stream', (data) => {
      Toot_Call.loop = false;
      Toot_Call.pause();
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
    }, 500);
   }
    return false;
  }

  const leaveCall = () => {
    window.scrollTo(0,document.documentElement.scrollHeight)
    stopRecording();
    socket.emit('callEnde', call.from);
    connectionRef.current.destroy();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    if (call.isReceivingCall&&!callAccepted) {
      Audeo_Call.loop = true;
      Audeo_Call.play();
    } else {
      Audeo_Call.loop = false;
      Audeo_Call.pause();
    }
    // Clean up the effect
    return () => {
      Audeo_Call.loop = false;
      setTimeout(() => {
        Audeo_Call.pause();
      }, 500);
   
    };
  }, [call,callAccepted]);
  //style

  useEffect(()=>{
  if(576>=window.innerWidth){
  setMSreen(true)
  }},[])

  var openModal = function() {
    if(576>=window.innerWidth){
      setModal(true)
    }
  }
  const tabPane1 = () => {
    setTabPanes({ screen1: !tabPanes.screen1, screen2: tabPanes.screen1 })
  }

  useEffect(() => {
    if (!callEndeBtnM) return;
    const intervalId = setInterval(() => {
      setCallEndeBtnM(callEndeBtnM - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [callEndeBtnM]);
  const callBtnFunc = () => {
    setCallEndeBtnM(8)
    }
    useEffect(() => {
      if (myVideo.current !== undefined) {
        myVideo.current.play()
      }
      if (userVideo.current !== undefined) {
        userVideo.current.play()
      }
    }, [modal]);
  return (
    <div className="container" onClick={()=>callBtnFunc()}>
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
      <h1 className={styles.title_callOperator} >Переводчик жестового языка</h1>
      <div className="Operators-row" >
        {mScreen?
        <div className={styles.modal_container + " " + `${modal&&styles.is_open}`}>
        <div className={styles.modal_content} >
              <div className={styles.video_operator + " " +styles.video + " " + `${tabPanes.screen2 && styles.video_player_little}`} onClick={() => { tabPane1() }}>
                <video  ref={myVideo} muted autoPlay  className={styles.video_player_user+" "+styles.video_player} />
              </div>
              {callAccepted && !callEnded && (
                  <div className={styles.video + " " + `${tabPanes.screen1 && styles.video_player_little}`} onClick={() => { tabPane1() }}>
                  <video  ref={userVideo} autoPlay className={styles.video_player_operator + ' ' + styles.video_player}></video>
                    <h6 className={styles.user_name}>{call.name} {call.surname} </h6>
                  <h6 className={styles.user_name}>{call.email} </h6>
                </div> 
              )}
              {callEndeBtnM&&
              <div className={styles.HangUp_div}>
                <button type="button" className={styles.call_btn_h} onClick={leaveCall}>
                  {/* Hang Up */}
                </button>
              </div>
              }
        </div>
      </div>
      :
      <div className={styles.container}>
        <div className={styles.operatot_video_row}>
          
              <div className="col-6 p-2">
                <video playsInline ref={myVideo} muted autoPlay className={styles.video_player_user+" "+styles.video_player} />
              </div>
              
              {callAccepted && !callEnded && (
                      <div className="col-6 p-2">
                        <video  ref={userVideo} autoPlay className={styles.video_player_operator + ' ' + styles.video_player}></video>
                        <h6 className={styles.user_name}>{call.name} {call.surname} </h6>
                        {/* <h6 className={styles.user_name}>{call.email} </h6> */}
                      </div>
              )}
             </div>
      </div>}
      </div>
      {call.isReceivingCall && !callAccepted && (
        <div  className={styles.btn_call_text}>
          <p className={styles.btn_call_name}>{call.name}</p> 
          <button className={styles.btn_call} onClick={()=>{answerCall()}}>
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
        ) : (online_room.length?
              <div className={styles.HangUp_div}>
                <button type="button" className={styles.callBtn} onClick={() => { callUser(operatorId); setCallAccepted(true); openModal();}}>
                   {/* Hang D */}
                </button>
              </div>:props.props?"":<div className={styles.HangUp_div}>
                <div className="row">
                  <h4 className={styles.title_callOperator_er} >просим подождать несколько минут все операторы заняты</h4>
                  <h5 className={styles.title_callOperator_er} >когда появится зеленая кнопка нажмите его для осуществления видеозвонка</h5>
                  </div>
              </div>
            )}
      </div>
      <Timer props={time}/>
    </div>
  )
}