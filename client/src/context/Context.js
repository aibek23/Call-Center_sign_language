// import React, { createContext, useState, useRef, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import Peer from 'simple-peer';

// const SocketContext = createContext();
// // const socket = io('http://localhost:5000');
// const ContextProvider = ({ children }) => {
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [callEnded, setCallEnded] = useState(false);
//   const [stream, setStream] = useState();
//   const [name, setName] = useState('');
//   const [call, setCall] = useState({});
//   const [room, setRoom] = useState({});
//   const [subscribeToTimer, setSubscribeToTimer] = useState('');
//   const [message,setMessage] = useState(' ')
//   const myVideo = useRef();
//   const userVideo = useRef();
//   const connectionRef = useRef();
//     const data = JSON.parse(localStorage.getItem('userData'));

//   useEffect(() => {
//       if (navigator.mediaDevices === undefined) {
//         navigator.mediaDevices = {};
//       }
      
//       if (navigator.mediaDevices.getUserMedia === undefined) {
//         navigator.mediaDevices.getUserMedia = function (constraints) {
      
//           var getUserMedia = (
//             navigator.getUserMedia ||
//             navigator.webkitGetUserMedia ||
//             navigator.mozGetUserMedia
//           );
      
//           if (!getUserMedia) {
//             return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
//           }
      
//           return new Promise(function (resolve, reject) {
//             getUserMedia.call(navigator, constraints, resolve, reject);
//           });
      
//         };
//       }
//       // navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
//       //     setStream(currentStream);
//       //     myVideo.current.srcObject = currentStream;
//       //   });
//       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(function(stream) {
//         setStream(stream);
//         myVideo.current.srcObject = stream;
//       })
//       .catch(function(err) {
//           console.log("An error occurred: " + err);
//       });

//       switch (data.userEmail) {
//         case "aasanakunuulul@gmail.com":
//           socket.emit('createRoom', 'room1');
//           break;
//         case "aibekasanakunuulussl@gmail.com":
//           socket.emit('createRoom', 'room2');
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
//       }
//       socket.on('callUser', ({ from, name: callerName, signal }) => {
//         setCall({ isReceivingCall: true, from, name: callerName, signal });
//       });
//           socket.on('rooms', (room)=>setRoom(room) )
//       socket.on("message", (message) => setMessage(message))
// //   console.log(response);
// //   setRoom(response) 
// // });

//   }, []);
//   const notificationss = () => {

//     socket.on('room', (room)=>setRoom(room) )

//     // socket.emit('adminID', 'a');
//   };
//   const answerCall = () => {
//     setCallAccepted(true);
//     const peer = new Peer({ initiator: false, trickle: false, stream });
//     peer.on('signal', (data) => {
//       socket.emit('answerCall', { signal: data, to: call.from });
//     });
//     peer.on('stream', (currentStream) => {
//       userVideo.current.srcObject = currentStream;
//     });

//     peer.signal(call.signal);

//     connectionRef.current = peer;
//   };

//   const callUser = (id) => {
//     const peer = new Peer({ initiator: true, trickle: false, stream });

//     peer.on('signal', (data) => {
//       socket.emit('callUser', { userToCall: id, signalData: data, from: id, name });
//     });

//     peer.on('stream', (currentStream) => {
//       userVideo.current.srcObject = currentStream;
//     });

//     socket.on('callAccepted', (signal) => {
//       setCallAccepted(true);
//       peer.signal(signal);
//     });

//     connectionRef.current = peer;
//   };

//   const leaveCall = () => {
//     setCallEnded(true);

//     connectionRef.current.destroy();

//     window.location.reload();
//   };

//   return (
//     <SocketContext.Provider value={{
//       call,
//       callAccepted,
//       myVideo,
//       userVideo,
//       stream,
//       name,
//       room,
//       message,
//       setName,
//       callEnded,
//       callUser,
//       leaveCall,
//       answerCall,
//       notificationss,
//     }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export { ContextProvider, SocketContext };
