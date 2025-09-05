import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionLoading } from '../../../components/ui';
import { useUnifiedLoading } from '../../../hooks';

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
  const { loading, loadingText, error, withLoading, setLoadingError } = useUnifiedLoading({
    componentName: 'ProfileTab'
  });

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserProfile = async () => {
      await withLoading(async () => {
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
      });
    };

    loadUserProfile();
  }, [navigate, withLoading]);

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
      <SectionLoading
        loading={true}
        loadingText={loadingText}
        showHeader={false}
        className="py-8"
      />
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        {/* <h4 className="text-lg font-medium text-gray-900 mb-6">프로필 정보</h4> */}
        
        {/* 프로필 레이아웃 */}
                {/* 기존스타일-> 강사님 피드백
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6 transition-colors duration-300"> */}
        <div className="p-6 transition-colors duration-300">
        {/* <div 
          className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6 transition-colors duration-300"
          style={{
            boxShadow: '0px 9px 16px rgba(159, 162, 191, .08), 0px 2px 2px rgba(159, 162, 191, 0.12)'
          }}
        > */}
          <div className="flex items-start space-x-12">
            {/* 프로필 사진 영역 */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#494FA2] to-purple-400 flex items-center justify-center shadow-lg mb-3">
                <span className="text-2xl font-bold text-white">
                  {profile.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="text-center space-y-1">
                <div className="text-base font-semibold text-gray-900 dark:text-neutral-100">
                  {profile.name || '이름 없음'}
                </div>
                <div className="text-xs text-gray-600 dark:text-neutral-400">
                  {profile.gender === 'M' ? '남성' : profile.gender === 'F' ? '여성' : profile.gender || '성별 정보 없음'}
                </div>
              </div>
            </div>
            
            {/* 프로필 정보 영역 */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-8">
                {/* 첫 번째 열: 사원번호 ~ 직책 */}
                <div className="space-y-7">
                  {/* 사원번호 */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 dark:text-neutral-200 mb-1">
                      사원번호
                    </label>
                    <div className="text-sm text-gray-600 dark:text-neutral-300">
                      {profile.employeeId || '사원번호 없음'}
                    </div>
                  </div>
                  
                  {/* 이메일 */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 dark:text-neutral-200 mb-1">
                      이메일
                    </label>
                    <div className="text-sm text-gray-600 dark:text-neutral-300">
                      {profile.email || '이메일 없음'}
                    </div>
                  </div>
                  
                  {/* 부서 */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 dark:text-neutral-200 mb-1">
                      부서
                    </label>
                    <div className="text-sm text-gray-600 dark:text-neutral-300">
                      {profile.department || '부서 정보 없음'}
                    </div>
                  </div>
                  
                  {/* 직책 */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 dark:text-neutral-200 mb-1">
                      직책
                    </label>
                    <div className="text-sm text-gray-600 dark:text-neutral-300">
                      {profile.position || '직책 정보 없음'}
                    </div>
                  </div>
                </div>
                
                {/* 두 번째 열: 권한 ~ 근무시간 */}
                <div className="space-y-7">
                  {/* 권한 */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 dark:text-neutral-200 mb-1">
                      권한
                    </label>
                    <div className="text-sm text-gray-600 dark:text-neutral-300">
                      {profile.role === 'ADMIN' ? '관리자' : profile.role === 'USER' ? '일반 사용자' : profile.role || '권한 정보 없음'}
                    </div>
                  </div>
                  
                  {/* 구역범위 */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 dark:text-neutral-200 mb-1">
                      구역범위
                    </label>
                    <div className="text-sm text-gray-600 dark:text-neutral-300">
                      {profile.scope === 'a,b,c' ? '전체구역' : 
                       profile.scope === 'a' ? 'A구역' : 
                       profile.scope === 'b' ? 'B구역' : 
                       profile.scope === 'c' ? 'C구역' : 
                       profile.scope || '구역 정보 없음'}
                    </div>
                  </div>
                  
                  {/* 근무시간 */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 dark:text-neutral-200 mb-1">
                      근무시간
                    </label>
                    <div className="text-sm text-gray-600 dark:text-neutral-300">
                      {profile.shift === 'DAY' ? '주간(D)' : 
                       profile.shift === 'NIGHT' ? '야간(N)' : 
                       profile.shift || '근무시간 정보 없음'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
