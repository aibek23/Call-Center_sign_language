import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const Context = createContext();
// const socket = io('http://localhost:5000');
const ContextProvider = ({ children }) => {

  useEffect(() => {
      
      
  }, []);
  const notificationss = () => {
  };


  return (
    <SocketContext.Provider value={{
      notificationss,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// export { ContextProvider, SocketContext };
