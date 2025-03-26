import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook to prevent browser back navigation from dashboard to login
 * Uses multiple strategies to prevent back navigation:
 * 1. History manipulation (pushState)
 * 2. Popstate event handling
 * 3. Browser beforeunload event (for added security)
 * 
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @returns {void}
 */
const usePreventBackNavigation = (isAuthenticated) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only add the event listeners if the user is authenticated
    if (isAuthenticated) {
      // Function to handle popstate (back/forward button clicks)
      const handlePopState = (event) => {
        // Push current state again to prevent going back
        window.history.pushState(null, document.title, location.pathname);
        
        // If the user is authenticated and tries to navigate back
        if (location.pathname === '/dashboard') {
          // Navigate back to dashboard with replace to clear history
          navigate('/dashboard', { replace: true });
        }
      };
      
      // Handle page refresh or tab close attempts
      const handleBeforeUnload = (event) => {
        if (location.pathname === '/dashboard') {
          // Standard way to show a confirmation dialog
          event.preventDefault();
          // For modern browsers
          event.returnValue = '';
        }
      };

      // First, clear any existing history by replacing the current state
      window.history.replaceState(null, document.title, location.pathname);
      
      // Then add a new history entry to prevent going back to login
      window.history.pushState(null, document.title, location.pathname);
      
      // Add another entry for extra security
      window.history.pushState(null, document.title, location.pathname);
      
      // Listen for back button clicks
      window.addEventListener('popstate', handlePopState);
      
      // Add warning when user tries to leave the page (optional)
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        // Clean up event listeners
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isAuthenticated, navigate, location.pathname]);
};

export default usePreventBackNavigation;
