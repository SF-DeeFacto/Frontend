import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Bell, 
  Sun, 
  Moon, 
  Cloud, 
  CloudSun,
  CloudMoon,
  CloudDrizzle,
  CloudRain, 
  CloudLightning,
  Snowflake,
  CloudFog,
  Lightbulb,
  LightbulbOff
} from 'lucide-react';
import Icon from '../common/Icon';
import Text from '../common/Text';
import { notificationApi } from '../../services/api/notification_api';
import { weatherApi } from '../../services/api/weather_api';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [alarmCount, setAlarmCount] = useState(0); // 기본값을 0으로 설정
  const [currentTime, setCurrentTime] = useState(new Date()); // 실시간 시간 상태
  
  // 인증 상태 및 사용자 정보 가져오기
  const { 
    user: currentUser, 
    logout, 
    isAuthenticated, 
    isLoading,
    updateUser,
    isAdmin,
    isUser 
  } = useAuth({ redirectOnFail: false });

  // alarmCount 상태 변화 감지 (배포 시 주석 처리)
  // useEffect(() => {
  //   console.log('alarmCount 상태 변경됨:', alarmCount);
  // }, [alarmCount]);

  // 알림 카운터 변화 감지 (localStorage 변화)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // 알림 카운터 업데이트 감지
      if (e.key === 'unread_alarm_count') {
        const newCount = parseInt(e.newValue || '0', 10);
        setAlarmCount(newCount);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 날씨 정보 가져오기
  useEffect(() => {
    const getWeatherInfo = async () => {
      const result = await weatherApi.getCurrentWeather();
      
      if (result.success) {
        setWeatherData(result.data.data);
      }
    };

    getWeatherInfo();
    // 1시간마다 날씨 정보 업데이트
    const interval = setInterval(getWeatherInfo, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 알림 개수 가져오기
  useEffect(() => {
    const fetchAlarmCount = async () => {
      try {
        const response = await notificationApi.getUnreadNotificationCount();
        
        if (response?.data !== undefined) {
          // API에서 직접 안읽음 개수 반환 (response.data에 숫자 값)
          setAlarmCount(response.data);
          // localStorage에도 저장
          localStorage.setItem('unread_alarm_count', response.data.toString());
        } else {
          // API 응답이 없을 경우 0으로 설정
          setAlarmCount(0);
          localStorage.setItem('unread_alarm_count', '0');
        }
      } catch (error) {
        // API 실패 시 0으로 설정
        setAlarmCount(0);
        localStorage.setItem('unread_alarm_count', '0');
      }
    };

    // 초기 로드 시 localStorage에서 알림 카운터 확인
    const storedCount = localStorage.getItem('unread_alarm_count');
    if (storedCount) {
      const count = parseInt(storedCount, 10);
      setAlarmCount(count);
    }
    
    // 항상 최신 데이터를 위해 API 호출 (localStorage 값이 있어도)
    fetchAlarmCount();
    
    // 30초마다 알림 개수 업데이트
    const interval = setInterval(fetchAlarmCount, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 실시간 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 1초마다 업데이트
    
    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // 현재 시간 정보 가져오기
  const getCurrentTimeInfo = () => {
    const dateString = currentTime.toLocaleDateString();
    const weekdayString = `(${currentTime.toLocaleDateString('ko-KR', { weekday: 'short' })})`;
    const timeString = currentTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return { dateString, weekdayString, timeString };
  };

  // 스타일 객체들 - 브랜드 색상 적용하면서 심플한 디자인
  const styles = {
    header: {
      background: 'linear-gradient(135deg, rgba(240, 240, 249, 0.95) 0%, rgba(229, 229, 242, 0.95) 100%)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(229, 229, 242, 0.6)',
      boxShadow: '0 1px 2px rgba(73, 79, 162, 0.1)'
    },
    logo: {
      height: '100%'
    },
    timeInfo: {},
    userNav: {},
    logoIcon: {
      fontSize: '24px',
      lineHeight: '24px'
    },
    notificationDot: {
      marginLeft: '25px'
    },
    userName: {
      marginLeft: '25px'
    },
    weatherInfo: {
      marginLeft: '25px'
    },
  };

  const { dateString, weekdayString, timeString } = getCurrentTimeInfo();

  // 로고 컴포넌트
  const Logo = () => (
    <div className="flex items-center" style={styles.logo}>
      <img 
        src="/logo2.png" 
        alt="DeeFacto Logo" 
        className="w-[47px] h-[40px]"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <span 
        className="flex items-center justify-center w-[50px] h-[50px] text-4xl hidden"
        style={{ ...styles.logoIcon, display: 'none' }}
      >
        🧊
      </span>
      {/* <Text
        variant="title"
        size="xl"
        weight="extrabold"
        color="blue-600"
        className="ml-3"
      >
        Deefacto
      </Text> */}
    </div>
  );

  // 날씨 설명을 한국어로 번역하는 함수
  const translateWeatherDescription = (description) => {
    const weatherMap = {
      'clear sky': '맑음',
      'few clouds': '구름 조금',
      'scattered clouds': '구름 많음',
      'broken clouds': '흐림',
      'shower rain': '소나기',
      'rain': '비',
      'thunderstorm': '천둥번개',
      'snow': '눈',
      'mist': '안개',
      'overcast clouds': '흐림'
    };
    
    return weatherMap[description] || description;
  };

  // 날씨 정보 새로고침 함수
  const refreshWeatherInfo = async () => {
    const result = await weatherApi.refreshWeather();
    if (result.success) {
      setWeatherData(result.data.data);
    }
  };


  // 사용자 네비게이션 컴포넌트 - 간격 조정된 깔끔한 디자인
  const UserNavigation = () => (
    <nav className="flex items-center h-full gap-4" style={styles.userNav}>
      {/* 날씨 정보 */}
      <div 
        className="cursor-pointer hover:opacity-80 transition-opacity duration-200 flex items-center gap-2"
        onClick={refreshWeatherInfo}
        title="날씨 정보 새로고침"
      >
        <Icon size="xs" className="text-secondary-500 dark:text-neutral-300 hover:text-brand-main transition-colors">
          {weatherData ? (
            weatherData.icon === '01d' ? <Sun /> : 
            weatherData.icon === '01n' ? <Moon /> :
            weatherData.icon === '02d' ? <CloudSun /> : 
            weatherData.icon === '02n' ? <CloudMoon /> :
            weatherData.icon === '03d' ? <Cloud /> : 
            weatherData.icon === '03n' ? <Cloud /> :
            weatherData.icon === '04d' ? <Cloud /> : 
            weatherData.icon === '04n' ? <Cloud /> :
            weatherData.icon === '09d' ? <CloudDrizzle /> : 
            weatherData.icon === '09n' ? <CloudDrizzle /> :
            weatherData.icon === '10d' ? <CloudRain /> : 
            weatherData.icon === '10n' ? <CloudRain /> :
            weatherData.icon === '11d' ? <CloudLightning /> : 
            weatherData.icon === '11n' ? <CloudLightning /> :
            weatherData.icon === '13d' ? <Snowflake /> : 
            weatherData.icon === '13n' ? <Snowflake /> :
            weatherData.icon === '50d' ? <CloudFog /> : 
            weatherData.icon === '50n' ? <CloudFog /> : <Sun />
          ) : <Sun />}
        </Icon>
        <Text variant="body" size="sm" weight="normal" color="secondary-500">
          {weatherData ? (
            <>
              {weatherData.description ? translateWeatherDescription(weatherData.description) : (weatherData.main || '날씨')}
              {weatherData.temp && ` ${Math.round(weatherData.temp)}°C`}
            </>
          ) : (
            <span className="text-secondary-500">로딩중...</span>
          )}
        </Text>
      </div>
      
      {/* 구분선 */}
      <div className="h-4 w-px bg-brand-medium/50 dark:bg-neutral-600/50"></div>
      
      {/* 시간 정보 */}
      <div>
        <Text variant="body" size="sm" weight="normal" color="secondary-500">
          {dateString} {weekdayString} {timeString}
        </Text>
      </div>
      
      {/* 구분선 */}
      <div className="h-4 w-px bg-brand-medium/50 dark:bg-neutral-600/50"></div>
      
      {/* 다크모드 토글 버튼 */}
      <button
        onClick={toggleTheme}
        className="p-0 hover:bg-brand-light/50 dark:hover:bg-neutral-700/50 rounded-lg transition-all duration-200"
        title={theme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경'}
      >
        <Icon className="text-secondary-500 dark:text-neutral-300 hover:text-brand-main transition-colors">
          {/* {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />} */}
          {theme === 'dark' ? <LightbulbOff /> : <Lightbulb />}
        </Icon>
      </button>

      {/* 구분선 */}
      <div className="h-4 w-px bg-brand-medium/50 dark:bg-neutral-600/50"></div>

      {/* 알림 버튼 */}
      <button
        onClick={() => navigate("/home/alarm")}
        className="relative p-0 hover:bg-brand-light/50 dark:hover:bg-neutral-700/50 rounded-lg transition-all duration-200"
        title="알림"
      >
        <Icon className="text-secondary-500 dark:text-neutral-300 hover:text-brand-main transition-colors">
          <Bell />
        </Icon>
        
        {/* 알림 개수 뱃지 - 알림이 있을 때만 표시 */}
        {alarmCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[18px] h-[14px] bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
            {alarmCount > 99 ? '99+' : alarmCount}
          </span>
        )}
      </button>
      
      {/* 구분선 */}
      <div className="h-4 w-px bg-brand-medium/50 dark:bg-neutral-600/50"></div>

      {/* 설정 버튼 */}
      <button
        onClick={() => navigate("/home/setting")}
        className="p-0 hover:bg-brand-light/50 dark:hover:bg-neutral-700/50 rounded-lg transition-all duration-200"
        title="설정"
      >
        <Icon className="text-secondary-500 dark:text-neutral-300 hover:text-brand-main transition-colors">
          <Settings />
        </Icon>
      </button>
      
      {/* 구분선 */}
      <div className="h-4 w-px bg-brand-medium/50 dark:bg-neutral-600/50"></div>
      
      {/* 사용자 정보 */}
      <div>
        <Text 
          variant="body" 
          size="sm"
          weight="bold"
          color="secondary-500 dark:text-neutral-400"
          className="whitespace-nowrap tracking-wide"
        >
          {isAuthenticated && currentUser?.name 
            ? `${currentUser.name} ${currentUser.position || '사원'}` 
            : '사용자'
          }
        </Text>
      </div>
    </nav>
  );



  // 로딩 중이면 스피너 표시
  if (isLoading) {
    return (
      <header className="flex w-full h-[60px] justify-between items-center flex-shrink-0 relative z-50 px-6 bg-gradient-to-r from-brand-light/95 to-brand-medium/95 dark:from-neutral-800/95 dark:to-neutral-700/95 backdrop-blur-md border-b border-white/20 dark:border-neutral-700/30 shadow-soft transition-colors duration-300">
        <Logo />
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-brand-main border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-secondary-500">로딩중...</span>
        </div>
      </header>
    );
  }

  return (
    <header 
      className="flex w-full h-[60px] justify-between items-center flex-shrink-0 relative z-50 px-6 bg-gradient-to-r from-brand-light/95 to-brand-medium/95 dark:from-neutral-800/95 dark:to-neutral-700/95 backdrop-blur-md border-b border-white/20 dark:border-neutral-700/30 shadow-soft transition-colors duration-300" 
    >
      <Logo />
      
      {/* 중앙 공간 */}
      <div className="flex-1"></div>
      
      <UserNavigation />
    </header>
  );
};

export default Header; 