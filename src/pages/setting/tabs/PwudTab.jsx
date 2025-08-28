import React, { useState } from 'react';
import { userService } from '../../../services/userService';

const PwudTab = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (key, value) => {
    setPasswords(prev => ({
      ...prev,
      [key]: value
    }));
    
    // 에러 메시지 초기화
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  const validatePasswords = () => {
    const newErrors = {};

    if (!passwords.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (passwords.newPassword.length < 4) {
      newErrors.newPassword = '비밀번호는 4자 이상이어야 합니다.';
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePasswords()) {
      setIsLoading(true);
      
      try {
        // 현재 로그인된 사용자 정보 가져오기
        const employeeId = localStorage.getItem('employeeId');
        // const token = localStorage.getItem('access_token');
        
        // console.log('비밀번호 변경 시도:', {
        //   employeeId,
        //   hasToken: !!token,
        //   currentPassword: passwords.currentPassword ? '***' : '비어있음',
        //   newPassword: passwords.newPassword ? '***' : '비어있음'
        // });
        
        // 비밀번호 변경 API 호출
        const passwordData = {
          employeeId: employeeId, // 사용자 ID 추가
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        };
        
        await userService.changePassword(passwordData);
        
        // 성공 시 처리
        alert('비밀번호가 성공적으로 변경되었습니다.');
        
        // 폼 초기화
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // 에러 메시지 초기화
        setErrors({});
        
      } catch (error) {
        console.error('비밀번호 변경 실패:', error);
        // console.error('에러 상세 정보:', {
        //   status: error.response?.status,
        //   statusText: error.response?.statusText,
        //   data: error.response?.data,
        //   message: error.message
        // });
        
        // 에러 메시지 설정
        if (error.response?.status === 400) {
          setErrors({ currentPassword: '현재 비밀번호가 올바르지 않습니다.' });
        } else if (error.response?.status === 422) {
          setErrors({ newPassword: '새 비밀번호 형식이 올바르지 않습니다.' });
        } else {
          alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">비밀번호 변경</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              현재 비밀번호
            </label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호
            </label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              비밀번호는 4자 이상 설정해주세요.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className="mt-6">
            <button 
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PwudTab;
