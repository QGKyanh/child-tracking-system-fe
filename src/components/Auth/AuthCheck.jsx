import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({
  children,
  shouldLogin,
  shouldLogout,
  requiredRole,
  blockAdmin = true,
}) => {
  const nav = useNavigate();
  const authState = useSelector(state => state.authSlice);
  const userRole = authState?.user?.role ?? 0;

  // Define admin role constant
  const ADMIN_ROLE = 1;

  useEffect(() => {
    // Check for authentication
    if (!authState.isAuthenticated && shouldLogin) {
      return nav('/login?need_login=true');
    }

    // Check for logout condition
    if (authState.isAuthenticated && shouldLogout) {
      return nav('/');
    }

    // Block admin users from accessing the site (unless this check is disabled)
    if (authState.isAuthenticated && blockAdmin && userRole === ADMIN_ROLE) {
      return nav('/no-permission');
    }

    // Check for role permission (for other role-based access)
    if (
      authState.isAuthenticated &&
      requiredRole !== undefined &&
      requiredRole !== userRole
    ) {
      return nav('/no-permission');
    }
  }, [
    authState,
    nav,
    shouldLogout,
    shouldLogin,
    requiredRole,
    userRole,
    blockAdmin,
  ]);

  return children;
};

export default AuthCheck;
