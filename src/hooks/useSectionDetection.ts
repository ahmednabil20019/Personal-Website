import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useSectionDetection = () => {
  const { currentSection, setCurrentSection } = useTheme();

  useEffect(() => {
    const sections = ['home', 'about', 'services', 'journey', 'skills', 'projects', 'certifications', 'contact'];
    let isManualScrolling = false;
    let scrollingEnabled = true;
    let manualScrollTimeout: NodeJS.Timeout;

    const handleManualScroll = () => {
      isManualScrolling = true;
      clearTimeout(manualScrollTimeout);
      // Reset after animation completes (approx 1s)
      manualScrollTimeout = setTimeout(() => {
        isManualScrolling = false;
      }, 1000);
    };

    window.addEventListener('manual-scroll-start', handleManualScroll);

    // Use a "Center Line" scan strategy
    // We check which section is currently crossing the "focus line" (approx 1/3 down the screen)
    // This is more robust than IntersectionObserver for variable height sections
    const handleScroll = () => {
      if (isManualScrolling || !scrollingEnabled) return;

      const focusLine = window.innerHeight / 3;
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      // Bottom of page check
      if (window.innerHeight + scrollPosition >= documentHeight - 50) {
        if (currentSection !== 'contact') setCurrentSection('contact');
        return;
      }

      // Top of page check
      if (scrollPosition < 100) {
        if (currentSection !== 'home') setCurrentSection('home');
        return;
      }

      // Scan sections
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section top is above the focus line AND the section bottom is below the focus line
          // Then this is the section we are currently reading
          if (rect.top <= focusLine && rect.bottom >= focusLine) {
            if (currentSection !== section) {
              setCurrentSection(section);
            }
            break; // Found the active section, stop scanning
          }
        }
      }
    };

    // Throttle scroll event for performance
    let lastRun = 0;
    const throttledScroll = () => {
      const now = Date.now();
      if (now - lastRun >= 100) {
        handleScroll();
        lastRun = now;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('manual-scroll-start', handleManualScroll);
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(manualScrollTimeout);
    };
  }, [setCurrentSection, currentSection]); // Added currentSection to dep array for check strictly
};
