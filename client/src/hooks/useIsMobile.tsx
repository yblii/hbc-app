import { useState, useEffect } from 'react';

// Default to 768px, a common mobile breakpoint
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false;
  });

  useEffect(() => {
    // 1. Define the media query
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    // 2. Function to update state based on the query match
    const handleResize = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // 4. Add the event listener to watch for changes
    // Modern browsers use addEventListener, older ones use addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleResize);
    } else {
      mediaQuery.addListener(handleResize);
    }

    // 5. Cleanup listener on unmount
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleResize);
      } else {
        mediaQuery.removeListener(handleResize);
      }
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;