import React, { useState } from 'react'
import { Route,Routes,useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Home from './container/Home'
import { GoogleOAuthProvider } from '@react-oauth/google'
const App = () => {
  const [theme, setTheme] = useState('')
   const switchtheme = () =>{
    if(theme=='dark'){
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }
  return (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>

        <Routes>
          <Route path='login' element={<Login/>}/>
          <Route path='/*' element={<Home themeset={setTheme} />}/>
        </Routes>
    </GoogleOAuthProvider>

  )
}

export default App