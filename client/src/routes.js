import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {HomePage} from './pages/HomePage'
import {CallsPage} from './pages/CallsPage'
import {AboutPage} from './pages/AboutPage'
import {AuthPage} from './pages/AuthPage'
import {CallPage} from './pages/CallPage'

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/HomePage" exact>
          <HomePage />
        </Route>
        <Route path="/CallsPage" exact>
          <CallsPage />
        </Route>
        <Route path="/CallPage" exact>
          <CallPage />
        </Route>
        <Route path="/About">
          <AboutPage />
        </Route>
        <Redirect to="/HomePage" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}
