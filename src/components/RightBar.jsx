import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { client } from '../client';
import { GoVerified } from "react-icons/go";
const RightBar = ({theme,switchtheme,searchTerm,setSearchTerm,user}) => {
  return (
    <div className='md:block hidden md:ml-14 ml-0  h-full overflow-y-scroll min-w-210 hide-scrollbar'>
      {/* <div className="top-0 bg-[#28282b] rounded-3xl w-[350px]">
        <Navbar className='top-0' theme={theme} switchtheme={switchtheme} searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user && user}/>
      </div> */}
    </div>
  )
}

export default RightBar