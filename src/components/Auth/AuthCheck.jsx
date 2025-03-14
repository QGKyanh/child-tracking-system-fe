import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({ children, shouldLogin, shouldLogout }) => {
  const nav = useNavigate();
  const authState = useSelector(state => state.authSlice);

  useEffect(() => {
    if (!authState.isAuthenticated && shouldLogin) {
      return nav('/login?need_login=true');
    }

    if (authState.isAuthenticated && shouldLogout) {
      return nav('/');
    }
  }, [authState, nav, shouldLogout, shouldLogin]);

  return children;
};

export default AuthCheck;
