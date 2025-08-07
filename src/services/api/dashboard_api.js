// 대시보드는 SSE 통신으로 한번 통신을 연결하면 연결 상태를 계속 유지하고 Back에서 데이터를 전송하는 방식으로 동작합니다.
// 따라서 기존의 axios 방식으로 통신할 수 없어 우선 만들어둔 dashboard_api 파일에 SSE 연결 방법을 작성합니다.

// 연결할 url
// 사용시 url = SSE_URLS.zone('zone_A01') 이런 식으로 사용
// url 변수가 동일하므로 둘 중 하나는 주석처리하여 사용
// 사용시 url = SSE_URLS.zone('zone_A01') 이런 식으로 사용

// (개발용) 프록시를 통한 연결 url - Dashboard 백엔드 (포트 8083)
export const SSE_URLS = {
  main: "/dashboard-api/home/status",
  zone: (zoneId) => `/dashboard-api/home/zone?zoneId=${zoneId}`,
  // main: "http://localhost:8083/home/status",
  // zone: (zoneId) => `http://localhost:8083/home/zone?zoneId=${zoneId}`,
};

// (운영용) gateway 사용시 연결 url
// export const SSE_URLS = {
//   main: "http://localhost:8080/home/status",
//   zone: (zoneId) => `http://localhost:8080/home/zone?zoneId=${zoneId}`,
// };

// Dashboard 백엔드 API 클라이언트 import
import { dashboardApiClient } from '../index';

// 일반 HTTP API 함수들
export const dashboardApi = {
  // 대시보드 초기 데이터 조회
  getDashboardData: async () => {
    console.log(' 대시보드 데이터 조회 시작');
    try {
      const response = await dashboardApiClient.get('/home/dashboard');
      console.log('대시보드 데이터 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error(' 대시보드 데이터 조회 실패:', error);
      throw error;
    }
  },

  // 특정 존 데이터 조회
  getZoneData: async (zoneId) => {
    console.log(` 존 데이터 조회 시작: ${zoneId}`);
    try {
      const response = await dashboardApiClient.get(`/home/zone/${zoneId}`);
      console.log(` 존 데이터 조회 성공 (${zoneId}):`, response.data);
      return response.data;
    } catch (error) {
      console.error(` 존 데이터 조회 실패 (${zoneId}):`, error);
      throw error;
    }
  },

  // 대시보드 설정 업데이트
  updateDashboardSettings: async (settings) => {
    console.log('⚙️ 대시보드 설정 업데이트 시작:', settings);
    try {
      const response = await dashboardApiClient.put('/home/settings', settings);
      console.log(' 대시보드 설정 업데이트 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error(' 대시보드 설정 업데이트 실패:', error);
      throw error;
    }
  },

  // 알림 조회
  getNotifications: async () => {
    console.log(' 알림 조회 시작');
    try {
      const response = await dashboardApiClient.get('/home/notifications');
      console.log(' 알림 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error(' 알림 조회 실패:', error);
      throw error;
    }
  }
};

// SSE 연결 방식을 main, zone 두 곳에서 사용하여 함수화
export const connectSSE = (url, { onMessage, onError }) => {
  console.log(' SSE 연결 시작:', url);
  
  // 인증 토큰 가져오기
  const token = localStorage.getItem('access_token');
  console.log(' 인증 토큰 상태:', token ? '토큰 있음' : '토큰 없음');
  
  // fetch API를 사용해서 SSE 스트림 시뮬레이션
  const controller = new AbortController();
  let isDisconnected = false;
  let retryCount = 0;
  const maxRetries = 3;
  const retryDelay = 2000; // 2초
  
  const fetchWithRetry = () => {
    if (isDisconnected) {
      console.log(' SSE 연결이 이미 해제됨');
      return;
    }
    
    console.log(` SSE 연결 시도 ${retryCount + 1}/${maxRetries + 1}:`, url);
    
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      signal: controller.signal
    })
    .then(response => {
      console.log(' SSE 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // 연결 성공 시 재시도 카운트 리셋
      retryCount = 0;
      console.log(' SSE 연결 성공!');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      const readStream = () => {
        if (isDisconnected) {
          console.log('🔌 SSE 스트림 읽기 중단됨');
          reader.cancel();
          return;
        }
        
        reader.read().then(({ done, value }) => {
          if (done || isDisconnected) {
            console.log(' SSE 스트림 종료');
            return;
          }
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          console.log(' SSE 데이터 청크 수신:', lines.length, '줄');
          
          lines.forEach((line, index) => {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                console.log(`SSE 데이터 파싱 성공 (${index + 1}번째):`, data);
                onMessage(data);
              } catch (error) {
                console.error(' SSE 데이터 파싱 오류:', error, '원본 라인:', line);
              }
            }
          });
          
          readStream();
        }).catch(error => {
          if (error.name === 'AbortError') {
            console.log(' SSE 연결이 정상적으로 중단되었습니다.');
            return;
          }
          console.error(' SSE 스트림 읽기 오류:', error);
          onError(error);
        });
      };
      
      readStream();
    })
    .catch(error => {
      if (error.name === 'AbortError') {
        console.log('SSE 연결이 정상적으로 중단되었습니다.');
        return;
      }
      
      console.error(' SSE 연결 오류:', error);
      
      // 재시도 로직
      if (retryCount < maxRetries && !isDisconnected) {
        retryCount++;
        console.log(`SSE 연결 재시도 ${retryCount}/${maxRetries}... (${retryDelay}ms 후)`);
        setTimeout(() => {
          if (!isDisconnected) {
            fetchWithRetry();
          }
        }, retryDelay);
      } else {
        console.error('SSE 연결 최대 재시도 횟수 초과');
        onError(error);
      }
    });
  };
  
  // 초기 연결 시도
  fetchWithRetry();
  
  // 연결 해제 함수 반환
  return () => {
    console.log('🔌 SSE 연결 해제 요청');
    isDisconnected = true;
    try {
      controller.abort();
      console.log('SSE 연결 해제 완료');
    } catch (error) {
      console.log('SSE 연결 해제 중 오류:', error);
    }
  };
};

// 메인 대시보드용 SSE 연결
export const connectMainSSE = ({ onMessage, onError }) => {
  return connectSSE(SSE_URLS.main, { onMessage, onError });
};

// 특정 존용 SSE 연결
export const connectZoneSSE = (zoneId, { onMessage, onError }) => {
  return connectSSE(SSE_URLS.zone(zoneId), { onMessage, onError });
};
