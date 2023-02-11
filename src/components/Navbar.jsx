import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import {MdDarkMode} from 'react-icons/md'
import {BsSunFill} from 'react-icons/bs'
const Navbar = ({ searchTerm, setSearchTerm,switchtheme, user,theme,themeset }) => {
  const navigate = useNavigate();

  return (
    <div className=" mt-2">
        <div className={`flex p-1 justify-start items-center w-full px-2 rounded-3xl ${theme=='dark' ? 'bg-[#28282B]' : 'bg-white'} border-none outline-none focus-within:shadow-sm`}>
          <IoMdSearch fontSize={25} className="ml-1 text-gray-500" />
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            value={searchTerm}
            onFocus={() => navigate('/search')}
            className={`p-2 w-full rounded-3xl ${theme=='dark' ? 'bg-[#28282B]' : 'bg-white'} outline-none`}
          />
        </div>
        {/* <div className="flex gap-3 cursor-pointer ">
          <div onClick={() => navigate(`/login`)}  className={`${theme==='dark' ? 'bg-red-400':'bg-black'} text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center`}>
            Login
          </div>
        </div> */}
        {/* <div className="flex gap-3 cursor-pointer ">
          <div  className={`${theme==='dark' ? 'bg-red-400':'bg-black'} text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center`}>
            <button onClick={switchtheme}>
                {theme=='dark'?<MdDarkMode fontSize={25} />:<BsSunFill fontSize={25} />}
            </button>
          </div>
        </div> */}
        
        
      </div>
  );
};

export default Navbar;