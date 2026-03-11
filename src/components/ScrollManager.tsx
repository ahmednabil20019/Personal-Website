import { useEffect } from "react";

export const ScrollManager = () => {
  useEffect(() => {
    // We are using native scrolling now as per user request for "normal" scroll.
    // Ensure html has scroll-behavior: smooth in CSS.
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return null;
};
