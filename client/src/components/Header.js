import React, { useContext, useState, useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { Context } from '../context/Context'

export const Header = (props) => {
  const isAuthenticated = props.props;
  const [state, setState] = useState({ authenticated: false, operator: false, adm: false });
  const data = JSON.parse(localStorage.getItem('userData'));
  const history = useHistory()
  const auth = useContext(Context)
  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/AuthPage')
  }
  useEffect(() => {
    setState(prevState => {
      const newState = { ...prevState };
  
      if (isAuthenticated !== null) {
        newState.authenticated = true;
      }
  
      if (data && data.userEmail === "admin@gmail.com") {
        newState.adm = true;
      }
  
      switch (data && data.userEmail) {
        case "operator1@gmail.com":
        case "operator2@gmail.com":
        case "operator3@gmail.com":
        case "operator4@gmail.com":
        case "operator5@gmail.com":
          newState.operator = true;
          break;
        default:
          break;
      }
  
      return newState;
    });
  }, [isAuthenticated]);
  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-dark  navbarbg">
        <div className="container-fluid">
        <NavLink className="navbar-brand" to="/HomePage">главная</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              {data ? state.operator ?
                <li className="nav-item">
                  <NavLink className="nav-link" to="/CallPage">прием звонков</NavLink>
                </li> :
                <li className="nav-item">
                  <NavLink className="nav-link" to="/CallPage">позвонить</NavLink>
                </li> : ''}
              {data?state.adm ? <NavLink className="nav-link" to="/AdminPanel">админ панель</NavLink> : "":""}
            </ul>
            <ul className='navbar-nav'>
              <li className="nav-item">
                <a className="nav-link" href="/AuthPage" onClick={logoutHandler}>{data?"выйти":"вход в аккаунт"}</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
