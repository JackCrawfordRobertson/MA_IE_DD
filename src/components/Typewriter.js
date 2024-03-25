// components/Typewriter.js
import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, typingSpeed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (text) {
      let index = 0;
      const intervalId = setInterval(() => {
        setDisplayedText((prev) => {
          const charToAdd = text.charAt(index) === '\n' ? '<br />' : text.charAt(index);
          return prev + charToAdd;
        });
        index++;
        if (index === text.length) {
          clearInterval(intervalId);
        }
      }, typingSpeed);
  
      return () => clearInterval(intervalId);
    }
  }, [text, typingSpeed]);

  return (
    <span>
      {displayedText}
      <span className="cursor"></span>
    </span>
  );
};

export default Typewriter;
