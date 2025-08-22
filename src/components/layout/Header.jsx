import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiBell } from 'react-icons/fi';
import Icon from '../common/Icon';
import Text from '../common/Text';
import { fetchWeatherData } from '../../dummy/services/weather';
import { dashboardApi } from '../../services/api/dashboard_api';

const Header = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [alarmCount, setAlarmCount] = useState(3); // 기본값을 3으로 설정

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

  // localStorage 변화 감지 (다른 탭에서 로그인/로그아웃 시)
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
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  // 날씨 정보 가져오기 (더미 데이터 사용)
  useEffect(() => {
    const getWeatherInfo = async () => {
      try {
        const result = await fetchWeatherData();
        if (result.success) {
          setWeatherData(result.data);
        }
      } catch (error) {
        console.error('날씨 정보 가져오기 실패:', error);
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
        const response = await dashboardApi.getNotifications();
        if (response?.data && Array.isArray(response.data)) {
          // 안읽음 알림 개수만 카운트
          const unreadCount = response.data.filter(alarm => !alarm.isRead).length;
          setAlarmCount(unreadCount);
        } else {
          // API 실패 시 더미 데이터로 카운트
          setAlarmCount(3);
        }
      } catch (error) {
        console.log('알림 개수 API 호출 실패, 더미 데이터 사용:', error);
        // 더미 데이터로 카운트
        setAlarmCount(3);
      }
    };

    fetchAlarmCount();
    
    // 30초마다 알림 개수 업데이트
    const interval = setInterval(fetchAlarmCount, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 현재 시간 정보 가져오기
  const getCurrentTimeInfo = () => {
    const currentTime = new Date();
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

  // 시간 정보 컴포넌트
  const TimeInfo = () => (
    <div
      className="flex flex-row items-center justify-center h-full w-auto whitespace-nowrap"
      style={styles.timeInfo}
    >
      <Text variant="body" size="sm" weight="normal">
        {weatherData ? `${weatherData.weather} ${weatherData.temperature}°C` : '날씨 정보 로딩중...'}
      </Text>
      <Text variant="body" size="sm" weight="normal" style={{ marginLeft: '25px' }}>
        {dateString} {weekdayString} {timeString}
      </Text>
    </div>
  );

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