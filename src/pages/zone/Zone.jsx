import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ZoneModelViewer from '../../components/3d/ZoneModelViewer';
import SensorDataCard from '../../components/common/SensorDataCard';
import { connectZoneSSE } from '../../services/sse';
import '../../styles/zone.css';

const Zone = ({ zoneId }) => {
  const navigate = useNavigate();
  const params = useParams();
  const currentZoneId = zoneId || params.zoneId;
  
  const [sensorData, setSensorData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] = useState('connecting');
  const [lastUpdated, setLastUpdated] = useState(null);

  const zoneName = `Zone ${currentZoneId?.toUpperCase() || 'Unknown'}`;
  
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

    console.log(`${currentZoneId} Zone 센서 데이터 SSE 연결 시작`);
    let disconnectSSE = null;

    try {
      setConnectionState('connecting');
      
      // zoneId를 백엔드 형식에 맞게 변환 (b01 -> zone_B)
      const backendZoneId = currentZoneId === 'b01' ? 'zone_B' : currentZoneId;
      disconnectSSE = connectZoneSSE(backendZoneId, {
        onOpen: (event) => {
          console.log(`${currentZoneId} Zone SSE 연결 성공!`);
          setConnectionState('connected');
          setIsLoading(false);
        },
        onMessage: (data) => {
          console.log(`${currentZoneId} Zone SSE 데이터 수신:`, data);
          
          try {
            console.log(`${currentZoneId} SSE 원본 데이터:`, data);
            
            // 빈 배열이 오는 경우 처리
            if (Array.isArray(data) && data.length === 0) {
              console.log(`${currentZoneId} 빈 센서 데이터 수신`);
              setSensorData({});
              setLastUpdated(new Date().toLocaleTimeString());
              return;
            }
            
            // 새로운 데이터 구조 처리 (배열 형태)
            if (Array.isArray(data) && data.length > 0) {
              const updateTime = new Date().toLocaleTimeString();
              const groupedSensors = {};
              
              // 모든 배열 요소의 센서들을 처리
              data.forEach(dataItem => {
                if (dataItem.sensors && Array.isArray(dataItem.sensors)) {
                  dataItem.sensors.forEach(sensor => {
                    const sensorType = sensor.sensorType;
                    if (!groupedSensors[sensorType]) {
                      groupedSensors[sensorType] = [];
                    }
                    
                    // 백엔드 데이터를 프론트엔드 형식에 맞게 변환
                    const convertedSensor = {
                      sensor_id: sensor.sensorId,
                      sensor_type: sensor.sensorType,
                      timestamp: sensor.timestamp,
                      status: sensor.sensorStatus
                    };

                    // 센서 타입별로 값 처리
                    if (sensor.sensorType === 'particle') {
                      // 먼지 센서는 3개 값 (0.1, 0.3, 0.5) - 소수점 유지
                      convertedSensor.val_0_1 = parseFloat(sensor.values?.['0.1']) || 0;
                      convertedSensor.val_0_3 = parseFloat(sensor.values?.['0.3']) || 0;
                      convertedSensor.val_0_5 = parseFloat(sensor.values?.['0.5']) || 0;
                    } else {
                      // 다른 센서들은 단일 값 - 소수점 유지
                      convertedSensor.val = parseFloat(sensor.values?.value) || 0;
                    }
                    
                    // 이미 존재하는 센서인지 확인하고 업데이트
                    const existingIndex = groupedSensors[sensorType].findIndex(
                      existing => existing.sensor_id === sensor.sensorId
                    );
                    
                    if (existingIndex >= 0) {
                      groupedSensors[sensorType][existingIndex] = convertedSensor;
                    } else {
                      groupedSensors[sensorType].push(convertedSensor);
                    }
                  });
                }
              });
              
              setSensorData(groupedSensors);
              setLastUpdated(updateTime);
              console.log(`${currentZoneId} 센서 데이터 업데이트:`, groupedSensors);
              return;
            }
            
            // 기존 데이터 구조 처리 (code/data 형태)
            if (data && data.code === 'OK' && data.data) {
              const zoneData = data.data;
              const updateTime = new Date().toLocaleTimeString();
              
              // 센서 데이터 처리
              if (zoneData.sensors && Array.isArray(zoneData.sensors)) {
                // 센서 타입별로 그룹화
                const groupedSensors = {};
                
                zoneData.sensors.forEach(sensor => {
                  const sensorType = sensor.sensorType;
                  if (!groupedSensors[sensorType]) {
                    groupedSensors[sensorType] = [];
                  }
                  
                  // 백엔드 데이터를 프론트엔드 형식에 맞게 변환
                  const convertedSensor = {
                    sensor_id: sensor.sensorId,
                    sensor_type: sensor.sensorType,
                    timestamp: sensor.timestamp,
                    status: sensor.sensorStatus
                  };

                  // 센서 타입별로 값 처리
                  if (sensor.sensorType === 'particle') {
                    // 먼지 센서는 3개 값 (0.1, 0.3, 0.5) - 소수점 유지
                    convertedSensor.val_0_1 = parseFloat(sensor.values?.['0.1']) || 0;
                    convertedSensor.val_0_3 = parseFloat(sensor.values?.['0.3']) || 0;
                    convertedSensor.val_0_5 = parseFloat(sensor.values?.['0.5']) || 0;
                  } else {
                    // 다른 센서들은 단일 값 - 소수점 유지
                    convertedSensor.val = parseFloat(sensor.values?.value) || 0;
                  }
                  
                  groupedSensors[sensorType].push(convertedSensor);
                });
                
                setSensorData(groupedSensors);
                setLastUpdated(updateTime);
                console.log(`${currentZoneId} 센서 데이터 업데이트:`, groupedSensors);
              }
            } else {
              console.log(`${currentZoneId} SSE 응답이 올바르지 않습니다:`, data);
            }
          } catch (error) {
            console.error(`${currentZoneId} SSE 데이터 처리 오류:`, error);
          }
        },
        onError: (error) => {
          console.error(`${currentZoneId} Zone SSE 연결 오류:`, error);
          setConnectionState('error');
          setIsLoading(false);
        }
      });
      
      console.log(`${currentZoneId} Zone SSE 연결 초기화 완료`);
    } catch (error) {
      console.error(`${currentZoneId} Zone SSE 연결 초기화 오류:`, error);
      setConnectionState('error');
      setIsLoading(false);
    }

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      console.log(`${currentZoneId} Zone 컴포넌트 언마운트 - SSE 연결 해제`);
      if (disconnectSSE) {
        try {
          disconnectSSE();
        } catch (error) {
          console.log(`${currentZoneId} SSE 연결 해제 중 오류:`, error);
        }
      }
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
            <div className="w-full h-[600px]">
              {renderZoneDrawing()}
            </div>
          </div>
        </div>

        {/* 실시간 센서 데이터 영역 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">실시간 센서 데이터</h2>
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: 
                      connectionState === 'connected' ? '#10b981' :
                      connectionState === 'connecting' ? '#3b82f6' :
                      connectionState === 'error' ? '#ef4444' : '#9ca3af'
                  }}
                ></div>
                <span className="text-sm text-gray-600">
                  {connectionState === 'connected' && '연결됨'}
                  {connectionState === 'connecting' && '연결중'}
                  {connectionState === 'error' && '연결 오류'}
                </span>
                {lastUpdated && (
                  <span className="text-xs text-gray-500">
                    {lastUpdated}
                  </span>
                )}
              </div>
            </div>
            
            {Object.values(sensorData).flat().length === 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {connectionState === 'connected' ? '📡' :
                     connectionState === 'connecting' ? '⏳' :
                     connectionState === 'error' ? '❌' : '📡'}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-600">
                    {connectionState === 'connected' ? '센서 데이터 준비 중' :
                     connectionState === 'connecting' ? '연결 중...' :
                     connectionState === 'error' ? '연결 오류' : '센서 데이터 준비 중'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    {connectionState === 'connected' ? '실시간 센서 데이터가 곧 추가될 예정입니다.' :
                     connectionState === 'connecting' ? '백엔드 서버에 연결하고 있습니다...' :
                     connectionState === 'error' ? '백엔드 서버 연결에 실패했습니다.' : '실시간 센서 데이터가 곧 추가될 예정입니다.'}
                  </p>
                </div>
              </div>
            ) : (
                             <div>
                 <div className="flex flex-col gap-4">
                   {/* 센서 타입 순서 고정 */}
                   {[
                     { type: 'temperature', icon: '🌡️', name: '온도' },
                     { type: 'humidity', icon: '💧', name: '습도' },
                     { type: 'esd', icon: '⚡', name: '정전기' },
                     { type: 'particle', icon: '🌫️', name: '먼지' },
                     { type: 'windDir', icon: '🌪️', name: '풍향' }
                   ].map(({ type, icon, name }) => {
                     const sensors = sensorData[type];
                     if (!sensors || sensors.length === 0) return null;
                     
                     return (
                       <div key={type} className="flex flex-col gap-2">
                         <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                           <span>{icon}</span>
                           {name}
                           <span className="text-xs text-gray-400">({sensors.length}개)</span>
                         </h4>
                         <div className={sensors.length > 1 ? "flex gap-2" : "flex flex-col gap-2"}>
                                                       {sensors.map((sensor, index) => (
                              <div key={`${sensor.sensor_id}-${index}`} className="w-[250px]">
                                <SensorDataCard 
                                  sensorData={sensor}
                                  zoneId={currentZoneId}
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