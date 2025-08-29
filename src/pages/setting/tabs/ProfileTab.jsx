import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileTab = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    employeeId: '',
    department: '',
    email: '',
    gender: '',
    name: '',
    position: '',
    role: '',
    scope: '',
    shift: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserProfile = () => {
      try {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          // console.log('인증 정보가 없습니다. 로그인 페이지로 이동합니다.');
          navigate('/login');
          return;
        }
        
        const user = JSON.parse(userData);
        // console.log('프로필 탭에서 로드된 사용자 데이터:', user);
        
        // 사용자 정보를 프로필 상태에 설정
        setProfile({
          employeeId: user.employeeId || '',
          department: user.department || '',
          email: user.email || '',
          gender: user.gender || '',
          name: user.name || '',
          position: user.position || '',
          role: user.role || '',
          scope: user.scope || '',
          shift: user.shift || user.shiftTime || ''
        });
        
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        setError('사용자 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  // localStorage 변화 감지 (실시간 동기화)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'access_token') {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          navigate('/login');
        } else {
          try {
            const user = JSON.parse(userData);
            setProfile({
              employeeId: user.employeeId || '',
              department: user.department || '',
              email: user.email || '',
              gender: user.gender || '',
              name: user.name || '',
              position: user.position || '',
              role: user.role || '',
              scope: user.scope || '',
              shift: user.shift || user.shiftTime || ''
            });
          } catch (error) {
            console.error('사용자 정보 파싱 오류:', error);
            navigate('/login');
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const handleProfileChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };



  // 로딩 상태
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">사용자 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">프로필 정보</h4>
        <div className="space-y-6">
          {/* 첫 번째 줄: 사원번호 - 이름 - 성별 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                value={profile.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={profile.gender}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
          </div>

          {/* 두 번째 줄: 직책 - 부서 - 이메일 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 직책 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                직책
              </label>
              <input
                type="text"
                value={profile.position}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
          </div>

          {/* 세 번째 줄: 권한 - 구역범위 - 근무시간 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 권한 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                권한
              </label>
              <input
                type="text"
                value={profile.role}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>

            {/* 근무시간 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                근무시간
              </label>
              <input
                type="text"
                value={profile.shift}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
          </div>
        </div>
        

      </div>
    </div>
  );
};

export default ProfileTab;
