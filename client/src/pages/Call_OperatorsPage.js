import React, { useState, useEffect, useRef } from "react";
import { Image } from "../img/kisspng-avatar-user-medicine-surgery.jpg";
import { saveAs } from 'file-saver';
import {toast, ToastContainer} from 'react-toastify'
import Peer from 'simple-peer';
import openSocket from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css'

const socket = openSocket.connect('http://localhost:5000/', { reconnection: false })
export const Call_OperatorsPage = (props) => {
  const room = 'room' + props.props.operator
  const data = JSON.parse(localStorage.getItem('userData'));
  const name = data.username
  const surname = data.usersurname
  const email = data.userEmail
  const operatorId = data.userId
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [call, setCall] = useState({});
  const [idToCall, setIdToCall] = useState('');
  const [message, setMessage] = useState(' ')
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const URLVIDEO = useRef();

  const username = useRef(`User_${Date.now().toString().slice(-4)}`)
  const socketRef = useRef(socket)
  const linkRef = useRef()
  const videoRef = useRef();
  const [screenStream, setScreenStream] = useState()
  const [voiceStream, setVoiceStream] = useState()
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(true)
  let mediaRecorder = null
  let dataChunks = []

  useEffect(() => {
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
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
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
    socket.on('callUser', ({ from, name: callerName, signal,surname, email }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal , surname: surname, email: email});
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
      console.log(err.message); // not authorized
      console.log(err.data); // { content: "Please retry later" }
    });
    socket.emit('createRoom', email, room, operatorId)
    

  }, [])
  useEffect(() => {
    ; (async () => {
      // проверяем поддержку
      if (navigator.mediaDevices.getDisplayMedia) {
        try {
          // получаем поток
          navigator.mediaDevices.getDisplayMedia({ video: true })
            .then((currentStream) => {
              setScreenStream(currentStream);
            })
            .catch(function (err) {
              console.log("An error occurred: " + err);
            });
        } catch (e) {
          console.error('*** getDisplayMedia', e)
          setLoading(false)
        }
      } else {
        console.warn('*** getDisplayMedia not supported')
        setLoading(false)
      }
    })()
  }, [])
  useEffect(() => {
    ; (async () => {
      if (navigator.mediaDevices.getUserMedia) {
        if (screenStream) {
          try {
            navigator.mediaDevices.getUserMedia({
              audio: true
            })
              .then((currentStream) => {
                setVoiceStream(currentStream)
              })
              .catch(function (err) {
                console.log("An error occurred: " + err);
              });
          } catch (e) {
            console.error('*** getUserMedia', e)
            setVoiceStream('unavailable')
          } finally {
            setLoading(false)
          }
        }
      } else {
        console.warn('*** getUserMedia not supported')
        setLoading(false)
      }
    })()
  }, [screenStream])
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
  const answerCall = () => {
    startRecording()
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });
    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject  = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: id, name,surname,email });
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
  window.onerror = function(msg, url, lineNo, columnNo, error) {
    // ... обработка ошибки ...
   if(msg=='Uncaught Error: Connection failed.'){
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
    socket.emit('callEnde', call.email);
    connectionRef.current.destroy();
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
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
      {data.userEmail}
      <p>CallPage</p>
      <div className="row Operators-row">
        {stream && (
          <div className="col-6 video">
            <video playsInline muted ref={myVideo} autoPlay className="video-player"></video>
            <h1>{name}</h1>
          </div>
        )}

        {callAccepted && !callEnded && (
          userVideo ?
            <div className="col-6 video">
              <video playsInline ref={userVideo} autoPlay className="video-player-use"></video>
              <h3>{call.name} {call.surname}</h3>
              <h3>{call.email}</h3>
            </div> :
            <div className="col-6 video">
              <img src={Image} />
            </div>
        )}
      </div>
      <div>
        <form>
          <div>
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
      <div>
        <video playsInline ref={URLVIDEO} autoPlay className="video-player-user" />
      </div>
      {/* <button onClick={onClick} >
        {!recording ? 'Start' : 'Stop'}
      </button> */}
    </div>
  )
}