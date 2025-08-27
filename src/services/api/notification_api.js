// 알림 관련 API 전용 파일
import { authApiClient } from '../index';

// 개발 환경 체크
const isDev = import.meta.env.DEV;

// 알림 관련 API 함수들
export const notificationApi = {
  // 알림 목록 조회 (페이지네이션 및 필터링 지원)
  getNotifications: async (page = 0, size = 10, isRead = null, isFlagged = null) => {
    try {
      console.log('=== 알림 목록 조회 시작 ===');
      console.log('요청 파라미터:', { page, size, isRead, isFlagged });
      console.log('API 클라이언트 설정:', {
        baseURL: authApiClient.defaults.baseURL,
        timeout: authApiClient.defaults.timeout,
        headers: authApiClient.defaults.headers
      });

      const params = new URLSearchParams();
      if (page !== null) params.append('page', page);
      if (size !== null) params.append('size', size);
      if (isRead !== null) params.append('isRead', isRead);
      if (isFlagged !== null) params.append('isFlagged', isFlagged);
      
      const requestUrl = `/noti/list?${params.toString()}`;
      console.log('요청 URL:', requestUrl);
      
      const response = await authApiClient.get(requestUrl);
      
      console.log('=== 알림 목록 조회 성공 ===');
      console.log('응답 데이터:', response.data);
      
      // 전체 응답 구조를 반환하여 페이지네이션 정보도 함께 사용할 수 있도록 함
      return response.data.data || { content: [], totalPages: 0, totalElements: 0 };
    } catch (error) {
      console.error('=== 알림 목록 조회 에러 상세 정보 ===');
      console.error('Get notifications error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
      
      // 서버 연결 실패 시 더 자세한 정보 제공
      if (error.code === 'ERR_NETWORK') {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
      throw new Error(error.response?.data?.message || '알림 목록 조회에 실패했습니다.');
    }
  },

  // 안읽은 알림 개수 조회
  getUnreadNotificationCount: async () => {
    try {


            const response = await authApiClient.get('/noti/count');
      
      // 최소한의 콘솔 로그
      if (isDev) {
        console.log(`안읽은 알림: ${response.data.data}개`);
      }
      
      return response.data;
    } catch (error) {
      console.error('=== 안읽은 알림 개수 조회 에러 상세 정보 ===');
      console.error('Get unread count error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
      
      // 서버 연결 실패 시 더 자세한 정보 제공
      if (error.code === 'ERR_NETWORK') {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
      throw new Error(error.response?.data?.message || '안읽은 알림 개수 조회에 실패했습니다.');
    }
  },

  // 알림 읽음 처리
  markNotificationAsRead: async (notificationId) => {
    try {
      console.log('=== 알림 읽음 처리 시작 ===');
      console.log('알림 ID:', notificationId);
      
      const response = await authApiClient.post(`/noti/read/${notificationId}`);
      
      console.log('=== 알림 읽음 처리 성공 ===');
      console.log('응답 데이터:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('=== 알림 읽음 처리 에러 상세 정보 ===');
      console.error('Mark as read error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
      
      // 서버 연결 실패 시 더 자세한 정보 제공
      if (error.code === 'ERR_NETWORK') {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
      throw new Error(error.response?.data?.message || '알림 읽음 처리에 실패했습니다.');
    }
  },

  // 알림 일괄 읽음 처리
  markAllNotificationsAsRead: async () => {
    try {


      const response = await authApiClient.post('/noti/read/all');
      

      
      return response.data;
    } catch (error) {
      console.error('=== 알림 일괄 읽음 처리 에러 상세 정보 ===');
      console.error('Mark all as read error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
      
      // 서버 연결 실패 시 더 자세한 정보 제공
      if (error.code === 'ERR_NETWORK') {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
      throw new Error(error.response?.data?.message || '알림 일괄 읽음 처리에 실패했습니다.');
    }
  },

  // 알림 즐겨찾기 설정/해제
  toggleNotificationFavorite: async (notificationId) => {
    try {


      const response = await authApiClient.post(`/noti/favorite/${notificationId}`);
      

      
      return response.data;
    } catch (error) {
      console.error('=== 알림 즐겨찾기 토글 에러 상세 정보 ===');
      console.error('Toggle favorite error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
      
      // 서버 연결 실패 시 더 자세한 정보 제공
      if (error.code === 'ERR_NETWORK') {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
      throw new Error(error.response?.data?.message || '알림 즐겨찾기 토글에 실패했습니다.');
    }
  }
};

// 알림 관련 유틸리티 함수들
export const notificationUtils = {
  // 알림 상태 확인
  isNotificationRead: (notification) => {
    return notification?.isRead === true;
  },

  // 즐겨찾기 상태 확인
  isNotificationFlagged: (notification) => {
    return notification?.isFlagged === true;
  },

  // 알림 타입별 색상 반환
  getNotificationTypeColor: (type) => {
    const colorMap = {
      'ALERT': 'bg-red-100 text-red-600',
      'REPORT': 'bg-green-100 text-green-600',
      'INFO': 'bg-blue-100 text-blue-600',
      'MAINTENANCE': 'bg-yellow-100 text-yellow-600',
      'SYSTEM': 'bg-purple-100 text-purple-600',
      'SCHEDULE': 'bg-indigo-100 text-indigo-600'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-600';
  },

  // 알림 시간 포맷팅
  formatNotificationTime: (createdAt) => {
    if (!createdAt) return '';
    
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return notificationTime.toLocaleDateString('ko-KR');
  },

  // 알림 필터링
  filterNotifications: (notifications, filters = {}) => {
    let filtered = [...notifications];
    
    // 읽음 상태 필터
    if (filters.isRead !== null && filters.isRead !== undefined) {
      filtered = filtered.filter(notification => notification.isRead === filters.isRead);
    }
    
    // 즐겨찾기 상태 필터
    if (filters.isFlagged !== null && filters.isFlagged !== undefined) {
      filtered = filtered.filter(notification => notification.isFlagged === filters.isFlagged);
    }
    
    // 타입 필터
    if (filters.type && filters.type !== '전체') {
      filtered = filtered.filter(notification => notification.type === filters.type);
    }
    
    // 검색어 필터
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(notification => 
        notification.title?.toLowerCase().includes(searchTerm) ||
        notification.content?.toLowerCase().includes(searchTerm)
      );
    }
    
    return filtered;
  }
};
