/**
 * 성능 최적화 유틸리티
 */

/**
 * 디바운스 함수 - 연속된 함수 호출을 지연시킴
 * @param {Function} func - 실행할 함수
 * @param {number} delay - 지연 시간 (ms)
 * @returns {Function} 디바운스된 함수
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * 스로틀 함수 - 함수 호출 빈도를 제한
 * @param {Function} func - 실행할 함수
 * @param {number} delay - 제한 시간 (ms)
 * @returns {Function} 스로틀된 함수
 */
export const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  
  return (...args) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

/**
 * 메모이제이션 함수 - 함수 결과를 캐시
 * @param {Function} func - 메모이제이션할 함수
 * @param {Function} keyGenerator - 캐시 키 생성 함수 (선택적)
 * @returns {Function} 메모이제이션된 함수
 */
export const memoize = (func, keyGenerator = (...args) => JSON.stringify(args)) => {
  const cache = new Map();
  
  return (...args) => {
    const key = keyGenerator(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func.apply(this, args);
    cache.set(key, result);
    
    // 캐시 크기 제한 (메모리 누수 방지)
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};

/**
 * 지연 실행 함수 - 다음 렌더 사이클로 실행을 연기
 * @param {Function} func - 실행할 함수
 */
export const defer = (func) => {
  setTimeout(func, 0);
};

/**
 * 성능 측정 유틸리티
 */
export const performanceUtils = {
  /**
   * 함수 실행 시간 측정
   * @param {Function} func - 측정할 함수
   * @param {string} label - 측정 라벨
   * @returns {any} 함수 실행 결과
   */
  measure: async (func, label = 'Function') => {
    const start = performance.now();
    const result = await func();
    const end = performance.now();
    
    if (import.meta.env.DEV) {
      console.log(`⏱️ ${label} execution time: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  },

  /**
   * 컴포넌트 렌더 시간 측정 (React DevTools용)
   * @param {string} name - 컴포넌트 이름
   * @param {Function} renderFn - 렌더 함수
   */
  measureRender: (name, renderFn) => {
    if (import.meta.env.DEV && window.performance && window.performance.mark) {
      performance.mark(`${name}-start`);
      const result = renderFn();
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      return result;
    }
    return renderFn();
  }
};

/**
 * 이미지 지연 로딩 유틸리티
 * @param {string} src - 이미지 소스
 * @param {string} placeholder - 플레이스홀더 이미지
 * @returns {Promise<string>} 로드된 이미지 소스
 */
export const lazyLoadImage = (src, placeholder = '') => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(placeholder);
    img.src = src;
  });
};

/**
 * 브라우저 idle 시간에 함수 실행
 * @param {Function} func - 실행할 함수
 * @param {number} timeout - 타임아웃 (ms)
 */
export const runOnIdle = (func, timeout = 5000) => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(func, { timeout });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(func, 0);
  }
};
