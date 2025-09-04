import React, { useState, useEffect } from 'react';
import { FiSettings, FiBell } from 'react-icons/fi';
import Icon from '../common/Icon';
import Text from '../common/Text';
import { notificationApi } from '../../services/api/notification_api';
import { weatherApi } from '../../services/api/weather_api';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [alarmCount, setAlarmCount] = useState(0); // 기본값을 0으로 설정
  const [currentTime, setCurrentTime] = useState(new Date()); // 실시간 시간 상태
  
  // 인증 상태 및 사용자 정보 가져오기
  const { user: currentUser, logout } = useAuth();

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
    // 5분마다 날씨 정보 업데이트
    const interval = setInterval(getWeatherInfo, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 알림 개수 가져오기
  useEffect(() => {
    const fetchAlarmCount = async () => {
      try {
        console.log('알림 개수 API 호출 시작...');
        const response = await notificationApi.getUnreadNotificationCount();
        console.log('알림 개수 API 응답:', response);
        
        if (response?.data !== undefined) {
          // API에서 직접 안읽음 개수 반환 (response.data에 숫자 값)
          console.log('설정할 알림 개수:', response.data);
          setAlarmCount(response.data);
          // localStorage에도 저장
          localStorage.setItem('unread_alarm_count', response.data.toString());
        } else {
          // API 응답이 없을 경우 0으로 설정
          console.log('응답 데이터가 없어서 0으로 설정');
          setAlarmCount(0);
          localStorage.setItem('unread_alarm_count', '0');
        }
      } catch (error) {
        console.error('알림 개수 API 호출 실패:', error);
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
      'broken clouds': '구름 많음',
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

  // 시간 정보 컴포넌트 - 심플하고 깔끔한 디자인
  const TimeInfo = () => {
    return (
      <div
        className="flex items-center gap-6 h-full"
        style={styles.timeInfo}
      >
        {/* 날씨 정보 - 심플한 인라인 스타일 */}
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity duration-200 flex items-center gap-2"
          onClick={refreshWeatherInfo}
          title="날씨 정보 새로고침"
        >
          <span className="text-base">
            {weatherData ? (
              weatherData.icon === '01d' ? '☀️' : 
              weatherData.icon === '01n' ? '🌙' :
              weatherData.icon === '02d' ? '⛅' : 
              weatherData.icon === '02n' ? '☁️' :
              weatherData.icon === '03d' ? '☁️' : 
              weatherData.icon === '03n' ? '☁️' :
              weatherData.icon === '04d' ? '☁️' : 
              weatherData.icon === '04n' ? '☁️' :
              weatherData.icon === '09d' ? '🌧️' : 
              weatherData.icon === '09n' ? '🌧️' :
              weatherData.icon === '10d' ? '🌦️' : 
              weatherData.icon === '10n' ? '🌧️' :
              weatherData.icon === '11d' ? '⛈️' : 
              weatherData.icon === '11n' ? '⛈️' :
              weatherData.icon === '13d' ? '❄️' : 
              weatherData.icon === '13n' ? '❄️' :
              weatherData.icon === '50d' ? '🌫️' : 
              weatherData.icon === '50n' ? '🌫️' : '🌤️'
            ) : '🌤️'}
          </span>
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
        
        {/* 시간 정보 - 한 줄로 표현 */}
        <div>
          <Text variant="body" size="sm" weight="normal" color="secondary-500">
            {dateString} {weekdayString} {timeString}
          </Text>
        </div>
      </div>
    );
  };

  // 사용자 네비게이션 컴포넌트 - 간격 조정된 깔끔한 디자인
  const UserNavigation = () => (
    <nav className="flex items-center h-full" style={styles.userNav}>
      {/* 설정 버튼 - 심플한 아이콘 버튼 */}
      <button
        onClick={() => navigate("/home/setting")}
        className="p-5 hover:bg-brand-light/50 dark:hover:bg-neutral-700/50 rounded-lg transition-all duration-200"
        title="설정"
      >
        <Icon className="text-secondary-500 dark:text-neutral-300 hover:text-brand-main transition-colors">
          <FiSettings size={20} />
        </Icon>
      </button>
      
      {/* 알림 버튼 - 심플한 아이콘 버튼 */}
      <button
        onClick={() => navigate("/home/alarm")}
        className="relative p-1.5 hover:bg-brand-light/50 dark:hover:bg-neutral-700/50 rounded-lg transition-all duration-200 ml-1"
        title="알림"
      >
        <Icon className="text-secondary-500 dark:text-neutral-300 hover:text-brand-main transition-colors">
          <FiBell size={20} />
        </Icon>
        
        {/* 알림 개수 뱃지 */}
        {alarmCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
            {alarmCount > 99 ? '99+' : alarmCount}
          </span>
        )}
        
        {/* 알림 점 (알림이 없을 때) */}
        {alarmCount === 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
        )}
      </button>
      
      {/* 구분선 */}
      <div className="h-6 w-px bg-brand-medium/50 dark:bg-neutral-600/50 mx-4"></div>
      
      {/* 사용자 정보 - 텍스트만 */}
      <div>
        <Text 
          variant="body" 
          size="sm" 
          weight="normal" 
          color="secondary-500"
          className="whitespace-nowrap"
        >
          {currentUser?.name ? `${currentUser.name} 사원` : '사용자'}
        </Text>
      </div>
    </nav>
  );



  return (
    <header 
      className="flex w-full h-[60px] justify-between items-center flex-shrink-0 relative z-50 px-6 bg-gradient-to-r from-brand-light/95 to-brand-medium/95 dark:from-neutral-800/95 dark:to-neutral-700/95 backdrop-blur-md border-b border-white/20 dark:border-neutral-700/30 shadow-soft transition-colors duration-300" 
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