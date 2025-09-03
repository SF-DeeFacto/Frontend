/**
 * 성능 최적화 관련 커스텀 훅
 */

import { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { debounce, throttle, memoize } from '@utils/performance';

/**
 * 디바운스된 값을 반환하는 훅
 * @param {any} value - 디바운스할 값
 * @param {number} delay - 지연 시간
 * @returns {any} 디바운스된 값
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 디바운스된 콜백을 반환하는 훅
 * @param {Function} callback - 디바운스할 콜백
 * @param {number} delay - 지연 시간
 * @param {Array} deps - 의존성 배열
 * @returns {Function} 디바운스된 콜백
 */
export const useDebouncedCallback = (callback, delay, deps = []) => {
  return useCallback(debounce(callback, delay), deps);
};

/**
 * 스로틀된 콜백을 반환하는 훅
 * @param {Function} callback - 스로틀할 콜백
 * @param {number} delay - 제한 시간
 * @param {Array} deps - 의존성 배열
 * @returns {Function} 스로틀된 콜백
 */
export const useThrottledCallback = (callback, delay, deps = []) => {
  return useCallback(throttle(callback, delay), deps);
};

/**
 * 메모이제이션된 값을 반환하는 훅
 * @param {Function} factory - 값을 생성하는 함수
 * @param {Array} deps - 의존성 배열
 * @param {Function} keyGenerator - 캐시 키 생성 함수
 * @returns {any} 메모이제이션된 값
 */
export const useMemoized = (factory, deps, keyGenerator) => {
  const memoizedFactory = useRef(memoize(factory, keyGenerator));
  
  return useMemo(() => {
    return memoizedFactory.current(deps);
  }, deps);
};

/**
 * 이전 값을 기억하는 훅
 * @param {any} value - 현재 값
 * @returns {any} 이전 값
 */
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

/**
 * 컴포넌트가 마운트된 상태를 추적하는 훅
 * @returns {React.MutableRefObject<boolean>} 마운트 상태 ref
 */
export const useIsMounted = () => {
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return isMountedRef;
};

/**
 * 지연 로딩을 위한 훅
 * @param {number} delay - 지연 시간 (ms)
 * @returns {boolean} 로딩 완료 상태
 */
export const useDelay = (delay = 0) => {
  const [isReady, setIsReady] = useState(delay === 0);
  
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [delay]);
  
  return isReady;
};

/**
 * 화면에 요소가 보이는지 감지하는 훅
 * @param {Object} options - Intersection Observer 옵션
 * @returns {[React.RefObject, boolean]} [ref, isVisible]
 */
export const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);
  
  return [ref, isVisible];
};

/**
 * 렌더 카운트를 추적하는 개발용 훅
 * @param {string} componentName - 컴포넌트 이름
 */
export const useRenderCount = (componentName = 'Component') => {
  const renderCount = useRef(0);
  
  renderCount.current += 1;
  
  if (import.meta.env.DEV) {
    console.log(`🔄 ${componentName} rendered ${renderCount.current} times`);
  }
};
