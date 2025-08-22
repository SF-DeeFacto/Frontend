import React, { useState } from 'react';

const Userset = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      employeeId: 'EMP001',
      name: '홍길동', 
      password: '********',
      email: 'hong@example.com', 
      gender: 'male',
      department: '개발팀',
      position: '개발자',
      role: 'admin', 
      status: 'active' 
    },
    { 
      id: 2, 
      employeeId: 'EMP002',
      name: '김철수', 
      password: '********',
      email: 'kim@example.com', 
      gender: 'male',
      department: '디자인팀',
      position: '디자이너',
      role: 'user', 
      status: 'active' 
    },
    { 
      id: 3, 
      employeeId: 'EMP003',
      name: '이영희', 
      password: '********',
      email: 'lee@example.com', 
      gender: 'female',
      department: '마케팅팀',
      position: '매니저',
      role: 'user', 
      status: 'inactive' 
    }
  ]);

  const [newUser, setNewUser] = useState({
    employeeId: '',
    name: '',
    password: '',
    email: '',
    gender: 'male',
    department: '',
    position: '',
    role: 'user',
    status: 'active'
  });

  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const departments = ['개발팀', '디자인팀', '마케팅팀', '영업팀', '인사팀', '기획팀'];
  const positions = ['사원', '대리', '과장', '차장', '부장', '이사', '대표'];
  const roles = [
    { value: 'user', label: '일반 사용자' },
    { value: 'admin', label: '관리자' },
    { value: 'super_admin', label: '슈퍼 관리자' }
  ];

  const handleNewUserChange = (key, value) => {
    setNewUser(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleEditUserChange = (key, value) => {
    setEditingUser(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddUser = () => {
    if (newUser.employeeId && newUser.name && newUser.password && newUser.email && newUser.department && newUser.position) {
      const user = {
        id: users.length + 1,
        ...newUser
      };
      setUsers(prev => [...prev, user]);
      setNewUser({ employeeId: '', name: '', password: '', email: '', gender: 'male', department: '', position: '', role: 'user', status: 'active' });
      setShowAddModal(false);
    } else {
      alert('모든 필수 항목을 입력해주세요.');
    }
  };

  const handleEditUser = () => {
    if (editingUser.email && editingUser.department && editingUser.position) {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setEditingUser(null);
      setShowEditForm(false);
    } else {
      alert('모든 필수 항목을 입력해주세요.');
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setShowEditForm(true);
    setShowAddModal(false); // 등록 모달 닫기
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const getGenderLabel = (gender) => {
    return gender === 'male' ? '남성' : '여성';
  };

  const getRoleLabel = (role) => {
    return roles.find(r => r.value === role)?.label || role;
  };

  // 검색된 사용자 필터링
  const filteredUsers = users.filter(user =>
    user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* 사용자 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h5 className="font-medium text-gray-900">사용자 목록</h5>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <li key={user.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.employeeId} • {user.email}</div>
                      <div className="text-sm text-gray-400">{user.department} • {user.position}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'super_admin'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getRoleLabel(user.role)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? '활성' : '비활성'}
                    </span>
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
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

                 {/* 활성상태 */}
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">
                     활성상태
                   </label>
                   <select
                     value={newUser.status}
                     onChange={(e) => handleNewUserChange('status', e.target.value)}
                     className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="active">활성</option>
                     <option value="inactive">비활성</option>
                   </select>
                 </div>

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

                {/* 직책 - 권한 */}
                <div className="grid grid-cols-2 gap-2">
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

                {/* 비밀번호 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value="********"
                    disabled
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>

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
                    value={editingUser.status}
                    onChange={(e) => handleEditUserChange('status', e.target.value)}
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
