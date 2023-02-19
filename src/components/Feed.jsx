import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import RightBar from './RightBar';
import Spinner from './Spinner';
import Splash from './Splash';

const Feed = ({theme,switchtheme,user,autoPlay}) => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { categoryId } = useParams();

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      setLoading(true);

      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);
  const ideaName = categoryId || 'new';
  if (loading) {
    return (
      <div className='flex h-full w-[60vw] items-center justify-center'>

      <Splash theme={theme}/>
      </div>
    );
  }
  if(!pins?.length) return <h2>No Pins Available</h2>
  return (
    <div className=''>
      
      {pins && (
        <div className='flex'>
        <MasonryLayout autoPlay={autoPlay}  user={user && user}  switchtheme={switchtheme} theme={theme} pins={pins} />
        <RightBar switchtheme={switchtheme} theme={theme} searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user && user} />

        </div>
      )}
    </div>
  );
};

export default Feed;