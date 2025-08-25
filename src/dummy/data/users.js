// 통합 설정 기반 더미 사용자 데이터 생성기 사용
// 기존 하드코딩된 데이터를 모두 제거하고 동적 생성으로 변경

import { 
  generateDummyUsers, 
  generateUsersByRole,
  generateUsersByDepartment,
  validateUserCredentials,
  getUserById,
  getUserByEmployeeId,
  dummyUsers
} from './userGenerator';

// 기본 더미 사용자 데이터 (기존 호환성 유지)
export { dummyUsers };

// 사용자 생성 함수들
export { 
  generateDummyUsers,
  generateUsersByRole,
  generateUsersByDepartment
};

// 사용자 검증 함수들
export { 
  validateUserCredentials,
  getUserById,
  getUserByEmployeeId
};