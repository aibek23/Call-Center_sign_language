import React, { useContext, useState,useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Header = (props) => {
  const isAuthenticated = props.props;
  const [authenticated, setAuthenticated] = useState(false)
  useEffect(()=>{ if (isAuthenticated !== null) {
    setAuthenticated(true)
  }},[])
  const history = useHistory()
  const auth = useContext(AuthContext)
  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }
  return (
    <div >
      <nav className="navbar navbar-expand-md navbar-dark  navbarbg" >
        <div className="container-fluid">
        <NavLink className="navbar-brand" to="/HomePage">главная</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              {authenticated ? isAuthenticated ?
                <li className="nav-item">
                  <NavLink className="nav-link" to="/Call_OperatorsPage">прием звонков</NavLink>
                </li> :
                <li className="nav-item">
                  <NavLink className="nav-link" to="/CallPage">позвонить</NavLink>
                </li> : ' '}
            </ul>
            <ul className='navbar-nav'>
              <li className="nav-item">
                <a className="nav-link" href="/" onClick={logoutHandler}>выйти</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
