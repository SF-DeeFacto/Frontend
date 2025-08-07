import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ZoneModelViewer from '../../components/3d/ZoneModelViewer';
import SensorDataCard from '../../components/common/SensorDataCard';
import zoneService from '../../services/zoneService';
import { getZoneConfig } from '../../config/zoneConfig';

const Zone = ({ zoneId }) => {
  const navigate = useNavigate();
  const params = useParams();
  const currentZoneId = zoneId || params.zoneId;
  
  const [sensorData, setSensorData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const zoneConfig = getZoneConfig(currentZoneId);
  const zoneName = zoneConfig?.name || `Zone ${currentZoneId?.toUpperCase() || 'Unknown'}`;
  
  // Zone이 존재하지 않는 경우 처리
  if (!currentZoneId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-600">Zone ID가 필요합니다</h2>
          <p className="text-sm text-gray-500 mt-2">올바른 URL로 접근해주세요.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!currentZoneId) {
      navigate('/');
      return;
    }

    // 초기 센서 데이터 로드
    const defaultSensors = zoneService.getZoneDefaultSensors(currentZoneId);
    setSensorData(defaultSensors);
    setIsLoading(false);

    // 실시간 센서 데이터 구독
    zoneService.subscribeToZoneData(currentZoneId, (newSensorData) => {
      setSensorData(newSensorData);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      zoneService.unsubscribe();
    };
  }, [currentZoneId, navigate]);

  const renderZoneDrawing = () => {
    return <ZoneModelViewer zoneId={currentZoneId} />;
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone 도면 영역 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">도면</h2>
            <div className="w-full h-96">
              {renderZoneDrawing()}
            </div>
          </div>
        </div>

        {/* 실시간 센서 데이터 영역 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">실시간 센서 데이터</h2>
            
            {Object.values(sensorData).flat().length === 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-6xl mb-4">📡</div>
                  <h2 className="text-xl font-semibold text-gray-600">
                    센서 데이터 준비 중
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    실시간 센서 데이터가 곧 추가될 예정입니다.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-4">
                  {Object.entries(sensorData).map(([sensorType, sensors]) => {
                    if (!sensors || sensors.length === 0) return null;
                    
                    return (
                      <div key={sensorType} className="flex flex-col gap-2">
                        <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                          <span>
                            {sensorType === 'temperature' ? '🌡️' :
                             sensorType === 'humidity' ? '💧' :
                             sensorType === 'esd' ? '⚡' :
                             sensorType === 'particle' ? '🌫️' :
                             sensorType === 'windDir' ? '🌪️' : '📊'}
                          </span>
                          {sensorType === 'esd' ? '정전기' : 
                           sensorType === 'particle' ? '먼지' :
                           sensorType === 'windDir' ? '풍향' :
                           sensorType === 'temperature' ? '온도' :
                           sensorType === 'humidity' ? '습도' : sensorType}
                          <span className="text-xs text-gray-400">({sensors.length}개)</span>
                        </h4>
                        <div className={sensors.length > 1 ? "flex gap-2" : "flex flex-col gap-2"}>
                          {sensors.map((sensor, index) => (
                            <div key={`${sensor.sensor_id}-${index}`} className="w-[300px]">
                              <SensorDataCard 
                                sensorData={sensor} 
                                zoneConfig={zoneConfig}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zone; 