import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes'
import {useAuth} from './hooks/auth.hook'
import {AuthContext} from './context/AuthContext'
// import { ContextProvider } from './context/Context';
import {Header} from './components/Header'
import {Loader} from './components/Loader'
import 'bootstrap/dist/css/bootstrap.min.css' ;
import "./index.css";

function App() {
  const {token, login, logout, userId, ready, userEmail} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)
  if (!ready) {
    return <Loader />
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated,userEmail
    }}>

      <Router>
          {routes}
      </Router>

    </AuthContext.Provider>
  )
}

export default App
