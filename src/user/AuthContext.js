import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          try {
            const decodedToken = jwtDecode(parsedUser.token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
              console.log('Token has expired');
              await AsyncStorage.removeItem('user');
              setUser(null);
            } else {
              setUser(parsedUser);
              console.log('User loaded from AsyncStorage:', parsedUser);
            }
          } catch (tokenError) {
            console.error('Invalid token:', tokenError);
            await AsyncStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Failed to load user from AsyncStorage:', error);
      }
    };

    loadUser();
  }, []);

  const login = async (userInfo) => {
    try {
      const decodedToken = jwtDecode(userInfo.token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.log('Token is expired');
        Alert.alert('Error', 'Token is expired. Please log in again.');
        return;
      }

      setUser(userInfo);
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));
      console.log('User info saved to AsyncStorage:', userInfo);
    } catch (error) {
      console.error('Failed to save user to AsyncStorage:', error);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
      console.log('User info removed from AsyncStorage');
    } catch (error) {
      console.error('Failed to remove user from AsyncStorage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
