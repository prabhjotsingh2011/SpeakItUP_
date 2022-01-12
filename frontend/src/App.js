
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Home from './Pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation';
import Authenticate from './Pages/Authenticate/Authenticate';
import Activate from './Pages/activate/Activate';
import userEvent from '@testing-library/user-event';
import Rooms from './Pages/Rooms/Rooms';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';
import Room from './Pages/Room.js/Room';

function App() {
  const { loading } = useLoadingWithRefresh();


  return (
    
    loading?
    (
      <Loader message="Loading... Please Wait !"/>
    ):
    (

    <BrowserRouter>
      <Navigation />
      <Switch>

        <GuestRoute path='/' exact>
          <Home />
        </GuestRoute>
        {/* <Route exact path={'/register'} element={<Register/>} />
        <Route exact path={'/login'} element={<Login/>} /> */}

        <GuestRoute path='/authenticate'>
          <Authenticate />
        </GuestRoute>

        <SemiProtectedRoute path='/activate' >
          <Activate />
        </SemiProtectedRoute>

        <ProtectedRoute path='/rooms' >
          <Rooms />
        </ProtectedRoute>

        <ProtectedRoute path='/room/:id' >
          <Room />
        </ProtectedRoute>


      </Switch>
    </BrowserRouter>
    )
  );
}
// const isAuth = false;
// const user = {
//   activated: true
// }



const SemiProtectedRoute = ({ children, ...rest }) => {
  const { isAuth, user } = useSelector(state => state.auth)
  return (
    <Route {...rest}
      render={({ location }) => {
        return (
          !isAuth
            ?
            (
              <Redirect to={{
                pathname: '/',
                state: { from: location }
              }} />
            )
            : isAuth && !user.activated ?
              (children) :
              <Redirect to={{
                pathname: '/rooms',
                state: { from: location }
              }} />
        )
      }}
    >

    </Route>
  )
}


const GuestRoute = ({ children, ...rest }) => {
  const { isAuth } = useSelector(state => state.auth)

  return (
    <Route {...rest}
      render={({ location }) => {
        return (
          isAuth ?
            (
              <Redirect to={
                {
                  pathname: '/rooms',
                  state: { from: location },
                }
              } />
            )
            : (
              children
            )
        )
      }}
    >
    </Route>
  )
}


const ProtectedRoute = ({ children, ...rest }) => {
  const { isAuth, user } = useSelector(state => state.auth)
  return (
    <Route {...rest}
      render={({ location }) => {
        return (
          !isAuth
            ?
            (
              <Redirect to={{
                pathname: '/',
                state: { from: location }
              }} />
            )
            : isAuth && !user.activated
              ?
              <Redirect to={{
                pathname: '/activate',
                state: { from: location }
              }} />
              :
              (children)
        )
      }}
    >

    </Route>
  )
}

export default App;
