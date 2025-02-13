import { useState } from 'react'

import './App.css'
import Login from './components/Login/Login.jsx';
import Chat from './components/Chat/Chat.jsx';

function App() {
  const [logado, setLogado] = useState(false);

  return (
    <>
      { logado?<Chat />  : <Login />} 
    </>
  )
}

export default App
