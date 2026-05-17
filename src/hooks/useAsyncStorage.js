import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAsyncStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (mounted) {
          if (item !== null) {
            setStoredValue(JSON.parse(item));
          }
          isInitialized.current = true;
          setIsLoading(false);
        }
      } catch (e) {
        console.error('Failed to load from AsyncStorage:', e);
        if (mounted) {
          isInitialized.current = true;
          setIsLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, [key]);

  // Persist to AsyncStorage on state change (after initialization)
  useEffect(() => {
    if (!isInitialized.current) return;
    (async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(storedValue));
      } catch (e) {
        console.error('Failed to save to AsyncStorage:', e);
      }
    })();
  }, [key, storedValue]);

  const setValue = useCallback((value) => {
    setStoredValue(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      return newValue;
    });
  }, []);

  return [storedValue, setValue, isLoading];
}
