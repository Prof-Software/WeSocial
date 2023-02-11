import React from 'react'
import Navbar from './Navbar'

const RightBar = ({theme,switchtheme,searchTerm,setSearchTerm,user}) => {
  return (
    <div className='md:block hidden md:ml-14 ml-0  h-full overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className="top-0">
        <Navbar className='top-0' theme={theme} switchtheme={switchtheme} searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user && user}/>
        search
      </div>
    </div>
  )
}

export default RightBar