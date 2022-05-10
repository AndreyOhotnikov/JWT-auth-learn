import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { Context } from './index';
import LoginForm from './components/LoginForm';
import {observer} from 'mobx-react-lite'
import { useState } from 'react';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

function App() {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if(localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  async function getUsers () {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  if(store.isLoading) {
    return <div>Loading...</div>
  }

  if(!store.isAuth) {
    return (
    <>
      <LoginForm/>
     
    </>
    )
  }

  return (
    <div>
      <h1>{store.isAuth ? `auth ${store.user.email}` : 'noAuth'}</h1>
      <h1>{store.user.isActivated ? `acount activated on ${store.user.email}` : 'acount not activated'}</h1>
      <button onClick={() => store.logout()}>logout</button>
      <div>
        <button onClick={getUsers}>getUsers</button>
      </div>
      {users.map(user => 
          <div key={user.id}>{user.email}</div>
        )}
    </div>
  );
}

export default observer(App);
