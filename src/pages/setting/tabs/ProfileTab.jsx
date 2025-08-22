import React, { useState } from 'react';

const ProfileTab = () => {
  const [profile, setProfile] = useState({
    employeeId: 'EMP001',
    department: '개발팀',
    email: 'hong@example.com',
    gender: 'male',
    name: '홍길동',
    position: '개발자',
    role: 'admin',
    scope: 'A01,B01',
    shift: '09:00-18:00'
  });

  const handleProfileChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">프로필 정보</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 사원번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사원번호
            </label>
            <input
              type="text"
              value={profile.employeeId}
              onChange={(e) => handleProfileChange('employeeId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>

          {/* 부서 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              부서
            </label>
            <input
              type="text"
              value={profile.department}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              value={profile.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              성별
            </label>
            <input
              type="text"
              value={profile.gender === 'male' ? '남성' : '여성'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={profile.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>

          {/* 직책 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              직책
            </label>
            <input
              type="text"
              value={profile.position}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>

          {/* 권한 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              권한
            </label>
            <input
              type="text"
              value={profile.role === 'user' ? '일반 사용자' : profile.role === 'admin' ? '관리자' : '슈퍼 관리자'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>

          {/* 구역범위 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              구역범위
            </label>
            <input
              type="text"
              value={profile.scope}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />

          </div>

          {/* 근무시간 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              근무시간
            </label>
            <input
              type="text"
              value={profile.shift}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />

          </div>
        </div>
        

      </div>
    </div>
  );
};

export default ProfileTab;
