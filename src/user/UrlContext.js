import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the Context
const UrlContext = createContext();

// Provider Component
export const UrlProvider = ({ children }) => {
  const [serverUrl, setServerUrl] = useState('');

  useEffect(() => {
    const loadServerUrl = async () => {
      try {
        const url = await AsyncStorage.getItem('serverUrl');
        if (url) {
          setServerUrl(url);
        }
      } catch (e) {
        console.error('Failed to load server URL:', e);
      }
    };

    loadServerUrl();
  }, []);

  const saveServerUrl = async (url) => {
    try {
      await AsyncStorage.setItem('serverUrl', url);
      setServerUrl(url);
    } catch (e) {
      console.error('Failed to save server URL:', e);
      throw e;
    }
  };

  return (
    <UrlContext.Provider value={{ serverUrl, saveServerUrl }}>
      {children}
    </UrlContext.Provider>
  );
};

// Custom hook to use the context
export const useUrl = () => useContext(UrlContext);
