import React, { useState, useContext } from 'react';
import { SocketContext } from '../context/Context';

const Sidebar = ({children}) => {
  const { callAccepted, name, setName, callEnded, leaveCall, callUser, notificationss, room, message } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');
  console.log(room);
  console.log(message);

  return (
    <div>
      <form>
        <div>
          <div>
            <h3>Account Info</h3>
            <input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <button type='button' onClick={() => {notificationss()}}>room</button>
          <h1>{room&&" "}</h1>
            {/* {room.map(e => {
              return<h1>{room[e]}</h1>
            })} */}
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
      </form>
        {children}
    </div>
  );
};

export default Sidebar;