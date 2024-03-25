// pages/api/next-update.js
export default function handler(req, res) {
    const currentTime = Date.now();
    const cycleDuration = 10 * 60 * 1000;
    const nextUpdate = currentTime - (currentTime % cycleDuration) + cycleDuration;
    
    res.status(200).json({ nextUpdate });
  }
  