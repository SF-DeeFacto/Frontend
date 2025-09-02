import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';

const Userset = () => {
  // 사용자 데이터 로드
  // const [users, setUsers] = useState([
  //   { 
  //     id: 1, 
  //     employeeId: 'EMP001',
  //     name: '홍길동', 
  //     password: '********',
  //     email: 'hong@example.com', 
  //     gender: 'male',
  //     department: '개발팀',
  //     position: '개발자',
  //     role: 'admin', 
  //     status: 'active' 
  //   },
  //   { 
  //     id: 2, 
  //     employeeId: 'EMP002',
  //     name: '김철수', 
  //     password: '********',
  //     email: 'kim@example.com', 
  //     gender: 'male',
  //     department: '디자인팀',
  //     position: '디자이너',
  //     role: 'user', 
  //     status: 'active' 
  //   },
  //   { 
  //     id: 3, 
  //     employeeId: 'EMP003',
  //     name: '이영희', 
  //     password: '********',
  //     email: 'lee@example.com', 
  //     gender: 'female',
  //     department: '마케팅팀',
  //     position: '매니저',
  //     role: 'user', 
  //     status: 'inactive' 
  //   }
  // ]);

  // 실제 API 연결용 상태
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newUser, setNewUser] = useState({
    employeeId: '',
    name: '',
    password: '',
    email: '',
    gender: '',
    department: '',
    position: '',
    role: '',
    scope: '',
    shift: ''
  });

  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const departments = ['개발팀', '디자인팀', '마케팅팀', '영업팀', '인사팀', '기획팀'];
  const positions = ['사원', '대리', '과장', '차장', '부장', '이사', '대표'];
  const roles = [
    { value: 'USER', label: '일반 사용자' },
    { value: 'ADMIN', label: '관리자' },
    // { value: 'ROOT', label: '슈퍼 관리자' }
  ];
  
  const scopes = [
    { value: 'a,b,c', label: '전체구역' },
    { value: 'a', label: 'A구역' },
    { value: 'b', label: 'B구역' },
    { value: 'c', label: 'C구역' }
  ];
  
  const shifts = [
    { value: 'DAY', label: '주간(D)' },
    { value: 'NIGHT', label: '야간(N)' }
  ];

  // 사용자 목록 로드
  const loadUsers = async (page = 0, searchTerm = '', size = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      let searchResults = [];
      let totalElements = 0;
      let totalPages = 0;

      if (searchTerm && searchTerm.trim()) {
        const trimmedTerm = searchTerm.trim();
        
        // 이름 또는 사번 검색 - 두 번의 API 호출로 OR 조건 구현
        const nameSearchParams = {
          page,
          size: size || pagination.size || 10,
          name: trimmedTerm
        };
        
        const employeeIdSearchParams = {
          page,
          size: size || pagination.size || 10,
          employeeId: trimmedTerm
        };
        
        console.log('이름 검색 파라미터:', nameSearchParams);
        console.log('사번 검색 파라미터:', employeeIdSearchParams);
        
        // 두 검색을 병렬로 실행
        const [nameResponse, employeeIdResponse] = await Promise.all([
          userService.searchUsers(nameSearchParams).catch(() => ({ data: { content: [] } })),
          userService.searchUsers(employeeIdSearchParams).catch(() => ({ data: { content: [] } }))
        ]);
        
        // 결과 합치기 (중복 제거)
        const nameResults = nameResponse?.data?.data?.content || nameResponse?.data?.content || [];
        const employeeIdResults = employeeIdResponse?.data?.data?.content || employeeIdResponse?.data?.content || [];
        
        // employeeId로 중복 제거
        const uniqueResults = new Map();
        [...nameResults, ...employeeIdResults].forEach(user => {
          uniqueResults.set(user.employeeId, user);
        });
        
        searchResults = Array.from(uniqueResults.values());
        
        // 페이징 정보는 검색 결과 기준
        totalElements = searchResults.length;
        totalPages = Math.ceil(totalElements / (size || pagination.size || 10));
      } else {
        // 검색어가 없으면 전체 조회
        const searchParams = {
          page,
          size: size || pagination.size || 10
        };
        
        console.log('전체 조회 파라미터:', searchParams);
        const response = await userService.searchUsers(searchParams);
        
        if (response && response.data) {
          const apiData = response.data.data || response.data;
          searchResults = apiData.content || [];
          totalElements = apiData.totalElements || 0;
          totalPages = apiData.totalPages || 0;
        }
      }
      
      // 백엔드 필드명을 프론트엔드 형식으로 매핑 (active -> isActive, M/F -> male/female)
      const mappedUsers = searchResults.map(user => ({
        ...user,
        isActive: user.active !== undefined ? user.active : true,
        gender: user.gender === 'M' ? 'male' : (user.gender === 'F' ? 'female' : user.gender)
      }));
      
      setUsers(mappedUsers);
      setPagination({
        page: page,
        size: size || pagination.size || 10,
        totalElements: totalElements,
        totalPages: totalPages
      });
      
      console.log('검색 결과:', mappedUsers.length, '개의 사용자 발견');
      
    } catch (error) {
      console.error('사용자 목록 로드 실패:', error);
      setError(`사용자 목록을 불러오는데 실패했습니다: ${error.message}`);
      setUsers([]);
      setPagination({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 목록 로드
  useEffect(() => {
    loadUsers();
  }, []);

  // 검색어 변경 시 사용자 목록 재로드
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadUsers(0, searchTerm);
    }, 300); // 300ms 지연으로 debounce 효과

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, pagination.size]); // pagination.size 의존성 추가

  const handleNewUserChange = (key, value) => {
    setNewUser(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleEditUserChange = (key, value) => {
    console.log(`사용자 수정 필드 변경: ${key} = ${value}`); // 디버깅용
    setEditingUser(prev => {
      const updated = {
        ...prev,
        [key]: value
      };
      console.log('수정된 사용자 정보:', updated); // 디버깅용
      return updated;
    });
  };

  const handleAddUser = async () => {
    if (newUser.employeeId && newUser.name && newUser.password && newUser.email && newUser.department && newUser.position) {
      setLoading(true);
      
      try {
        // 백엔드 API 형식에 맞게 데이터 변환
        const userData = {
          employeeId: newUser.employeeId,
          name: newUser.name,
          password: newUser.password,
          email: newUser.email,
          gender: newUser.gender === 'male' ? 'M' : 'F', // 백엔드에서 M/F 형식 사용
          department: newUser.department,
          position: newUser.position,
          role: newUser.role || 'USER',
          scope: newUser.scope || 'a,b,c', // @NotBlank이므로 빈 문자열 대신 기본값
          shift: newUser.shift || 'DAY' // 기본값 설정
        };
        
        console.log('등록 요청 데이터:', userData); // 디버깅용
        
        await userService.registerUser(userData);
        
        // 성공 시 목록 새로고침
        await loadUsers(pagination.page, searchTerm);
        
        // 폼 초기화
        setNewUser({ 
          employeeId: '', 
          name: '', 
          password: '', 
          email: '', 
          gender: '', 
          department: '', 
          position: '', 
          role: '',
          scope: '',
          shift: ''
        });
        
        setShowAddModal(false);
        alert('사용자가 성공적으로 등록되었습니다.');
        
      } catch (error) {
        console.error('사용자 등록 실패:', error);
        const errorMessage = error.response?.data?.message || '사용자 등록에 실패했습니다.';
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      alert('모든 필수 항목을 입력해주세요.');
    }
  };

  const handleEditUser = async () => {
    if (editingUser.email && editingUser.department && editingUser.position) {
      setLoading(true);
      
      try {
        // 백엔드 API 형식에 맞게 데이터 변환
        const userData = {
          employeeId: editingUser.employeeId,
          name: editingUser.name,
          email: editingUser.email,
          gender: editingUser.gender === 'male' ? 'M' : (editingUser.gender === 'female' ? 'F' : editingUser.gender), // 백엔드 형식 변환
          department: editingUser.department,
          position: editingUser.position,
          role: editingUser.role,
          scope: editingUser.scope || 'a,b,c',
          shift: editingUser.shift || 'DAY',
          active: editingUser.isActive !== undefined ? editingUser.isActive : true // 백엔드는 'active' 필드 사용
        };
        
        console.log('사용자 수정 요청 데이터:', userData); // 디버깅용
        console.log('원본 editingUser.scope:', editingUser.scope); // 디버깅용
        
        await userService.updateUser(userData);
        
        // 성공 시 목록 새로고침
        await loadUsers(pagination.page, searchTerm);
        
        setEditingUser(null);
        setShowEditForm(false);
        alert('사용자 정보가 성공적으로 수정되었습니다.');
        
      } catch (error) {
        console.error('사용자 정보 수정 실패:', error);
        const errorMessage = error.response?.data?.message || '사용자 정보 수정에 실패했습니다.';
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      alert('모든 필수 항목을 입력해주세요.');
    }
  };

  const handleDeleteUser = async (employeeId, userName) => {
    if (window.confirm(`정말로 ${userName} 사용자를 삭제하시겠습니까?`)) {
      setLoading(true);
      
      try {
        await userService.deleteUser(employeeId);
        
        // 성공 시 목록 새로고침
        await loadUsers(pagination.page, searchTerm);
        
        alert('사용자가 성공적으로 삭제되었습니다.');
        
      } catch (error) {
        console.error('사용자 삭제 실패:', error);
        const errorMessage = error.response?.data?.message || '사용자 삭제에 실패했습니다.';
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setShowEditForm(true);
    setShowAddModal(false); // 등록 모달 닫기
  };

  // 상태 변경 함수 - 더 이상 사용하지 않음 (백엔드에서 isActive로 관리)
  // const handleStatusChange = (userId, newStatus) => {
  //   setUsers(prev => prev.map(user => 
  //     user.id === userId ? { ...user, status: newStatus } : user
  //   ));
  // };

  const getRoleLabel = (role) => {
    return roles.find(r => r.value === role)?.label || role;
  };

  // 성별 라벨 변환 함수
  const getGenderLabel = (gender) => {
    switch(gender) {
      case 'M': return '남성';
      case 'F': return '여성';
      case 'male': return '남성';
      case 'female': return '여성';
      default: return gender;
    }
  };

  // 구역 라벨 변환 함수
  const getScopeLabel = (scope) => {
    switch(scope) {
      case 'a,b,c': return '전체구역';
      case 'a': return 'A구역';
      case 'b': return 'B구역';
      case 'c': return 'C구역';
      default: return scope;
    }
  };

  // 근무시간 라벨 변환 함수
  const getShiftLabel = (shift) => {
    switch(shift) {
      case 'DAY': return '주간(D)';
      case 'NIGHT': return '야간(N)';
      default: return shift;
    }
  };

  // 검색은 API에서 처리하므로 필터링 로직 제거
  // const filteredUsers = users.filter(user =>
  //   user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   user.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  
  // API에서 이미 필터링된 데이터를 받으므로 users를 그대로 사용
  const filteredUsers = users;
  
  // 디버깅: users 상태 확인
  console.log('현재 users 상태:', users);
  console.log('filteredUsers:', filteredUsers);
  console.log('users 길이:', users.length);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-900">회원정보 관리</h4>
        <button
          onClick={() => {
            setShowAddModal(true);
            setShowEditForm(false); // 수정 모달 닫기
            setEditingUser(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          사용자 등록
        </button>
      </div>

      {/* 검색 바 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              검색
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="사번 또는 이름으로 검색하세요"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              검색 초기화
            </button>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 사용자 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h5 className="font-medium text-gray-900">
              사용자 목록 
              {pagination.totalElements > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  ({pagination.totalElements}명)
                </span>
              )}
            </h5>
            {loading && (
              <div className="text-sm text-gray-500">로딩 중...</div>
            )}
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">사용자 목록을 불러오는 중...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">
                {searchTerm ? '검색 결과가 없습니다.' : '등록된 사용자가 없습니다.'}
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
              <li key={user.employeeId} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name || '이름 없음'}</div>
                      <div className="text-sm text-gray-500">{user.employeeId} • {user.email}</div>
                      <div className="text-sm text-gray-400">
                        {getGenderLabel(user.gender)} • 
                        {user.position} • 
                        {user.department} •
                        {getScopeLabel(user.scope)} • 
                        {getShiftLabel(user.shift)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ROOT' 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getRoleLabel(user.role)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? '활성' : '비활성'}
                    </span>
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      disabled={loading}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.employeeId, user.name)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                      disabled={loading}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            ))}
            </ul>
          )}
        </div>
        
        {/* 페이지네이션 */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                총 {pagination.totalElements}명 중 {pagination.page * pagination.size + 1}-{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}명 표시
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => loadUsers(pagination.page - 1, searchTerm)}
                  disabled={pagination.page === 0 || loading}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  이전
                </button>
                <span className="text-sm text-gray-600">
                  {pagination.page + 1} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => loadUsers(pagination.page + 1, searchTerm)}
                  disabled={pagination.page >= pagination.totalPages - 1 || loading}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

                     {/* 사용자 등록 모달 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
             <div className="mt-3">
               {/* 모달 헤더 */}
               <div className="flex justify-between items-center mb-4">
                 <h5 className="font-medium text-gray-900">사용자 등록</h5>
                 <button
                   onClick={() => setShowAddModal(false)}
                   className="text-gray-400 hover:text-gray-600 focus:outline-none"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                   </svg>
                 </button>
               </div>

                                           {/* 등록 폼 */}
              <div className="space-y-3">
                {/* 사번 - 이름 - 성별 */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      사번 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUser.employeeId}
                      onChange={(e) => handleNewUserChange('employeeId', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="사번"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => handleNewUserChange('name', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="이름"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      성별
                    </label>
                    <select
                      value={newUser.gender}
                      onChange={(e) => handleNewUserChange('gender', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">선택</option>
                      <option value="male">남성</option>
                      <option value="female">여성</option>
                    </select>
                  </div>
                </div>

                {/* 부서 - 직책 - 권한 */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      부서 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newUser.department}
                      onChange={(e) => handleNewUserChange('department', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">선택</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      직책 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newUser.position}
                      onChange={(e) => handleNewUserChange('position', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">선택</option>
                      {positions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      권한
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => handleNewUserChange('role', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">선택</option>
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                 {/* 비밀번호 */}
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">
                     비밀번호 <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="password"
                     value={newUser.password}
                     onChange={(e) => handleNewUserChange('password', e.target.value)}
                     className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="비밀번호를 입력하세요"
                   />
                 </div>

                 {/* 이메일 */}
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">
                     이메일 <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="email"
                     value={newUser.email}
                     onChange={(e) => handleNewUserChange('email', e.target.value)}
                     className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="이메일을 입력하세요"
                   />
                                  </div>

                 {/* 구역범위 - 근무시간 */}
                 <div className="grid grid-cols-2 gap-2">
                   <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1">
                       구역범위
                     </label>
                     <select
                       value={newUser.scope}
                       onChange={(e) => handleNewUserChange('scope', e.target.value)}
                       className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                       <option value="">선택</option>
                       {scopes.map(scope => (
                         <option key={scope.value} value={scope.value}>{scope.label}</option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1">
                       근무시간
                     </label>
                     <select
                       value={newUser.shift}
                       onChange={(e) => handleNewUserChange('shift', e.target.value)}
                       className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                       <option value="">선택</option>
                       {shifts.map(shift => (
                         <option key={shift.value} value={shift.value}>{shift.label}</option>
                       ))}
                     </select>
                   </div>
                 </div>

                                  {/* 신규 사용자는 기본적으로 활성으로 생성되므로 활성상태 필드 제거 */}

                 <div className="flex space-x-2 mt-4">
                   <button
                     onClick={handleAddUser}
                     className="flex-1 bg-blue-600 text-white px-3 py-2 text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     등록
                   </button>
                   <button
                     onClick={() => setShowAddModal(false)}
                     className="flex-1 bg-gray-500 text-white px-3 py-2 text-sm rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                   >
                     취소
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

      {/* 사용자 수정 모달 */}
      {showEditForm && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* 모달 헤더 */}
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-medium text-gray-900">사용자 정보 수정</h5>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* 수정 폼 */}
              <div className="space-y-3">
                {/* 사번 - 이름 - 성별 */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      사번
                    </label>
                    <input
                      type="text"
                      value={editingUser.employeeId}
                      disabled
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      이름
                    </label>
                    <input
                      type="text"
                      value={editingUser.name}
                      disabled
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      성별
                    </label>
                    <select
                      value={editingUser.gender}
                      onChange={(e) => handleEditUserChange('gender', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male">남성</option>
                      <option value="female">여성</option>
                    </select>
                  </div>
                </div>

                {/* 부서 - 직책 - 권한 */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      부서 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editingUser.department}
                      onChange={(e) => handleEditUserChange('department', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">선택</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      직책 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editingUser.position}
                      onChange={(e) => handleEditUserChange('position', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">선택</option>
                      {positions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      권한
                    </label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => handleEditUserChange('role', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 구역범위 - 근무시간 */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      구역범위
                    </label>
                    <select
                      value={editingUser.scope || 'a,b,c'}
                      onChange={(e) => {
                        console.log('구역범위 변경:', e.target.value); // 디버깅용
                        handleEditUserChange('scope', e.target.value);
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {scopes.map(scope => (
                        <option key={scope.value} value={scope.value}>{scope.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      근무시간
                    </label>
                    <select
                      value={editingUser.shift || 'DAY'}
                      onChange={(e) => handleEditUserChange('shift', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {shifts.map(shift => (
                        <option key={shift.value} value={shift.value}>{shift.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 비밀번호 필드 숨김 - 보안상 수정 모달에서는 표시하지 않음 */}

                {/* 이메일 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => handleEditUserChange('email', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 활성상태 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    활성상태
                  </label>
                  <select
                    value={editingUser.isActive ? 'active' : 'inactive'}
                    onChange={(e) => handleEditUserChange('isActive', e.target.value === 'active')}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handleEditUser}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingUser(null);
                    }}
                    className="flex-1 bg-gray-500 text-white px-3 py-2 text-sm rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userset;
