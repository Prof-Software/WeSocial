import React, { useEffect, useState } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';
import RightBar from './RightBar';

const Search = ({ searchTerm,switchtheme,theme,user }) => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm !== '') {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div className='absolute bg-black'>

      {loading && <Spinner message="Searching pins" />}
      {pins?.length !== 0 && 
      <div className='flex bg-black'>
      <MasonryLayout pins={pins} switchtheme={switchtheme} theme={theme} user={user && user} />
      <RightBar switchtheme={switchtheme} theme={theme} searchTerm={searchTerm}  user={user && user} />
      </div>
      }
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className="mt-10 text-center text-xl ">No Pins Found!</div>
      )}
    </div>
  );
};

export default Search;