import { createContext, useContext, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, loadProfile } from '../store/authSlice.js';
import { queryClient } from '../lib/queryClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: Boolean(token),
      logout: () => {
        queryClient.clear();
        dispatch(logout());
      },
      refreshProfile: () => dispatch(loadProfile()),
    }),
    [user, token, loading, error, dispatch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
