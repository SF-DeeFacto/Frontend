import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const getUserRole = () => {
    return user?.role || null;
  };

  const isAdmin = () => {
    return getUserRole() === 'admin';
  };

  const hasZoneAccess = (zoneId) => {
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

  const getZoneDisplayName = (zoneId) => {
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

  const showPermissionError = (zoneId) => {
    const zoneName = getZoneDisplayName(zoneId);
    alert(`권한이 없습니다.\n${zoneName}에 접근할 수 있는 권한이 없습니다.`);
  };

  const getAccessibleZones = () => {
    if (!user) return [];

    if (isAdmin()) {
      return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    }

    const zoneMapping = {
      'admin': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      'A': ['a', 'b'],
      'B': ['c', 'd', 'e', 'f'],
      'C': ['g', 'h']
    };

    return zoneMapping[user.role] || [];
  };

  return {
    getUserRole,
    isAdmin,
    hasZoneAccess,
    getZoneDisplayName,
    showPermissionError,
    getAccessibleZones,
  };
}; 