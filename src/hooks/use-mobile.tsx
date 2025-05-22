
/**
 * @fileOverview Custom React hook `useIsMobile`.
 * Determines if the current viewport width is below a defined mobile breakpoint.
 * Useful for rendering different layouts or components based on screen size.
 */
import { useState, useEffect } from "react";

/**
 * The viewport width (in pixels) below which the application is considered to be in "mobile" mode.
 */
const MOBILE_BREAKPOINT = 768; // Common breakpoint for tablets/mobile devices

/**
 * Custom hook `useIsMobile`.
 * Listens to window resize events and returns `true` if the window width
 * is less than `MOBILE_BREAKPOINT`, `false` otherwise.
 * Returns `undefined` during server-side rendering or before the first client-side check.
 *
 * @returns {boolean} `true` if the screen is considered mobile, `false` otherwise.
 *                    Returns `undefined` on the server or before initial client-side hydration.
 */
export function useIsMobile() {
  // State to store whether the viewport is mobile-sized.
  // Initialized to undefined to handle SSR scenarios where `window` is not available.
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Ensure this code runs only on the client-side where `window` is available.
    if (typeof window === 'undefined') {
      return;
    }

    // Media query list object to detect changes in viewport width.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    /**
     * Handler function to update the `isMobile` state based on the current window width.
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add event listener for changes in the media query match status.
    mql.addEventListener("change", onChange);
    
    // Set the initial state based on the current window width.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup function to remove the event listener when the component unmounts.
    return () => mql.removeEventListener("change", onChange);
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount.

  return !!isMobile; // Coerce `undefined` to `false` for simpler boolean checks in components.
}
