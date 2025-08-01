import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWeatherData } from '../dummy/services/weather';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshWeather = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchWeatherData();
      if (result.success && result.data) {
        setWeatherData(result.data);
      } else {
        setError(result.message || '날씨 정보를 가져오는데 실패했습니다.');
      }
    } catch (err) {
      setError('날씨 정보를 가져오는데 실패했습니다.');
      console.error('날씨 정보 가져오기 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWeather();
    
    // 5분마다 날씨 정보 업데이트
    const interval = setInterval(refreshWeather, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    weatherData,
    isLoading,
    error,
    refreshWeather,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}; 