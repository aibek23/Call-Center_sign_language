import React,{useState,useEffect} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {HomePage} from './pages/HomePage'
import {CallsPage} from './pages/CallsPage'
import {Call_OperatorsPage} from './pages/Call_OperatorsPage'
import {AuthPage} from './pages/AuthPage'
import {CallPage} from './pages/CallPage'
import { Header } from './components/Header'

export const useRoutes = (isAuthenticated) => {
  const [operator, setOperator] = useState(false);
  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem('userData'));
    switch (data&&data.userEmail) {
    case "operators@gmail.com":
        setOperator({'operator':1})
      break;
    case "aibekasanakunuulu@gmail":
        setOperator({'operator':2})
      break;
    case "admin3@gmail.com":
        setOperator({'operator':3})
      break;
    case "admin4@gmail":
        setOperator({'operator':4})
      break;
    case "admin5@gmail":
        setOperator({'operator':5})
      break;
    default:
      break;
    }},[2])

  if (isAuthenticated) {
    return (
      <>
      <Header props={operator} />
      <Switch>
        <Route path="/HomePage" exact>
          <HomePage />
        </Route>
        <Route path="/CallsPage" exact>
          <CallsPage />
        </Route>
        {operator?
        <Route path="/Call_OperatorsPage">
            <Call_OperatorsPage props={operator} />
          </Route>:
             <Route path="/Call_OperatorsPage">
             <Call_OperatorsPage props={operator} />
           </Route>
                //   <Route path="/CallPage" exact>
                //   <CallPage />
                // </Route>
  }
        <Redirect to="/HomePage" />
      </Switch>
      </>
    )
  }

  return (
    <>
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
    </>
  )
}
