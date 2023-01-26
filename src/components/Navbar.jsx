import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import {MdDarkMode} from 'react-icons/md'
import {BsSunFill} from 'react-icons/bs'
const Navbar = ({ searchTerm, setSearchTerm,switchtheme, user,theme }) => {
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7 ">
        <div className={`flex justify-start items-center w-full px-2 rounded-xl ${theme=='dark' ? 'bg-[#28282B]' : 'bg-white'} border-none outline-none focus-within:shadow-sm`}>
          <IoMdSearch fontSize={21} className="ml-1" />
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            value={searchTerm}
            onFocus={() => navigate('/search')}
            className={`p-2 w-full ${theme=='dark' ? 'bg-[#28282B]' : 'bg-white'} outline-none`}
          />
        </div>
        <div className="flex gap-3 cursor-pointer ">
          <div  className={`${theme==='dark' ? 'bg-red-400':'bg-black'} text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center`}>
            <button onClick={switchtheme}>
                {theme=='dark'?<MdDarkMode fontSize={25} />:<BsSunFill fontSize={25} />}
            </button>
          </div>
        </div>
        <div className="flex gap-3 ">
          <Link to={`user-profile/${user?._id}`} className="hidden md:block">
            <img src={user.image} alt="user-pic" className="w-14 h-12 rounded-full bg-white " />
          </Link>
          <Link to="/create-pin" className={`${theme==='dark' ? 'bg-red-400':'bg-black'} text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center`}>
            <IoMdAdd fontSize={20} />
          </Link>
        </div>
      </div>
    );
  }

  return null;
};

export default Navbar;