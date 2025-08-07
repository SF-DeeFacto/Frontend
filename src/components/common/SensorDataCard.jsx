import React from 'react';

const SensorDataCard = ({ sensorData, zoneConfig }) => {
  const getSensorIcon = (sensorType) => {
    switch (sensorType) {
      case 'temperature':
        return '🌡️';
      case 'humidity':
        return '💧';
      case 'esd':
        return '⚡';
      case 'particle':
        return '🌫️';
      case 'windDir':
        return '🌪️';
      default:
        return '📊';
    }
  };

  const getSensorUnit = (sensorType) => {
    switch (sensorType) {
      case 'temperature':
        return '°C';
      case 'humidity':
        return '%';
      case 'esd':
        return 'V';
      case 'particle':
        return 'μg/m³';
      case 'windDir':
        return '°';
      default:
        return '';
    }
  };

  const getSensorValue = (sensorData) => {
    // 백엔드 데이터 형식에 맞춤
    if (sensorData.sensor_type === 'particle') {
      return `${sensorData.val_0_5?.toFixed(2) || 0}`;
    }
    return `${sensorData.val?.toFixed(1) || 0}`;
  };

  const getStatusColor = (sensorData) => {
    // 백엔드 데이터 형식에 맞춘 임계값 체크 로직
    const value = sensorData.sensor_type === 'particle' ? sensorData.val_0_5 : sensorData.val;
    
    if (sensorData.sensor_type === 'temperature') {
      if (value > 30) return 'text-red-600';
      if (value > 25) return 'text-yellow-600';
      return 'text-green-600';
    }
    
    if (sensorData.sensor_type === 'humidity') {
      if (value > 70) return 'text-red-600';
      if (value > 60) return 'text-yellow-600';
      return 'text-green-600';
    }
    
    if (sensorData.sensor_type === 'esd') {
      if (value > 50) return 'text-red-600';
      if (value > 30) return 'text-yellow-600';
      return 'text-green-600';
    }
    
    if (sensorData.sensor_type === 'particle') {
      if (value > 100) return 'text-red-600';
      if (value > 50) return 'text-yellow-600';
      return 'text-green-600';
    }
    
    return 'text-blue-600';
  };

  const getStatusBgColor = (sensorData) => {
    // 배경색용 상태 색상
    const value = sensorData.sensor_type === 'particle' ? sensorData.val_0_5 : sensorData.val;
    
    // 디버깅용 콘솔 로그
    console.log('센서 데이터:', sensorData.sensor_type, '값:', value);
    
    if (sensorData.sensor_type === 'temperature') {
      if (value > 30) return '#ef4444'; // red-500
      if (value > 25) return '#eab308'; // yellow-500
      return '#22c55e'; // green-500
    }
    
    if (sensorData.sensor_type === 'humidity') {
      if (value > 70) return '#ef4444'; // red-500
      if (value > 60) return '#eab308'; // yellow-500
      return '#22c55e'; // green-500
    }
    
    if (sensorData.sensor_type === 'esd') {
      if (value > 50) return '#ef4444'; // red-500
      if (value > 30) return '#eab308'; // yellow-500
      return '#22c55e'; // green-500
    }
    
    if (sensorData.sensor_type === 'particle') {
      if (value > 100) return '#ef4444'; // red-500
      if (value > 50) return '#eab308'; // yellow-500
      return '#22c55e'; // green-500
    }
    
    return '#22c55e'; // green-500 (기본값)
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 border border-gray-200 hover:shadow-lg transition-shadow w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800 text-sm capitalize truncate">
          {sensorData.sensor_type === 'esd' ? '정전기' : 
           sensorData.sensor_type === 'particle' ? '먼지' :
           sensorData.sensor_type === 'windDir' ? '풍향' :
           sensorData.sensor_type === 'temperature' ? '온도' :
           sensorData.sensor_type === 'humidity' ? '습도' : sensorData.sensor_type}
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
          {sensorData.sensor_id}
        </span>
      </div>
      

      
                    <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div 
            className="w-3 h-3 rounded-full border border-gray-300" 
            style={{ 
              backgroundColor: getStatusBgColor(sensorData),
              minWidth: '12px',
              minHeight: '12px'
            }}
            title={`상태: ${sensorData.val || sensorData.val_0_5}`}
          ></div>
          <div className={`text-xl font-bold ${getStatusColor(sensorData)}`}>
            {getSensorValue(sensorData)}
            <span className="text-xs ml-1">{getSensorUnit(sensorData.sensor_type)}</span>
          </div>
        </div>
        
        {sensorData.sensor_type === 'particle' && (
          <div className="text-xs text-gray-500 mt-1">
            <div>0.1μm: {sensorData.val_0_1?.toFixed(2) || 0}</div>
            <div>0.3μm: {sensorData.val_0_3?.toFixed(2) || 0}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorDataCard; 