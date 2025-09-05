// 전역 아이콘 크기 설정
export const ICON_SIZES = {
  xs: { 
    class: 'w-3 h-3',      // 12px
    size: 16,
    description: '매우 작음 (12px)'
  },
  sm: { 
    class: 'w-4 h-4',      // 16px
    size: 18,
    description: '작음 (16px)'
  },
  md: { 
    class: 'w-5 h-5',      // 20px
    size: 20,
    description: '중간 (20px)'
  },
  lg: { 
    class: 'w-6 h-6',      // 24px
    size: 24,
    description: '큼 (24px)'
  },
  xl: { 
    class: 'w-8 h-8',      // 32px
    size: 32,
    description: '매우 큼 (32px)'
  }
};

// 기본 아이콘 크기 - 모든 아이콘이 이 크기를 기본으로 사용
export const DEFAULT_ICON_SIZE = 'sm';

// 컨텍스트별 권장 아이콘 크기
export const ICON_SIZE_RECOMMENDATIONS = {
  sidebar: 'xs',           // 사이드바 메뉴
  header: 'xs',            // 헤더 버튼
  button: 'sm',            // 일반 버튼
  card: 'sm',              // 카드 내부
  modal: 'md',             // 모달 내부
  dashboard: 'lg',         // 대시보드 메인
  hero: 'xl'               // 메인 섹션
};

// 아이콘 크기 변경을 위한 헬퍼 함수
export const getIconConfig = (size = DEFAULT_ICON_SIZE) => {
  return ICON_SIZES[size] || ICON_SIZES[DEFAULT_ICON_SIZE];
};

// 모든 아이콘을 한 번에 크기 조정하기 위한 글로벌 스케일
export const GLOBAL_ICON_SCALE = 1.0; // 1.0 = 기본, 0.8 = 20% 작게, 1.2 = 20% 크게

// 아이콘 선 굵기 설정 (strokeWidth)
export const ICON_STROKE_WIDTH = 2.0; // 1.5 = 기본, 2.0 = 굵게, 2.5 = 더 굵게
