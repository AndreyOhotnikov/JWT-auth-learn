import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { Context } from './index';
import LoginForm from './components/LoginForm';
import {observer} from 'mobx-react-lite'

function App() {
  const {store} = useContext(Context)
  useEffect(() => {
    if(localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])
  return (
    <div>
      <h1>{store.isAuth ? `auth ${store.user.email}` : 'noAuth'}</h1>
      <LoginForm/>
    </div>
  );
}

export default observer(App);
