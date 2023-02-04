import {createContext} from 'react'

function noop() {}

export const Context = createContext({
  token: null,
  userEmail:null,
  userId: null,
  login: noop,
  logout: noop,
  isAuthenticated: false,
  online_room:[], 
  setOnline_room :noop,
})

// export const Online = createContext({
//  online:null,
// })