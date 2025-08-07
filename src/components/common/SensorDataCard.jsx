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
    if (sensorData.sensor_type === 'particle') {
      return `${sensorData.val_0_5?.toFixed(2) || 0}`;
    }
    return `${sensorData.val?.toFixed(1) || 0}`;
  };

  const getStatusColor = (sensorData) => {
    // 임계값 체크 로직 (실제로는 백엔드에서 받은 상태값 사용)
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
    
    return 'text-blue-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 border border-gray-200 hover:shadow-lg transition-shadow w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <span className="text-lg">{getSensorIcon(sensorData.sensor_type)}</span>
          <h3 className="font-semibold text-gray-800 text-sm capitalize truncate">
            {sensorData.sensor_type === 'esd' ? '정전기' : 
             sensorData.sensor_type === 'particle' ? '먼지' :
             sensorData.sensor_type === 'windDir' ? '풍향' :
             sensorData.sensor_type === 'temperature' ? '온도' :
             sensorData.sensor_type === 'humidity' ? '습도' : sensorData.sensor_type}
          </h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded text-xs">
          {sensorData.sensor_id}
        </span>
      </div>
      
      {/* 센서 위치 정보 표시 */}
      {zoneConfig && zoneConfig.sensors && (() => {
        const sensorInfo = Object.values(zoneConfig.sensors)
          .flat()
          .find(sensor => sensor.sensor_id === sensorData.sensor_id);
        return sensorInfo?.location ? (
          <div className="text-xs text-gray-400 mb-1">
            📍 {sensorInfo.location}
          </div>
        ) : null;
      })()}
      
              <div className="text-center">
          <div className={`text-xl font-bold ${getStatusColor(sensorData)}`}>
            {getSensorValue(sensorData)}
            <span className="text-xs ml-1">{getSensorUnit(sensorData.sensor_type)}</span>
          </div>
        
        {sensorData.sensor_type === 'particle' && (
          <div className="text-xs text-gray-500 mt-1">
            <div>0.1μm: {sensorData.val_0_1?.toFixed(2) || 0}</div>
            <div>0.3μm: {sensorData.val_0_3?.toFixed(2) || 0}</div>
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-1">
          {new Date(sensorData.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default SensorDataCard; 