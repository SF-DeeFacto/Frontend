import { useState, useEffect } from 'react';

export const useTime = () => {
  const [timeInfo, setTimeInfo] = useState({
    dateString: '',
    weekdayString: '',
    timeString: '',
    fullDateTime: '',
  });

  useEffect(() => {
    const updateTime = () => {
      const currentTime = new Date();
      
      const dateString = currentTime.toLocaleDateString('ko-KR');
      const weekdayString = `(${currentTime.toLocaleDateString('ko-KR', { weekday: 'short' })})`;
      const timeString = currentTime.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const fullDateTime = `${dateString} ${weekdayString} ${timeString}`;

      setTimeInfo({
        dateString,
        weekdayString,
        timeString,
        fullDateTime,
      });
    };

    // 초기 시간 설정
    updateTime();

    // 1초마다 시간 업데이트
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeInfo;
}; 