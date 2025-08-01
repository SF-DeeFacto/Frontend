// 권한 관련 유틸리티 함수들

// 현재 로그인한 사용자 정보 가져오기
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      return null;
    }
  }
  return null;
};

// 사용자의 권한 확인
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

// 관리자 권한 확인
export const isAdmin = () => {
  return getUserRole() === 'admin';
};

// 특정 Zone에 대한 접근 권한 확인
export const hasZoneAccess = (zoneId) => {
  const user = getCurrentUser();
  if (!user) return false;

  // 관리자는 모든 Zone에 접근 가능
  if (user.role === 'admin') return true;

  // 일반 사용자는 자신의 role과 일치하는 Zone만 접근 가능
  const zoneMapping = {
    'a': 'A',
    'b': 'A', 
    'c': 'B',
    'd': 'B',
    'e': 'B',
    'f': 'B',
    'g': 'C',
    'h': 'C'
  };

  const userZone = zoneMapping[zoneId.toLowerCase()];
  return user.role === userZone;
};

// Zone 이름을 사용자 친화적으로 변환
export const getZoneDisplayName = (zoneId) => {
  const zoneNames = {
    'a': 'A01',
    'b': 'A02',
    'c': 'B01',
    'd': 'B02',
    'e': 'B03',
    'f': 'B04',
    'g': 'C01',
    'h': 'C02'
  };
  return zoneNames[zoneId.toLowerCase()] || `Zone ${zoneId.toUpperCase()}`;
};

// 권한 오류 메시지 표시
export const showPermissionError = (zoneId) => {
  const zoneName = getZoneDisplayName(zoneId);
  alert(`권한이 없습니다.\n${zoneName}에 접근할 수 있는 권한이 없습니다.`);
}; 