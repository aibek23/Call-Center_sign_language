import React,{useState,useEffect} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {HomePage} from './pages/HomePage'
import {CallPage} from './pages/CallPage'
import {AuthPage} from './pages/AuthPage'
import { Header } from './components/Header'
import {AdminPanel} from './pages/AdminPanel'
import { VideoPage } from './pages/VideoPage'

export const useRoutes = (isAuthenticated) => {
  const [operator, setOperator] = useState(false);
  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem('userData'));
    console.log(data);
    switch (data&&data.userEmail) {
    case "operator1@gmail.com":
        setOperator({'operator':1})
      break;
    case "operator2@gmail.com":
        setOperator({'operator':2})
      break;
    case "operator3@gmail.com":
        setOperator({'operator':3})
      break;
    case "operator4@gmail.com":
        setOperator({'operator':4})
      break;
    case "operator5@gmail.com":
        setOperator({'operator':5})
      break;
    default:
      break;
    }},[0])

  if (isAuthenticated) {
    return (
      <>
      <Header props={operator} />
      <Switch>
          {operator?
          <Route path="/CallPage">
            <CallPage props={operator} />
          </Route>:
          <Route path="/CallPage">
            <CallPage props={operator} />
          </Route>
          }
          <Route path="/AdminPanel" exact>
            <AdminPanel />
          </Route>
          <Route path="/detailVideo/:id" >
            <VideoPage />
          </Route>
          <Redirect to="/HomePage" />
        </Switch>
        <Route path="/HomePage" exact>
          <HomePage />
        </Route>
      </>
    )
  }

  return (
    <>
      <Header props={operator} />
      <Switch>
        <Route path="/HomePage" exact>
          <HomePage />
          </Route>
        <Route path="/AuthPage" exact>
          <AuthPage />
          </Route>
        <Redirect to="/HomePage" />
      </Switch>
    </>
  )
}
