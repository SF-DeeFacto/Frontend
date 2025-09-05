import { useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LOADING_TEXTS } from '../config';

/**
 * 통합 로딩 훅
 * 모든 로딩 상태를 일관되게 관리
 */
export const useUnifiedLoading = ({
  initialLoading = false,
  initialError = null,
  componentName = null,
  defaultLoadingText = LOADING_TEXTS.GENERAL
} = {}) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);
  const [customLoadingText, setCustomLoadingText] = useState('');
  const location = useLocation();

  // 자동 로딩 텍스트 감지
  const getAutoLoadingText = useCallback(() => {
    if (customLoadingText) return customLoadingText;

    // 1. Component Name 기반
    if (componentName) {
      switch (componentName) {
        case 'Home': return LOADING_TEXTS.PAGES.HOME;
        case 'Alarm': return LOADING_TEXTS.PAGES.ALARM;
        case 'Report': return LOADING_TEXTS.PAGES.REPORT;
        case 'Graph': return LOADING_TEXTS.PAGES.GRAPH;
        case 'Zone': return LOADING_TEXTS.PAGES.ZONE;
        case 'Setting': return LOADING_TEXTS.PAGES.SETTING;
        case 'Userset': return LOADING_TEXTS.DATA.USER_LIST;
        case 'AIRecommend': return LOADING_TEXTS.DATA.AI_RECOMMENDATION;
        case 'ProfileTab': return LOADING_TEXTS.DATA.USER_INFO;
        case 'PwudTab': return LOADING_TEXTS.ACTIONS.PASSWORD_CHANGE;
        default: return LOADING_TEXTS.DATA.GENERAL;
      }
    }

    // 2. Page Path 기반
    const path = location.pathname;
    if (path.includes('/home/alarm')) return LOADING_TEXTS.PAGES.ALARM;
    if (path.includes('/home/report')) return LOADING_TEXTS.PAGES.REPORT;
    if (path.includes('/home/graph')) return LOADING_TEXTS.PAGES.GRAPH;
    if (path.includes('/home/zone')) return LOADING_TEXTS.PAGES.ZONE;
    if (path.includes('/home/setting')) return LOADING_TEXTS.PAGES.SETTING;
    if (path.includes('/login')) return LOADING_TEXTS.PAGES.LOGIN;
    if (path === '/home') return LOADING_TEXTS.PAGES.HOME;

    return defaultLoadingText;
  }, [customLoadingText, componentName, location.pathname, defaultLoadingText]);

  const loadingText = useMemo(() => getAutoLoadingText(), [getAutoLoadingText]);

  // 기본 로딩 제어
  const startLoading = useCallback((text = '') => {
    setLoading(true);
    setCustomLoadingText(text);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
    setCustomLoadingText('');
  }, []);

  const setLoadingError = useCallback((err) => {
    setError(err);
    setLoading(false);
    setCustomLoadingText('');
  }, []);

  // 비동기 작업 래퍼
  const withLoading = useCallback(async (asyncFn, text = '') => {
    startLoading(text || getAutoLoadingText());
    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      setLoadingError(err.message || '오류가 발생했습니다.');
      throw err;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, setLoadingError, getAutoLoadingText]);

  // 특정 액션용 래퍼들
  const withSave = useCallback((asyncFn) => withLoading(asyncFn, LOADING_TEXTS.ACTIONS.SAVE), [withLoading]);
  const withUpdate = useCallback((asyncFn) => withLoading(asyncFn, LOADING_TEXTS.ACTIONS.UPDATE), [withLoading]);
  const withDelete = useCallback((asyncFn) => withLoading(asyncFn, LOADING_TEXTS.ACTIONS.DELETE), [withLoading]);
  const withApprove = useCallback((asyncFn) => withLoading(asyncFn, LOADING_TEXTS.ACTIONS.APPROVE), [withLoading]);
  const withReject = useCallback((asyncFn) => withLoading(asyncFn, LOADING_TEXTS.ACTIONS.REJECT), [withLoading]);
  const withPasswordChange = useCallback((asyncFn) => withLoading(asyncFn, LOADING_TEXTS.ACTIONS.PASSWORD_CHANGE), [withLoading]);

  // 상태 리셋
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setCustomLoadingText('');
  }, []);

  return {
    // 상태
    loading,
    loadingText,
    error,
    
    // 기본 제어
    startLoading,
    stopLoading,
    setLoadingError,
    reset,
    
    // 비동기 래퍼
    withLoading,
    withSave,
    withUpdate,
    withDelete,
    withApprove,
    withReject,
    withPasswordChange
  };
};

/**
 * 간단한 로딩 훅 (기본적인 로딩 상태만 필요할 때)
 */
export const useSimpleLoading = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);
  
  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  
  return {
    loading,
    startLoading,
    stopLoading,
    setLoading: setLoading
  };
};

/**
 * 버튼 로딩 훅 (버튼에 특화된 로딩 상태)
 */
export const useButtonLoading = () => {
  const [buttonLoading, setButtonLoading] = useState({});
  
  const startButtonLoading = useCallback((buttonId) => {
    setButtonLoading(prev => ({ ...prev, [buttonId]: true }));
  }, []);
  
  const stopButtonLoading = useCallback((buttonId) => {
    setButtonLoading(prev => ({ ...prev, [buttonId]: false }));
  }, []);
  
  const isButtonLoading = useCallback((buttonId) => {
    return buttonLoading[buttonId] || false;
  }, [buttonLoading]);
  
  const withButtonLoading = useCallback(async (buttonId, asyncFn) => {
    startButtonLoading(buttonId);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      stopButtonLoading(buttonId);
    }
  }, [startButtonLoading, stopButtonLoading]);
  
  return {
    buttonLoading,
    startButtonLoading,
    stopButtonLoading,
    isButtonLoading,
    withButtonLoading
  };
};

export default useUnifiedLoading;
