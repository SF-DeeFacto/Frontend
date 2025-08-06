import React, { useState } from 'react';

const Equipset = () => {
  const [equipments, setEquipments] = useState([
    { id: 1, name: '센서 A', type: 'temperature', location: '1층', status: 'active', lastMaintenance: '2024-01-15' },
    { id: 2, name: '센서 B', type: 'humidity', location: '2층', status: 'active', lastMaintenance: '2024-01-10' },
    { id: 3, name: '센서 C', type: 'pressure', location: '지하', status: 'inactive', lastMaintenance: '2024-01-05' }
  ]);

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    type: 'temperature',
    location: '',
    status: 'active',
    lastMaintenance: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const equipmentTypes = [
    { value: 'temperature', label: '온도 센서' },
    { value: 'humidity', label: '습도 센서' },
    { value: 'pressure', label: '압력 센서' },
    { value: 'flow', label: '유량 센서' },
    { value: 'level', label: '레벨 센서' }
  ];

  const handleNewEquipmentChange = (key, value) => {
    setNewEquipment(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddEquipment = () => {
    if (newEquipment.name && newEquipment.location) {
      const equipment = {
        id: equipments.length + 1,
        ...newEquipment,
        lastMaintenance: newEquipment.lastMaintenance || new Date().toISOString().split('T')[0]
      };
      setEquipments(prev => [...prev, equipment]);
      setNewEquipment({ name: '', type: 'temperature', location: '', status: 'active', lastMaintenance: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteEquipment = (equipmentId) => {
    if (window.confirm('정말로 이 장비를 삭제하시겠습니까?')) {
      setEquipments(prev => prev.filter(equipment => equipment.id !== equipmentId));
    }
  };

  const handleStatusChange = (equipmentId, newStatus) => {
    setEquipments(prev => prev.map(equipment => 
      equipment.id === equipmentId ? { ...equipment, status: newStatus } : equipment
    ));
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      temperature: 'bg-red-100 text-red-800',
      humidity: 'bg-blue-100 text-blue-800',
      pressure: 'bg-purple-100 text-purple-800',
      flow: 'bg-green-100 text-green-800',
      level: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-900">장비 설정</h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showAddForm ? '취소' : '장비 추가'}
        </button>
      </div>

      {/* 장비 추가 폼 */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-md space-y-4">
          <h5 className="font-medium text-gray-900">새 장비 추가</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                장비명
              </label>
              <input
                type="text"
                value={newEquipment.name}
                onChange={(e) => handleNewEquipmentChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                센서 타입
              </label>
              <select
                value={newEquipment.type}
                onChange={(e) => handleNewEquipmentChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {equipmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설치 위치
              </label>
              <input
                type="text"
                value={newEquipment.location}
                onChange={(e) => handleNewEquipmentChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상태
              </label>
              <select
                value={newEquipment.status}
                onChange={(e) => handleNewEquipmentChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                마지막 점검일
              </label>
              <input
                type="date"
                value={newEquipment.lastMaintenance}
                onChange={(e) => handleNewEquipmentChange('lastMaintenance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddEquipment}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              추가
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 장비 목록 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {equipments.map((equipment) => (
            <li key={equipment.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {equipment.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{equipment.name}</div>
                    <div className="text-sm text-gray-500">{equipment.location}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(equipment.type)}`}>
                    {equipmentTypes.find(type => type.value === equipment.type)?.label}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                    {equipment.status === 'active' ? '활성' : '비활성'}
                  </span>
                  <div className="text-sm text-gray-500">
                    점검: {equipment.lastMaintenance}
                  </div>
                  <select
                    value={equipment.status}
                    onChange={(e) => handleStatusChange(equipment.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                  <button
                    onClick={() => handleDeleteEquipment(equipment.id)}
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
  );
};

export default Equipset;
