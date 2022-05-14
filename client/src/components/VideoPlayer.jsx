import React from 'react';
// import { SocketContext } from '../context/Context';

const VideoPlayer = ({name, callAccepted, myVideo, userVideo, callEnded, stream, call }) => {
  
  // const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

  return (
    <div className="row">
      {stream && (
      <div className="col-6">
        <h1>{name || 'Name'}</h1>
        <video playsInline muted ref={myVideo} autoPlay style={{ width: '550px', height: '300px' }} />
      </div>
      )}
      {callAccepted && !callEnded && (
        <div className="col-6">
          <h1>{call.name || 'Name'}</h1>
          <video playsInline muted ref={userVideo} autoPlay style={{ width: '550px', height: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
