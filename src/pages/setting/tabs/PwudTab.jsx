import React, { useState } from 'react';

const PwudTab = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

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
    } else if (passwords.newPassword.length < 8) {
      newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validatePasswords()) {
      // 비밀번호 변경 로직 구현
      console.log('비밀번호 변경:', passwords);
      alert('비밀번호가 성공적으로 변경되었습니다.');
      
      // 폼 초기화
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
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
              비밀번호는 8자 이상이어야 하며, 영문, 숫자, 특수문자를 포함해야 합니다.
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
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              비밀번호 변경
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PwudTab;
