import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Navbar, Feed, PinDetail, CreatePin, Search } from '../components';

const Pins = ({ user,theme,switchtheme,themeset,autoPlay }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="px- md:px-5 ">
      <div className={`${theme=='dark' ? 'bg-[#000]' : ' bg-gray-50'} absolute right-[330px] md:block hidden`}>
        {/* <Navbar switchtheme={switchtheme} themeset={themeset} theme={theme} searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user && user} /> */}
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Feed autoPlay={autoPlay} switchtheme={switchtheme} theme={theme} user={user && user}  />} />
          <Route path="/category/:categoryId" element={<Feed switchtheme={switchtheme} theme={theme} user={user && user} />} />
          <Route path="/pin-detail/:pinId" element={<PinDetail theme={theme} user={user && user} />} />
          <Route path="/create-pin" element={<CreatePin theme={theme} user={user && user} />} />
          <Route path="/search" element={<Search theme={theme} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;