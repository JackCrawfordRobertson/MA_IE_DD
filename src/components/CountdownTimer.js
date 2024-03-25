import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const CountdownTimer = () => {
  const [progress, setProgress] = useState(0);
  const [nextUpdate, setNextUpdate] = useState(null);

  // Function to fetch the next update time
  const fetchNextUpdate = async () => {
    const response = await fetch('/api/next-update');
    const data = await response.json();
    setNextUpdate(data.nextUpdate);
  };

  useEffect(() => {
    // Fetch the initial nextUpdate time
    fetchNextUpdate();
  }, []);

  useEffect(() => {
    if (!nextUpdate) return;

    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = nextUpdate - currentTime;
      const cycleDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
      const newProgress = 100 - (elapsedTime / cycleDuration) * 100;

      if (newProgress >= 100) {
        clearInterval(intervalId);
        setProgress(100);
        // Automatically fetch the next update time when the timer reaches 100%
        fetchNextUpdate();
      } else {
        setProgress(newProgress);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [nextUpdate]);

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="body2" color="text.secondary">Crafting the next story delivery in approximately {Math.round((100 - progress) / 100 * 10)} minutes</Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

export default CountdownTimer;
