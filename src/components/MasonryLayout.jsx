import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Pin from "./Pin";
import NewPost from "./NewPost";

const MasonryLayout = ({ pins, theme, switchtheme, user, autoPlay }) => {
  const [visiblePins, setVisiblePins] = useState(pins.slice(0, 2));
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage((prevPage) => prevPage + 1);
        const start = currentPage * 2;
        const end = start + 2;
        const newPins = pins.slice(start, end);
        setVisiblePins((prevPins) => [...prevPins, ...newPins]);
        setIsLoading(false);
      }, 3000);
    }
  }, [inView, isLoading, currentPage, pins]);

  return (
    <div className="flex  flex-col">
      <NewPost theme={theme} user={user && user} />
      <div className="flex flex-col ">
        {visiblePins.map((pin) => (
          <Pin
            autoPlay={autoPlay}
            border
            userData={user && user}
            theme={theme}
            key={pin._id}
            pin={pin}
            className=""
          />
        ))}
        <div className="h-[30px] w-full" ref={ref}>
          {isLoading && <span>Loading...</span>}
        </div>
      </div>
    </div>
  );
};

export default MasonryLayout;
