import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiBell } from 'react-icons/fi';
import Icon from '../common/Icon';
import Text from '../common/Text';
import { useAuth } from '../../contexts/AuthContext';
import { useWeather } from '../../contexts/WeatherContext';
import { useTime } from '../../hooks/useTime';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { weatherData, isLoading: weatherLoading } = useWeather();
  const { fullDateTime } = useTime();

  // 로고 컴포넌트
  const Logo = () => (
    <div className="flex items-center ml-[30px] h-full">
      <span className="flex items-center justify-center w-[24px] h-[24px] text-2xl">
        🧊
      </span>
      <Text
        variant="title"
        size="xl"
        weight="extrabold"
        color="blue-600"
        className="ml-3"
      >
        Deefacto
      </Text>
    </div>
  );

  // 시간 정보 컴포넌트
  const TimeInfo = () => (
    <div className="flex flex-row items-center justify-center h-full w-auto whitespace-nowrap mr-[50px]">
      <Text variant="body" size="sm" weight="bold">
        {fullDateTime}
      </Text>
      <Text variant="body" size="sm" weight="normal" className="ml-[25px]">
        {weatherLoading 
          ? '날씨 정보 로딩중...' 
          : weatherData 
            ? `${weatherData.weather} ${weatherData.temperature}°C` 
            : '날씨 정보 없음'
        }
      </Text>
    </div>
  );

  // 사용자 네비게이션 컴포넌트
  const UserNavigation = () => (
    <nav className="flex items-center justify-center h-full mr-[40px]">
      <Icon className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
        <FiSettings onClick={() => navigate("/setting")} />
      </Icon>
      
      <div
        className="relative cursor-pointer ml-[25px]"
        onClick={() => navigate("/alarm")}
      >
        <Icon className="text-gray-500 hover:text-gray-700 transition-colors">
          <FiBell />
        </Icon>
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
      </div>
      
      <Text 
        variant="body" 
        size="sm" 
        weight="medium" 
        color="gray-800"
        className="whitespace-nowrap ml-[25px]"
      >
        {user ? `${user.name} 사원` : '사용자'}
      </Text>
    </nav>
  );

  return (
    <header 
      className="flex w-full h-[54px] justify-between items-center flex-shrink-0 border-b"
      style={{
        backgroundColor: '#F0F0F980',
        borderColor: '#F0F0F9'
      }}
    >
      <Logo />
      
      {/* 중앙 공간 */}
      <div className="flex-1"></div>
      
      <TimeInfo />
      
      <UserNavigation />
    </header>
  );
};

export default Header; 