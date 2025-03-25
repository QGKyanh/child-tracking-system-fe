import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({ children, shouldLogin, shouldLogout, requiredRole }) => {
  const nav = useNavigate();
  const authState = useSelector(state => state.authSlice);
  const userRole = authState?.user?.role ?? 0;

  useEffect(() => {
    // Check for authentication
    if (!authState.isAuthenticated && shouldLogin) {
      return nav('/login?need_login=true');
    }

    // Check for logout condition
    if (authState.isAuthenticated && shouldLogout) {
      return nav('/');
    }

    // Check for role permission
    if (
      authState.isAuthenticated &&
      requiredRole !== undefined &&
      requiredRole !== userRole
    ) {
      return nav('/no-permission');
    }
  }, [authState, nav, shouldLogout, shouldLogin, requiredRole, userRole]);

  return children;
};

export default AuthCheck;
