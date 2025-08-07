import axios from 'axios';

const GRAFANA_URL = 'http://192.168.55.180:3000';
const API_KEY = 'glsa_WDC0IP3wP4Q5d6nksu0P3hEf3SpxTYIH_04734bec';

// 직접 연결용 Grafana API 클라이언트
const grafanaAPI = axios.create({
  baseURL: GRAFANA_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃
  withCredentials: false, // CORS 문제 방지
});

// 프록시 연결용 API 클라이언트 (CORS 우회)
const grafanaProxyAPI = axios.create({
  baseURL: '/grafana-api',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 현재 사용할 API 클라이언트 (프록시 우선)
let currentAPI = grafanaProxyAPI;

// 요청 인터셉터 추가 (두 API 클라이언트 모두)
[grafanaAPI, grafanaProxyAPI].forEach(api => {
  api.interceptors.request.use(
    (config) => {
      console.log('Grafana API 요청:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('요청 인터셉터 오류:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('Grafana API 응답 성공:', response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error('Grafana API 응답 오류:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        url: error.config?.url,
      });
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('요청 시간 초과: Grafana 서버가 응답하지 않습니다.');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('네트워크 연결 오류: Grafana 서버에 연결할 수 없습니다. CORS 설정을 확인하세요.');
      } else if (error.response?.status === 401) {
        throw new Error('인증 오류: API 키가 유효하지 않습니다.');
      } else if (error.response?.status === 403) {
        throw new Error('권한 오류: API 키에 필요한 권한이 없습니다.');
      } else if (error.response?.status === 404) {
        throw new Error('리소스를 찾을 수 없습니다.');
      }
      
      return Promise.reject(error);
    }
  );
});

// 연결 테스트 함수 (프록시와 직접 연결 모두 시도)
export async function testConnection() {
  console.log('Grafana 연결 테스트 시작...');
  
  // 1. 프록시를 통한 연결 시도
  try {
    console.log('프록시를 통한 연결 시도...');
    const response = await grafanaProxyAPI.get('/api/health');
    console.log('프록시 연결 테스트 성공:', response.data);
    currentAPI = grafanaProxyAPI;
    return { success: true, method: 'proxy', data: response.data };
  } catch (proxyError) {
    console.warn('프록시 연결 실패:', proxyError.message);
    
    // 2. 직접 연결 시도
    try {
      console.log('직접 연결 시도...');
      const response = await grafanaAPI.get('/api/health');
      console.log('직접 연결 테스트 성공:', response.data);
      currentAPI = grafanaAPI;
      return { success: true, method: 'direct', data: response.data };
    } catch (directError) {
      console.error('직접 연결도 실패:', directError.message);
      return { 
        success: false, 
        proxyError: proxyError.message,
        directError: directError.message 
      };
    }
  }
}

// 데이터소스 목록 가져오기
export async function fetchDataSources() {
  try {
    const response = await currentAPI.get('/api/datasources');
    return response.data;
  } catch (error) {
    console.error('데이터소스 목록 가져오기 오류:', error);
    throw error;
  }
}

// 특정 데이터소스 정보 가져오기
export async function fetchDataSource(id) {
  try {
    const response = await currentAPI.get(`/api/datasources/${id}`);
    return response.data;
  } catch (error) {
    console.error('데이터소스 정보 가져오기 오류:', error);
    throw error;
  }
}

// 대시보드 목록 가져오기
export async function fetchDashboards() {
  try {
    const response = await currentAPI.get('/api/search?type=dash-db');
    return response.data;
  } catch (error) {
    console.error('대시보드 가져오기 오류:', error);
    throw error;
  }
}

// 특정 대시보드 데이터 가져오기
export async function fetchDashboard(uid) {
  try {
    const response = await currentAPI.get(`/api/dashboards/uid/${uid}`);
    return response.data;
  } catch (error) {
    console.error('대시보드 데이터 가져오기 오류:', error);
    throw error;
  }
}

// 패널 데이터 쿼리하기 (시계열 데이터) - 개선된 버전
export async function queryPanelData(query, timeRange, datasourceId = 1) {
  try {
    // 먼저 데이터소스가 존재하는지 확인
    await fetchDataSource(datasourceId);
    
    const params = {
      query: query,
      start: Math.floor(timeRange.from / 1000), // 초 단위로 변환
      end: Math.floor(timeRange.to / 1000),     // 초 단위로 변환
      step: '1m', // 1분 간격
    };
    
    const response = await currentAPI.get(`/api/datasources/proxy/${datasourceId}/api/v1/query_range`, { params });
    return response.data;
  } catch (error) {
    console.error('패널 데이터 쿼리 오류:', error);
    
    // 502 에러인 경우 더 구체적인 메시지
    if (error.response?.status === 502) {
      throw new Error(`데이터소스 ${datasourceId}에 연결할 수 없습니다. Prometheus 서버가 실행 중인지 확인하세요.`);
    }
    
    throw error;
  }
}

// 실시간 메트릭 가져오기
export async function fetchRealTimeMetrics(queries) {
  try {
    const response = await currentAPI.post('/api/ds/query', {
      queries: queries.map((query, index) => ({
        refId: `query${index}`,
        expr: query,
        instant: true,
      })),
    });
    return response.data;
  } catch (error) {
    console.error('실시간 메트릭 가져오기 오류:', error);
    throw error;
  }
}