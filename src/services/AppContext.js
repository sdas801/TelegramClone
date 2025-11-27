import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const userIdValue = await AsyncStorage.getItem('userId');
        const authValue = await AsyncStorage.getItem('auth');
        const userDataValue = await AsyncStorage.getItem('user_data');

        setUserId(userIdValue ? JSON.parse(userIdValue) : null);
        setAuth(authValue ? JSON.parse(authValue) : null);
        setUserData(userDataValue ? JSON.parse(userDataValue) : null);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadValue();
  }, []);
  return (
    <AppContext.Provider value={{ userId, auth, userData,isLoading, setUserId, setAuth, setUserData}}>
      {children}
    </AppContext.Provider>
  );
};