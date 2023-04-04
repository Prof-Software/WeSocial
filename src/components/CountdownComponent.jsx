import React from 'react';
import Countdown from 'react-countdown';

function CountdownComponent({ endDate }) {
  const now = new Date();
  const end = new Date(endDate);

  if (end <= now) {
    return <p>The event has ended</p>;
  }

  return (
    <div>
      <Countdown date={end} />
    </div>
  );
}

export default CountdownComponent;
