// 알림 관련 API 전용 파일
import { authApiClient } from '../index';
import { handleApiError } from '../../utils/unifiedErrorHandler';

// 개발 환경 체크
const isDev = import.meta.env.DEV;

// 알림 관련 API 함수들
export const notificationApi = {
  // 알림 목록 조회 (페이지네이션 및 필터링 지원)
  getNotifications: async (page = 0, size = 10, isRead = null, isFlagged = null) => {
    try {
      const params = new URLSearchParams();
      if (page !== null) params.append('page', page);
      if (size !== null) params.append('size', size);
      if (isRead !== null) params.append('isRead', isRead);
      if (isFlagged !== null) params.append('isFlagged', isFlagged);
      
      const requestUrl = `/noti/list?${params.toString()}`;
      const response = await authApiClient.get(requestUrl);
      
      return response.data.data || { content: [], totalPages: 0, totalElements: 0 };
    } catch (error) {
      const errorInfo = handleApiError(error, '알림 목록 조회');
      throw new Error(errorInfo.userMessage);
    }
  },

  // 안읽은 알림 개수 조회
  getUnreadNotificationCount: async () => {
    try {
      const response = await authApiClient.get('/noti/count');
      return response.data;
    } catch (error) {
      const errorInfo = handleApiError(error, '안읽은 알림 개수 조회');
      throw new Error(errorInfo.userMessage);
    }
  },

  // 알림 읽음 처리
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await authApiClient.post(`/noti/read/${notificationId}`);
      return response.data;
    } catch (error) {
      const errorInfo = handleApiError(error, '알림 읽음 처리');
      throw new Error(errorInfo.userMessage);
    }
  },

  // 알림 일괄 읽음 처리
  markAllNotificationsAsRead: async () => {
    try {
      const response = await authApiClient.post('/noti/read/all');
      return response.data;
    } catch (error) {
      const errorInfo = handleApiError(error, '알림 일괄 읽음 처리');
      throw new Error(errorInfo.userMessage);
    }
  },

  // 알림 즐겨찾기 설정/해제
  toggleNotificationFavorite: async (notificationId) => {
    try {
      const response = await authApiClient.post(`/noti/favorite/${notificationId}`);
      return response.data;
    } catch (error) {
      const errorInfo = handleApiError(error, '알림 즐겨찾기 토글');
      throw new Error(errorInfo.userMessage);
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
