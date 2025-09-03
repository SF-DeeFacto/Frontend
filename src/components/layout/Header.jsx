import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiBell } from 'react-icons/fi';
import Icon from '../common/Icon';
import Text from '../common/Text';
import { notificationApi } from '../../services/api/notification_api';
import { weatherApi } from '../../services/api/weather_api';

const Header = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [alarmCount, setAlarmCount] = useState(0); // 기본값을 0으로 설정
  const [currentTime, setCurrentTime] = useState(new Date()); // 실시간 시간 상태
  

  

  
  // alarmCount 상태 변화 감지 (배포 시 주석 처리)
  // useEffect(() => {
  //   console.log('alarmCount 상태 변경됨:', alarmCount);
  // }, [alarmCount]);

  // 사용자 정보 로드 및 인증 체크
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      console.log('인증 정보가 없습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      if (!user.name || !user.employeeId) {
        console.log('사용자 정보가 불완전합니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
        return;
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      navigate('/login');
    }
  }, [navigate]);

  // localStorage 변화 감지 (다른 탭에서 로그인/로그아웃 시, 알림 카운터 업데이트)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'access_token') {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          navigate('/login');
        } else {
          try {
            const user = JSON.parse(userData);
            setCurrentUser(user);
          } catch (error) {
            console.error('사용자 정보 파싱 오류:', error);
            navigate('/login');
          }
        }
      }
      
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
  }, [navigate]);

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

  // 스타일 객체들
  const styles = {
    header: {
      backgroundColor: '#F0F0F980',
      borderColor: '#F0F0F9'
    },
    logo: {
      marginLeft: '30px',
      height: '100%'
    },
    timeInfo: {
      marginRight: '50px'
    },
    userNav: {
      marginRight: '40px'
    },
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

  // 시간 정보 컴포넌트
  const TimeInfo = () => {
    return (
      <div
        className="flex flex-row items-center justify-center h-full w-auto whitespace-nowrap"
        style={styles.timeInfo}
      >
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={refreshWeatherInfo}
          title="날씨 정보 새로고침"
        >
          <Text variant="body" size="sm" weight="normal">
           {weatherData ? (
             <>
               {weatherData.icon && (
                 <span className="mr-1">
                   {weatherData.icon === '01d' ? '☀️' : 
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
                    weatherData.icon === '50n' ? '🌫️' : '🌤️'}
                 </span>
               )}
               {weatherData.description ? translateWeatherDescription(weatherData.description) : (weatherData.main || '날씨')}
               {weatherData.temp && ` ${Math.round(weatherData.temp)}°C`}
             </>
           ) : (
             <span className="text-gray-500">날씨 정보 로딩중...</span>
           )}
         </Text>
      </div>
      <Text variant="body" size="sm" weight="normal" style={{ marginLeft: '25px' }}>
        {dateString} {weekdayString} {timeString}
      </Text>
      </div>
    );
  };

  // 사용자 네비게이션 컴포넌트
  const UserNavigation = () => (
    <nav className="flex items-center justify-center h-full" style={styles.userNav}>
      <div className="flex items-center justify-center h-full">
        <Icon className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors flex items-center justify-center">
          <FiSettings onClick={() => navigate("/home/setting")} />
        </Icon>
      </div>
      
      <div
        className="relative cursor-pointer flex items-center justify-center h-full"
        onClick={() => navigate("/home/alarm")}
        style={styles.notificationDot}
      >
        <Icon className="text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center">
          <FiBell />
        </Icon>
        
        {/* 알림 개수 뱃지 */}
        {alarmCount > 0 && (
          <span className="absolute top-2 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
            {alarmCount > 99 ? '99+' : alarmCount}
        </span>
        )}
        
        {/* 기존 알림 점 (알림이 없을 때만 표시) */}
        {alarmCount === 0 && (
          <span className="absolute top-2 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </div>
      
      <Text 
        variant="body" 
        size="sm" 
        weight="medium" 
        color="gray-800"
        className="whitespace-nowrap flex items-center justify-center h-full"
        style={styles.userName}
      >
        {currentUser?.name ? `${currentUser.name} 사원` : '사용자'}
      </Text>
    </nav>
  );



  return (
    <header 
      className="flex w-full h-[54px] justify-between items-center flex-shrink-0 border-b" 
      style={styles.header}
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