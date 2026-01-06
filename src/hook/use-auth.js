// src/hook/useAuth.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { syncUserFromStorage } from '../store/slices/userSlice';

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Sync Redux with localStorage on app mount
    dispatch(syncUserFromStorage());
  }, [dispatch]);
};

export default useAuth;