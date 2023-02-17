import { CircularProgress, LinearProgress } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import logo from '../assets/logo.png'
const Splash = ({theme}) => {
  return (
    <div className={`w-[100vw] h-[100vh] absolute left-0 top-0 z-50 ${theme==='dark'?'bg-black':'bg-white'} overflow-hidden flex flex-col items-center justify-center`}>
        <img src={logo} alt="" className=' rounded-full w-32 mb-4' />
       <CircularProgress/>
    </div>
  )
}

export default Splash