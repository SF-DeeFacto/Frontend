import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiBell } from 'react-icons/fi';
import Icon from '../common/Icon';
import Text from '../common/Text';

const Header = () => {
  const navigate = useNavigate();

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
    }
  };

  const { dateString, weekdayString, timeString } = getCurrentTimeInfo();

  // 로고 컴포넌트
  const Logo = () => (
    <div className="flex items-center" style={styles.logo}>
      <span 
        className="flex items-center justify-center w-[24px] h-[24px] text-2xl" 
        style={styles.logoIcon}
      >
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
    <div
      className="flex flex-row items-center justify-center h-full w-auto whitespace-nowrap"
      style={styles.timeInfo}
    >
      <Text variant="body" size="sm" weight="bold">
        {dateString} {weekdayString} {timeString}
      </Text>
      <Text variant="body" size="sm" weight="normal" className="ml-6">
        날씨 정보 가져왕왕
      </Text>
    </div>
  );

  // 사용자 네비게이션 컴포넌트
  const UserNavigation = () => (
    <nav className="flex items-center justify-center h-full" style={styles.userNav}>
      <Icon className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
        <FiSettings onClick={() => navigate("/setting")} />
      </Icon>
      
      <div
        className="relative cursor-pointer"
        onClick={() => navigate("/alarm")}
        style={styles.notificationDot}
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
        className="whitespace-nowrap"
        style={styles.userName}
      >
        홍길동 사원
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