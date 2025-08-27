// 통합 설정 기반 더미 사용자 데이터 생성기

// 사용자 역할 정의
const USER_ROLES = {
  ADMIN: 'admin',
  USER_A: 'A',
  USER_B: 'B',
  USER_C: 'C'
};

// 부서 정의
const DEPARTMENTS = ['관리팀', '생산팀', '품질팀', '기술팀', '영업팀'];

// 직급 정의
const POSITIONS = ['사원', '대리', '과장', '차장', '부장', '이사'];

// 성별 정의
const GENDERS = ['남', '여'];

// 근무 교대 정의
const SHIFTS = ['오전', '오후', '야간', null];

// 랜덤 항목 선택 함수
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// 랜덤 이메일 생성
const generateEmail = (name, company = 'deefacto.com') => {
  const domains = ['gmail.com', 'naver.com', 'daum.net', company];
  const domain = getRandomItem(domains);
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${name}${randomSuffix}@${domain}`;
};

// 랜덤 날짜 생성 (최근 1년 내)
const generateRandomDate = () => {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const randomTime = oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime());
  return new Date(randomTime).toISOString().slice(0, 19).replace('T', ' ');
};

// 더미 사용자 데이터 생성
export const generateDummyUsers = (count = 10) => {
  const users = [];
  
  // 기본 관리자 계정
  // users.push({
  //   id: 1,
  //   employee_id: 'admin',
  //   password: '1234',
  //   name: '홍길동',
  //   email: 'hong@deefacto.com',
  //   gender: '남',
  //   department: '관리팀',
  //   position: '관리자',
  //   role: USER_ROLES.ADMIN,
  //   created_at: '2024-01-01 09:00:00',
  //   updated_at: '2024-01-01 09:00:00',
  //   shift: null
  // });

  // 일반 사용자 계정들 생성
  for (let i = 2; i <= count; i++) {
    const name = `사용자${i}`;
    const role = getRandomItem(Object.values(USER_ROLES));
    const department = getRandomItem(DEPARTMENTS);
    const position = getRandomItem(POSITIONS);
    const gender = getRandomItem(GENDERS);
    const shift = getRandomItem(SHIFTS);
    
    users.push({
      id: i,
      employee_id: `user${i}`,
      password: '1234',
      name,
      email: generateEmail(name),
      gender,
      department,
      position,
      role,
      created_at: generateRandomDate(),
      updated_at: generateRandomDate(),
      shift
    });
  }

  return users;
};

// 특정 역할의 사용자만 생성
export const generateUsersByRole = (role, count = 5) => {
  const allUsers = generateDummyUsers(count * 2);
  return allUsers.filter(user => user.role === role);
};

// 특정 부서의 사용자만 생성
export const generateUsersByDepartment = (department, count = 5) => {
  const allUsers = generateDummyUsers(count * 2);
  return allUsers.filter(user => user.department === department);
};

// 기본 더미 사용자 데이터 (기존 호환성 유지)
export const dummyUsers = generateDummyUsers(10);

// 사용자 검증 함수들
export const validateUserCredentials = (username, password) => {
  return dummyUsers.find(user => 
    user.employee_id === username && user.password === password
  );
};

export const getUserById = (id) => {
  return dummyUsers.find(user => user.id === id);
};

export const getUserByEmployeeId = (employeeId) => {
  return dummyUsers.find(user => user.employee_id === employeeId);
};
