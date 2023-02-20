import React from 'react';
import NewPost from './NewPost';
import Pin from './Pin';
const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins,theme,switchtheme,user,autoPlay }) => (
  <div className='flex  flex-col'>
    <NewPost theme={theme}  user={user && user} />
  <div className='flex flex-col'>
    {pins?.map((pin) => <Pin autoPlay={autoPlay} userData={user && user} theme={theme} key={pin._id} pin={pin} className="" />)}
  </div>
  </div>
);

export default MasonryLayout;
