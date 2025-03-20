import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook to prevent browser back navigation from dashboard to login
 * 
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @returns {void}
 */
const usePreventBackNavigation = (isAuthenticated) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only add the event listener if the user is authenticated
    if (isAuthenticated) {
      // Function to handle popstate (back/forward button clicks)
      const handlePopState = (event) => {
        // If the user is authenticated and tries to navigate back to login page
        if (location.pathname === '/dashboard') {
          // Prevent the default behavior
          event.preventDefault();
          // Stay on the dashboard (push a new entry to replace the one we're preventing)
          navigate('/dashboard', { replace: true });
        }
      };

      // Handle any attempt to use the back button
      window.history.pushState(null, '', location.pathname);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isAuthenticated, navigate, location.pathname]);
};

export default usePreventBackNavigation;
