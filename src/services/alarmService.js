import { notificationApi } from './api/notification_api';


class AlarmService {
  constructor() {
    this.eventListeners = new Map();
  }

  // 이벤트 리스너 추가
  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  // 이벤트 리스너 제거
  removeEventListener(event, callback) {
    if (this.eventListeners.has(event)) {
      const callbacks = this.eventListeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // 이벤트 발생
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        callback(data);
      });
    }
  }

  // 알림 리스트 조회 (페이지네이션 및 필터링 지원)
  async getNotifications(page = 0, size = 10, isRead = null, isFlagged = null) {
    try {
      const response = await notificationApi.getNotifications(page, size, isRead, isFlagged);
      return response?.data || [];
    } catch (error) {
      console.error('알림 리스트 조회 실패:', error);
      throw new Error('알림 리스트 조회에 실패했습니다.');
    }
  }

  // 알림 안읽은 개수 조회
  async getUnreadCount() {
    try {
      const response = await notificationApi.getUnreadNotificationCount();
      return response?.data?.count || 0;
    } catch (error) {
      console.error('안읽은 알림 개수 조회 실패:', error);
      throw new Error('안읽은 알림 개수 조회에 실패했습니다.');
    }
  }

  // 알림 읽음 처리
  async markAsRead(notificationId) {
    try {
      const response = await notificationApi.markNotificationAsRead(notificationId);
      // 읽음 처리 후 안읽은 개수 업데이트 이벤트 발생
      this.emit('unreadCountChanged');
      return response?.data || { success: true };
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      throw new Error('알림 읽음 처리에 실패했습니다.');
    }
  }

  // 알림 일괄 읽음 처리
  async markAllAsRead() {
    try {
      const response = await notificationApi.markAllNotificationsAsRead();
      // 일괄 읽음 처리 후 안읽은 개수 업데이트 이벤트 발생
      this.emit('unreadCountChanged');
      return response?.data || { success: true };
    } catch (error) {
      console.error('알림 일괄 읽음 처리 실패:', error);
      throw new Error('알림 일괄 읽음 처리에 실패했습니다.');
    }
  }

  // 알림 즐겨찾기 설정/해제
  async toggleFavorite(notificationId) {
    try {
      const response = await notificationApi.toggleNotificationFavorite(notificationId);
      return response?.data || { success: true };
    } catch (error) {
      console.error('알림 즐겨찾기 처리 실패:', error);
      throw new Error('알림 즐겨찾기 처리에 실패했습니다.');
    }
  }

  // 알림 삭제 기능은 실제 엔드포인트가 없으므로 제거
  // async deleteNotification(notificationId) {
  //   try {
  //     const response = await notificationApi.deleteNotification(notificationId);
  //     // 삭제 후 안읽은 개수 업데이트 이벤트 발생
  //     this.emit('unreadCountChanged');
  //     return response?.data || { success: true };
  //   } catch (error) {
  //     console.error('알림 삭제 실패:', error);
  //     // API 실패 시에도 성공으로 처리
  //     this.emit('unreadCountChanged');
  //     return { success: true };
  //   }
  // }
}

export const alarmService = new AlarmService();
