import React, { useContext, useState,useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Header = (props) => {
  const isAuthenticated = props.props;
  const [authenticated, setAuthenticated] = useState(false)
  const [operator, setOperator] = useState(false);
  const [adm, setAdm] = useState(false);
  const data = JSON.parse(localStorage.getItem('userData'));
  useEffect(()=>{ if (isAuthenticated !== null) {
    setAuthenticated(true)
  }},[])
  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem('userData'));
    if(data&&data.userEmail==="admin@gmail.com"){
      setAdm(true)
    }
    switch (data&&data.userEmail) {
    case "operator1@gmail.com":
        setOperator(true)
      break;
    case "operator2@gmail.com":
        setOperator(true)
      break;
    case "operator3@gmail.com":
        setOperator(true)
      break;
    case "operator4@gmail.com":
        setOperator(true)
      break;
    case "operator5@gmail.com":
        setOperator(true)
      break;
    default:
      break;
  }})
  const history = useHistory()
  const auth = useContext(AuthContext)
  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/AuthPage')
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
              {data ? operator ?
                <li className="nav-item">
                  <NavLink className="nav-link" to="/CallPage">прием звонков</NavLink>
                </li> :
                <li className="nav-item">
                  <NavLink className="nav-link" to="/CallPage">позвонить</NavLink>
                  {/* <NavLink className="nav-link" to="/CallPage">позвонить</NavLink> */}
                </li> : ' '}
                {adm?<NavLink className="nav-link" to="/AdminPanel">админ панель</NavLink>:""}
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
