import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connectNotificationSSE } from '../../services/sse';
import { notificationApi } from '../../services/api/notification_api';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { transformNotificationData, stripHtmlTags, formatKoreaTime } from '../../utils/notificationUtils';

/**
 * 실시간 경고 알림 (커스텀 알림창)
 */
const AlertPopup = () => {
  const { isAuthenticated, isLoading } = useAuth({ redirectOnFail: false });
  const [alerts, setAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [autoCloseTimers, setAutoCloseTimers] = useState(new Map());

  // 테스트용 알림 생성 함수들을 window 객체에 노출 (개발 환경에서만)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.testAlert = {
        // 기본 알림 생성
        createAlert: (customData = {}) => {
          const defaultData = {
            notiId: Date.now(),
            notiType: 'ALERT',
            zoneId: 'a01',
            title: '[2025-01-15 14:30:00] TEMP-001 센서 이상치 초과 알림',
            content: '현재시간 2025-01-15 14:30:00<br>a01 구역 temperature 타입 센서 TEMP-001에서 값 23.9°C가 정상 범위를 초과했습니다.',
            timestamp: new Date().toISOString()
          };
          
          const testData = { ...defaultData, ...customData };
          addAlert(testData);
        },
        
        // 온도 센서 알림
        createTempAlert: (zoneId = 'a01', value = 25.5) => {
          const alertData = {
            notiId: Date.now(),
            title: `[${new Date().toLocaleString('ko-KR')}] TEMP-001 센서 이상치 초과 알림`,
            content: `현재시간 ${new Date().toLocaleString('ko-KR')}<br>${zoneId} 구역 temperature 타입 센서 TEMP-001에서 값 ${value}°C가 정상 범위를 초과했습니다.`,
            zoneId,
            timestamp: new Date().toISOString()
          };
          
          addAlert(alertData);
        },
        
        // 습도 센서 알림
        createHumidityAlert: (zoneId = 'b01', value = 85.2) => {
          const alertData = {
            notiId: Date.now(),
            title: `[${new Date().toLocaleString('ko-KR')}] HUM-001 센서 이상치 초과 알림`,
            content: `현재시간 ${new Date().toLocaleString('ko-KR')}<br>${zoneId} 구역 humidity 타입 센서 HUM-001에서 값 ${value}%가 정상 범위를 초과했습니다.`,
            zoneId,
            timestamp: new Date().toISOString()
          };
          
          addAlert(alertData);
        },
        
        // 압력 센서 알림
        createPressureAlert: (zoneId = 'c01', value = 1015.8) => {
          const alertData = {
            notiId: Date.now(),
            title: `[${new Date().toLocaleString('ko-KR')}] PRESS-001 센서 이상치 초과 알림`,
            content: `현재시간 ${new Date().toLocaleString('ko-KR')}<br>${zoneId} 구역 pressure 타입 센서 PRESS-001에서 값 ${value}hPa가 정상 범위를 초과했습니다.`,
            zoneId,
            timestamp: new Date().toISOString()
          };
          
          addAlert(alertData);
        },
        
        // 다중 알림 생성
        createMultipleAlerts: () => {
          const zones = ['a01', 'b01', 'c01'];
          const sensors = [
            { type: 'TEMP', name: 'TEMP-001', value: '24.5°C', unit: '°C' },
            { type: 'HUM', name: 'HUM-001', value: '78.3%', unit: '%' },
            { type: 'PRESS', name: 'PRESS-001', value: '1012.5hPa', unit: 'hPa' }
          ];
          
          zones.forEach((zoneId, index) => {
            setTimeout(() => {
              const sensor = sensors[index];
              const alertData = {
                notiId: Date.now() + index,
                title: `[${new Date().toLocaleString('ko-KR')}] ${sensor.name} 센서 이상치 초과 알림`,
                content: `현재시간 ${new Date().toLocaleString('ko-KR')}<br>${zoneId} 구역 ${sensor.type.toLowerCase()} 타입 센서 ${sensor.name}에서 값 ${sensor.value}가 정상 범위를 초과했습니다.`,
                zoneId,
                timestamp: new Date().toISOString()
              };
              
              addAlert(alertData);
            }, index * 1000); // 1초 간격으로 생성
          });
        },
        
        // 모든 알림 제거
        clearAll: () => {
          // 모든 타이머 정리
          autoCloseTimers.forEach(timer => clearTimeout(timer));
          setAutoCloseTimers(new Map());
          
          setAlerts([]);
          setIsVisible(false);
        },
        
        // 실제 서버 알림을 팝업으로 표시 (테스트용)
        showRealNotification: async (notiId) => {
          try {
            // 실제 서버에서 알림 데이터 가져오기
            const response = await notificationApi.getNotifications(0, 10);
            const notifications = response.content || [];
            
            // 특정 notiId 찾기
            const notification = notifications.find(n => n.notiId === notiId);
            
            if (notification) {
              addAlert(notification);
            }
          } catch (error) {
            // 알림 가져오기 실패는 조용히 처리
          }
        },
        
        // 최신 안읽음 알림을 팝업으로 표시
        showLatestUnread: async () => {
          try {
            const response = await notificationApi.getNotifications(0, 5, false); // 안읽음만
            const notifications = response.content || [];
            
            if (notifications.length > 0) {
              const latestNotification = notifications[0]; // 가장 최신
              addAlert(latestNotification);
            }
          } catch (error) {
            // 알림 가져오기 실패는 조용히 처리
          }
        },
        
        // 현재 상태 확인
        getStatus: getStatus,
        
        // SSE 연결 상태 확인
        checkSSEConnection: checkSSEConnection,
        
        // 강제로 알림 표시 (디버깅용)
        forceShow: forceShow,
        
        // 모든 타이머 강제 정리
        clearAllTimers: () => {
          autoCloseTimers.forEach((timer, alertId) => {
            clearTimeout(timer);
          });
          setAutoCloseTimers(new Map());
        },
        
        // 도움말 출력
        help: () => {
          console.log('AlertPopup 테스트 도구 사용법: window.testAlert.help()');
        }
      };
      
      // 테스트 도구 준비 완료
    }
  }, []);

  // 자동 닫기 타이머 설정 (현재 비활성화 - 확인 버튼을 누를 때까지 유지)
  const setAutoCloseTimer = useCallback((alertId) => {
    // const timer = setTimeout(() => {
    //   handleCloseAlert(alertId);
    // }, 8000); // 8초 후 자동 닫기
    
    // setAutoCloseTimers(prev => new Map(prev).set(alertId, timer));
  }, []);

  // 알림 추가 함수 (테스트용) - useCallback으로 최적화
  const addAlert = useCallback((alertData) => {
    // 새로운 유틸리티 함수로 데이터 변환
    const transformed = transformNotificationData(alertData);
    
    const newAlert = {
      id: alertData.notiId || Date.now(),
      title: transformed.cleanTitle, // 시간 제거된 제목
      content: transformed.contentAfterBr, // <br> 이후 내용
      zoneId: transformed.zoneName.toLowerCase(), // 추출된 구역명
      timestamp: alertData.timestamp,
      createdAt: new Date(),
      // 새로운 필드들 추가
      notiType: alertData.notiType,
      flagStatus: alertData.flagStatus || false,
      readStatus: alertData.readStatus || false,
      readTime: alertData.readTime,
      // 변환된 데이터 추가
      sensorName: transformed.sensorName,
      koreaTime: transformed.koreaTime,
      relativeTime: transformed.relativeTime
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    setIsVisible(true);
    
    // 자동 닫기 타이머 설정 (확인 버튼을 누를 때까지 유지)
    // setAutoCloseTimer(newAlert.id);
  
    return newAlert;
  }, []);

  // 알림 처리 함수를 useCallback으로 최적화
  const handleSSEMessage = useCallback((data) => {
    // 데이터 유효성 검사
    if (!data || !data.notiType) {
      return;
    }
    
    if (data.notiType === 'ALERT') {
      // 커스텀 알림창에 추가
      const newAlert = addAlert(data);
      
      // 자동 닫기 타이머 설정
      setAutoCloseTimer(newAlert.id);
    }
  }, [addAlert, setAutoCloseTimer]);

  useEffect(() => {
    // 인증되지 않은 경우 SSE 연결하지 않음
    if (!isAuthenticated || isLoading) {
      return;
    }

    // 추가 토큰 검증
    const token = localStorage.getItem('access_token');
    if (!token) {
      return;
    }

    let disconnectSSE = null;
    let isMounted = true;

    const handleSSEError = (error) => {
      if (!isMounted) return;
      // SSE 연결 오류는 조용히 처리
    };

    const handleSSEOpen = () => {
      if (!isMounted) return;
    };

    // SSE 연결 시작
    disconnectSSE = connectNotificationSSE({
      onMessage: handleSSEMessage,
      onError: handleSSEError,
      onOpen: handleSSEOpen
    });

    return () => {
      isMounted = false;
      if (disconnectSSE) {
        disconnectSSE();
      }
    };
  }, [isAuthenticated, isLoading, handleSSEMessage]);

  const handleCloseAlert = (alertId) => {
    // 타이머 정리
    const timer = autoCloseTimers.get(alertId);
    if (timer) {
      clearTimeout(timer);
      setAutoCloseTimers(prev => {
        const newMap = new Map(prev);
        newMap.delete(alertId);
        return newMap;
      });
    }
    
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    if (alerts.length === 1) {
      setIsVisible(false);
    }
  };

  // 알림 확인 (읽음 처리)
  const handleConfirmAlert = async (alertId) => {
    try {
      // API를 통해 알림을 읽음 상태로 변경
      await notificationApi.markNotificationAsRead(alertId);
      
      // 헤더 알림 카운터 업데이트
      const response = await notificationApi.getUnreadNotificationCount();
      if (response && response.data !== undefined) {
        localStorage.setItem('unread_alarm_count', response.data.toString());
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'unread_alarm_count',
          newValue: response.data.toString(),
          oldValue: localStorage.getItem('unread_alarm_count')
        }));
      }
      
      // 팝업에서 제거
      handleCloseAlert(alertId);
      
    } catch (error) {
      // 에러가 발생해도 팝업은 닫기
      handleCloseAlert(alertId);
    }
  };

  // 나중에 처리 (팝업만 닫기, 읽음 상태 변경 없음)
  const handleLaterAlert = (alertId) => {
    handleCloseAlert(alertId);
  };

  const handleCloseAll = () => {
    // 모든 타이머 정리
    autoCloseTimers.forEach(timer => clearTimeout(timer));
    setAutoCloseTimers(new Map());
    
    setAlerts([]);
    setIsVisible(false);
  };

  // 강제로 알림 표시 (디버깅용)
  const forceShow = () => {
    setIsVisible(true);
    
    const testAlert = {
      notiId: Date.now(),
      title: '[디버깅] 강제 표시 테스트 알림',
      content: '이 알림은 디버깅을 위해 강제로 표시된 것입니다.',
      zoneId: 'test',
      timestamp: new Date().toISOString()
    };
    
    setAlerts([testAlert]);
  };

  // 현재 상태 확인
  const getStatus = () => {
    return {
      isVisible,
      alertsCount: alerts.length,
      alerts,
      timersCount: autoCloseTimers.size
    };
  };

  // SSE 연결 상태 확인
  const checkSSEConnection = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return false;
    }
    
    const testEventSource = new EventSource('/api/noti/sse/subscribe', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    
    testEventSource.onopen = () => {
      testEventSource.close();
    };
    
    testEventSource.onerror = (error) => {
      testEventSource.close();
    };
    
    // 5초 후 자동 종료
    setTimeout(() => {
      testEventSource.close();
    }, 5000);
    
    return true;
  };

  // formatContent와 formatTimestamp는 notificationUtils에서 import한 함수 사용

  if (!isVisible || alerts.length === 0) {
    return null;
  }

  // 로그인되지 않은 경우 컴포넌트를 렌더링하지 않음
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div 
      className="fixed top-20 right-4 space-y-2"
      style={{ 
        zIndex: 9999,
        pointerEvents: 'auto'
      }}
    >
      {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className="bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-lg p-4 w-96 animate-slide-in-right"
          style={{ 
            animationDelay: `${index * 0.1}s`,
            transform: `translateY(${index * 8}px)`,
            zIndex: 10000 - index,
            pointerEvents: 'auto',
            position: 'relative'
          }}
        >
          <div className="flex items-start space-x-3">
            {/* 텍스트 내용 */}
            <div className="flex-1 min-w-0">
              {/* 구역 표시와 시간 (상단) */}
              <div className="flex items-center justify-between mb-2">
                <span className="bg-brand-main/20 text-brand-main dark:text-brand-light px-2 py-1 rounded-full text-xs font-medium">
                  {alert.zoneId.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  지금
                </span>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* 제목과 아이콘 */}
                  <div className="flex items-start space-x-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="text-sm font-semibold text-gray-900 dark:text-white"
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '320px'
                        }}
                      >
                        {alert.title}
                      </h4>
                      <p 
                        className="text-xs text-gray-600 dark:text-gray-400 mt-1"
                        style={{
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          maxWidth: '320px'
                        }}
                      >
                        {stripHtmlTags(alert.content)}
                      </p>
                    </div>
                  </div>
                  
                  {/* 버튼 영역 (더 작게) */}
                  <div className="flex items-center justify-end space-x-1 mt-3">
                    <button
                      onClick={() => handleLaterAlert(alert.id)}
                      className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-xs font-medium"
                    >
                      나중에
                    </button>
                    <button
                      onClick={() => handleConfirmAlert(alert.id)}
                      className="px-2 py-1 bg-brand-main text-white text-xs rounded hover:bg-brand-main/80 transition-colors font-medium"
                    >
                      읽음
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertPopup;
