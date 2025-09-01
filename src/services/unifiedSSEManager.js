import { EventSourcePolyfill } from 'event-source-polyfill';

/**
 * 통합 SSE 관리자
 * 모든 존의 SSE 연결을 중앙에서 관리하여 중복 연결 방지 및 효율적인 데이터 처리
 */
class UnifiedSSEManager {
  constructor() {
    this.mainConnection = null;
    this.zoneConnections = new Map();
    this.subscribers = new Map();
    this.connectionStates = new Map();
    this.lastMessageTimes = new Map();
    this.heartbeatTimers = new Map();
    this.reconnectTimers = new Map();
    
    // 설정
    this.config = {
      maxRetries: 3,
      retryDelay: 2000,
      heartbeatInterval: 30000,
      connectionTimeout: 60000,
      reconnectDelay: 5000
    };
  }

  /**
   * 메인 SSE 연결 (모든 존 데이터 수신)
   */
  connectMainSSE({ onMessage, onError, onOpen }) {
    console.log('🔄 통합 SSE 관리자 - 메인 SSE 연결 시작');
    
    if (this.mainConnection) {
      console.log('⚠️ 기존 메인 SSE 연결이 존재합니다. 재사용합니다.');
      return this.mainConnection.disconnect;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      const error = new Error('인증 토큰이 없습니다.');
      console.error('❌ 메인 SSE 연결 실패:', error.message);
      onError?.(error);
      return () => {};
    }

    const url = "/dashboard-api/home/status";
    let retryCount = 0;
    let isConnected = false;

    const createConnection = () => {
      try {
        console.log(`🔄 메인 SSE 연결 시도 ${retryCount + 1}/${this.config.maxRetries + 1}:`, {
          url,
          retryCount,
          timestamp: new Date().toLocaleTimeString()
        });

        this.mainConnection = new EventSourcePolyfill(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        this.mainConnection.onopen = (event) => {
          console.log('✅ 메인 SSE 연결 성공:', {
            url,
            readyState: this.mainConnection.readyState,
            timestamp: new Date().toLocaleTimeString()
          });
          
          isConnected = true;
          this.connectionStates.set('main', 'connected');
          this.lastMessageTimes.set('main', Date.now());
          
          // 하트비트 타이머 시작
          this.startHeartbeat('main');
          
          onOpen?.(event);
        };

        this.mainConnection.onmessage = (event) => {
          this.lastMessageTimes.set('main', Date.now());
          
          console.log('📨 메인 SSE 데이터 수신:', {
            url,
            dataLength: event.data?.length || 0,
            eventType: event.type,
            timestamp: new Date().toLocaleTimeString()
          });

          try {
            const parsedData = JSON.parse(event.data);
            console.log('✅ 메인 SSE 데이터 파싱 성공:', {
              url,
              parsedData,
              hasCode: 'code' in parsedData,
              hasData: 'data' in parsedData,
              dataLength: Array.isArray(parsedData.data) ? parsedData.data.length : 'N/A',
              timestamp: new Date().toLocaleTimeString()
            });

            // 모든 구독자에게 데이터 전달
            this.notifySubscribers(parsedData);
            onMessage?.(parsedData);
          } catch (parseError) {
            console.error('❌ 메인 SSE 데이터 파싱 실패:', {
              url,
              originalData: event.data,
              error: parseError.message,
              timestamp: new Date().toLocaleTimeString()
            });
            onError?.(parseError);
          }
        };

        this.mainConnection.onerror = (error) => {
          console.error('❌ 메인 SSE 연결 오류:', {
            url,
            error: error.message,
            errorType: error.type,
            readyState: this.mainConnection?.readyState,
            timestamp: new Date().toLocaleTimeString()
          });

          isConnected = false;
          this.connectionStates.set('main', 'error');
          this.stopHeartbeat('main');
          
          onError?.(error);

          // 자동 재연결 시도
          if (retryCount < this.config.maxRetries) {
            retryCount++;
            console.log(`🔄 메인 SSE 재연결 시도 ${retryCount}/${this.config.maxRetries}... (${this.config.retryDelay}ms 후)`);
            
            this.reconnectTimers.set('main', setTimeout(() => {
              this.reconnectMain();
            }, this.config.retryDelay));
          } else {
            console.error('❌ 메인 SSE 최대 재연결 시도 횟수 초과');
          }
        };

      } catch (error) {
        console.error('❌ 메인 SSE EventSource 생성 오류:', {
          url,
          error: error.message,
          errorType: error.name,
          timestamp: new Date().toLocaleTimeString()
        });
        onError?.(error);
      }
    };

    const disconnect = () => {
      console.log('🔌 메인 SSE 연결 해제:', {
        url,
        timestamp: new Date().toLocaleTimeString()
      });
      
      this.cleanupConnection('main');
      
      if (this.mainConnection) {
        this.mainConnection.close();
        this.mainConnection = null;
      }
      
      this.connectionStates.set('main', 'disconnected');
    };

    // 초기 연결 시작
    createConnection();

    return disconnect;
  }

  /**
   * 존별 SSE 연결 (필요시 개별 연결)
   */
  connectZoneSSE(zoneId, { onMessage, onError, onOpen }) {
    const upperZoneId = zoneId.toUpperCase();
    console.log(`🔄 ${upperZoneId} 존 SSE 연결 시작 (통합 관리자)`);

    if (this.zoneConnections.has(upperZoneId)) {
      console.log(`⚠️ ${upperZoneId} 존 SSE 연결이 이미 존재합니다. 재사용합니다.`);
      return this.zoneConnections.get(upperZoneId).disconnect;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      const error = new Error('인증 토큰이 없습니다.');
      console.error(`❌ ${upperZoneId} 존 SSE 연결 실패:`, error.message);
      onError?.(error);
      return () => {};
    }

    const url = `/dashboard-api/home/zone?zoneId=${upperZoneId}`;
    let retryCount = 0;
    let isConnected = false;

    const createConnection = () => {
      try {
        console.log(`🔄 ${upperZoneId} 존 SSE 연결 시도 ${retryCount + 1}/${this.config.maxRetries + 1}:`, {
          url,
          zoneId: upperZoneId,
          retryCount,
          timestamp: new Date().toLocaleTimeString()
        });

        const eventSource = new EventSourcePolyfill(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        eventSource.onopen = (event) => {
          console.log(`✅ ${upperZoneId} 존 SSE 연결 성공:`, {
            url,
            zoneId: upperZoneId,
            readyState: eventSource.readyState,
            timestamp: new Date().toLocaleTimeString()
          });
          
          isConnected = true;
          this.connectionStates.set(upperZoneId, 'connected');
          this.lastMessageTimes.set(upperZoneId, Date.now());
          
          // 하트비트 타이머 시작
          this.startHeartbeat(upperZoneId);
          
          onOpen?.(event);
        };

        eventSource.onmessage = (event) => {
          this.lastMessageTimes.set(upperZoneId, Date.now());
          
          console.log(`📨 ${upperZoneId} 존 SSE 데이터 수신:`, {
            url,
            zoneId: upperZoneId,
            dataLength: event.data?.length || 0,
            eventType: event.type,
            timestamp: new Date().toLocaleTimeString()
          });

          try {
            const parsedData = JSON.parse(event.data);
            console.log(`✅ ${upperZoneId} 존 SSE 데이터 파싱 성공:`, {
              url,
              zoneId: upperZoneId,
              parsedData,
              hasCode: 'code' in parsedData,
              hasData: 'data' in parsedData,
              dataLength: Array.isArray(parsedData.data) ? parsedData.data.length : 'N/A',
              timestamp: new Date().toLocaleTimeString()
            });

            onMessage?.(parsedData);
          } catch (parseError) {
            console.error(`❌ ${upperZoneId} 존 SSE 데이터 파싱 실패:`, {
              url,
              zoneId: upperZoneId,
              originalData: event.data,
              error: parseError.message,
              timestamp: new Date().toLocaleTimeString()
            });
            onError?.(parseError);
          }
        };

        eventSource.onerror = (error) => {
          console.error(`❌ ${upperZoneId} 존 SSE 연결 오류:`, {
            url,
            zoneId: upperZoneId,
            error: error.message,
            errorType: error.type,
            readyState: eventSource?.readyState,
            timestamp: new Date().toLocaleTimeString()
          });

          isConnected = false;
          this.connectionStates.set(upperZoneId, 'error');
          this.stopHeartbeat(upperZoneId);
          
          onError?.(error);

          // 자동 재연결 시도
          if (retryCount < this.config.maxRetries) {
            retryCount++;
            console.log(`🔄 ${upperZoneId} 존 SSE 재연결 시도 ${retryCount}/${this.config.maxRetries}... (${this.config.retryDelay}ms 후)`);
            
            this.reconnectTimers.set(upperZoneId, setTimeout(() => {
              this.reconnectZone(upperZoneId);
            }, this.config.retryDelay));
          } else {
            console.error(`❌ ${upperZoneId} 존 SSE 최대 재연결 시도 횟수 초과`);
          }
        };

        const disconnect = () => {
          console.log(`🔌 ${upperZoneId} 존 SSE 연결 해제:`, {
            url,
            zoneId: upperZoneId,
            timestamp: new Date().toLocaleTimeString()
          });
          
          this.cleanupConnection(upperZoneId);
          eventSource.close();
          this.zoneConnections.delete(upperZoneId);
          this.connectionStates.set(upperZoneId, 'disconnected');
        };

        // 연결 정보 저장
        this.zoneConnections.set(upperZoneId, {
          eventSource,
          disconnect,
          onMessage,
          onError,
          onOpen
        });

        return disconnect;

      } catch (error) {
        console.error(`❌ ${upperZoneId} 존 SSE EventSource 생성 오류:`, {
          url,
          zoneId: upperZoneId,
          error: error.message,
          errorType: error.name,
          timestamp: new Date().toLocaleTimeString()
        });
        onError?.(error);
        return () => {};
      }
    };

    return createConnection();
  }

  /**
   * 구독자 등록 (존별 데이터 수신)
   */
  subscribeToZone(zoneId, callback) {
    const upperZoneId = zoneId.toUpperCase();
    console.log(`📝 ${upperZoneId} 존 구독자 등록:`, {
      zoneId: upperZoneId,
      callback: typeof callback,
      timestamp: new Date().toLocaleTimeString()
    });

    if (!this.subscribers.has(upperZoneId)) {
      this.subscribers.set(upperZoneId, new Set());
    }
    
    this.subscribers.get(upperZoneId).add(callback);
    
    // 구독 해제 함수 반환
    return () => {
      console.log(`📝 ${upperZoneId} 존 구독자 해제:`, {
        zoneId: upperZoneId,
        timestamp: new Date().toLocaleTimeString()
      });
      
      const zoneSubscribers = this.subscribers.get(upperZoneId);
      if (zoneSubscribers) {
        zoneSubscribers.delete(callback);
        if (zoneSubscribers.size === 0) {
          this.subscribers.delete(upperZoneId);
        }
      }
    };
  }

  /**
   * 구독자들에게 데이터 전달
   */
  notifySubscribers(data) {
    console.log('📢 구독자들에게 데이터 전달 시작:', {
      데이터개수: data.data?.length || 0,
      구독자수: Array.from(this.subscribers.values()).reduce((total, set) => total + set.size, 0),
      전체구독자목록: Array.from(this.subscribers.keys()),
      timestamp: new Date().toLocaleTimeString()
    });

    if (!data?.data || !Array.isArray(data.data)) {
      console.log('❌ 전달할 데이터가 없거나 잘못된 형식:', data);
      return;
    }

    data.data.forEach(zone => {
      if (zone.zoneName) {
        const upperZoneId = zone.zoneName.toUpperCase();
        const zoneSubscribers = this.subscribers.get(upperZoneId);
        
        console.log(`🔍 ${upperZoneId} 존 구독자 확인:`, {
          zoneId: upperZoneId,
          구독자수: zoneSubscribers?.size || 0,
          존데이터: zone,
          존데이터키: Object.keys(zone),
          timestamp: new Date().toLocaleTimeString()
        });
        
        if (zoneSubscribers) {
          console.log(`📢 ${upperZoneId} 존 구독자들에게 데이터 전달:`, {
            zoneId: upperZoneId,
            구독자수: zoneSubscribers.size,
            데이터: zone,
            timestamp: new Date().toLocaleTimeString()
          });
          
          zoneSubscribers.forEach(callback => {
            try {
              callback(zone);
            } catch (error) {
              console.error(`❌ ${upperZoneId} 존 구독자 콜백 실행 오류:`, {
                error: error.message,
                timestamp: new Date().toLocaleTimeString()
              });
            }
          });
        } else {
          console.log(`📝 ${upperZoneId} 존 구독자가 없음`);
        }
      }
    });
  }

  /**
   * 하트비트 시작
   */
  startHeartbeat(connectionId) {
    if (this.heartbeatTimers.has(connectionId)) {
      clearInterval(this.heartbeatTimers.get(connectionId));
    }

    const timer = setInterval(() => {
      const lastMessageTime = this.lastMessageTimes.get(connectionId);
      if (lastMessageTime) {
        const now = Date.now();
        const timeSinceLastMessage = now - lastMessageTime;
        
        console.log(`💓 ${connectionId} SSE 하트비트 체크:`, {
          마지막메시지로부터: `${timeSinceLastMessage}ms`,
          timestamp: new Date().toLocaleTimeString()
        });
        
        if (timeSinceLastMessage > this.config.connectionTimeout) {
          console.warn(`⚠️ ${connectionId} SSE 연결이 응답하지 않습니다. 재연결을 시도합니다.`);
          this.reconnectConnection(connectionId);
        }
      }
    }, this.config.heartbeatInterval);

    this.heartbeatTimers.set(connectionId, timer);
  }

  /**
   * 하트비트 정지
   */
  stopHeartbeat(connectionId) {
    const timer = this.heartbeatTimers.get(connectionId);
    if (timer) {
      clearInterval(timer);
      this.heartbeatTimers.delete(connectionId);
    }
  }

  /**
   * 연결 정리
   */
  cleanupConnection(connectionId) {
    this.stopHeartbeat(connectionId);
    
    const reconnectTimer = this.reconnectTimers.get(connectionId);
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      this.reconnectTimers.delete(connectionId);
    }
  }

  /**
   * 메인 연결 재연결
   */
  reconnectMain() {
    console.log('🔄 메인 SSE 재연결 시도');
    if (this.mainConnection) {
      this.mainConnection.close();
      this.mainConnection = null;
    }
    this.connectionStates.set('main', 'connecting');
    // 재연결 로직은 외부에서 처리
  }

  /**
   * 존 연결 재연결
   */
  reconnectZone(zoneId) {
    console.log(`🔄 ${zoneId} 존 SSE 재연결 시도`);
    const connection = this.zoneConnections.get(zoneId);
    if (connection) {
      connection.eventSource.close();
      this.zoneConnections.delete(zoneId);
    }
    this.connectionStates.set(zoneId, 'connecting');
    // 재연결 로직은 외부에서 처리
  }

  /**
   * 연결 상태 조회
   */
  getConnectionState(connectionId) {
    return this.connectionStates.get(connectionId) || 'disconnected';
  }

  /**
   * 모든 연결 상태 조회
   */
  getAllConnectionStates() {
    const states = {};
    this.connectionStates.forEach((state, id) => {
      states[id] = state;
    });
    return states;
  }

  /**
   * 모든 연결 해제
   */
  disconnectAll() {
    console.log('🔌 모든 SSE 연결 해제 시작');
    
    // 메인 연결 해제
    if (this.mainConnection) {
      this.mainConnection.close();
      this.mainConnection = null;
    }
    
    // 존별 연결 해제
    this.zoneConnections.forEach((connection, zoneId) => {
      console.log(`🔌 ${zoneId} 존 SSE 연결 해제`);
      connection.eventSource.close();
    });
    
    // 타이머 정리
    this.heartbeatTimers.forEach((timer, id) => {
      clearInterval(timer);
    });
    
    this.reconnectTimers.forEach((timer, id) => {
      clearTimeout(timer);
    });
    
    // 상태 초기화
    this.zoneConnections.clear();
    this.subscribers.clear();
    this.connectionStates.clear();
    this.lastMessageTimes.clear();
    this.heartbeatTimers.clear();
    this.reconnectTimers.clear();
    
    console.log('✅ 모든 SSE 연결 해제 완료');
  }
}

// 싱글톤 인스턴스 생성
export const unifiedSSEManager = new UnifiedSSEManager();

// 편의 함수들
export const connectMainSSE = (options) => unifiedSSEManager.connectMainSSE(options);
export const connectZoneSSE = (zoneId, options) => unifiedSSEManager.connectZoneSSE(zoneId, options);
export const subscribeToZone = (zoneId, callback) => unifiedSSEManager.subscribeToZone(zoneId, callback);
export const disconnectAll = () => unifiedSSEManager.disconnectAll();
export const getConnectionStates = () => unifiedSSEManager.getAllConnectionStates();
