import React, { useState } from 'react';
// import { SocketContext } from '../context/Context';

const Sidebar = (me, callAccepted, name, setName, callEnded, leaveCall, callUser, adminID) => {
  // const { me, callAccepted, name, setName, callEnded, leaveCall, callUser, adminID } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <div>
      <form>
        <div>
          <div>
            <h3>Account Info</h3>
            <input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <h3>{me}</h3>
            <h1>  ---------  </h1>
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
    </div>
  );
};

export default Sidebar;