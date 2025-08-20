import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ZoneModelViewer from '../../components/3d/ZoneModelViewer';
import B01ModelViewer from '../../components/3d/B01ModelViewer';
import A01ModelViewer from '../../components/3d/A01ModelViewer';
import SensorDataCard from '../../components/common/SensorDataCard';
import ModelCard from '../../components/common/ModelCard';
import { connectZoneSSE } from '../../services/sse';
// TODO: 더미 데이터 - 나중에 삭제 (시작)
import { zoneData, getZoneData, getUpdatedZoneData } from '../../dummy/data/zoneData';
// TODO: 더미 데이터 - 나중에 삭제 (끝)
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





    // 더미데이터를 사용하는 Zone들 (A01, A02, B02, B03, B04, C01, C02)
    // A01, A02: 온도, 습도, 먼지, 정전기, 풍향 센서
    // B02-B04: 각 센서타입 1개씩
    // C01: 온도2개, 습도2개, 풍향1개, 정전기1개 (먼지센서 없음)
    // C02: 온도2개, 습도2개, 풍향1개, 먼지1개, 정전기1개
    const dummyDataZones = ['a01', 'a02', 'b02', 'b03', 'b04', 'c01', 'c02'];
    if (dummyDataZones.includes(currentZoneId.toLowerCase())) {
      console.log(`${currentZoneId}존 - 더미데이터 사용`);
      setConnectionState('connected');
      setIsLoading(false);
      
      // TODO: 더미 데이터 - 나중에 삭제 (시작)
      // 더미데이터로 센서 데이터 설정
      const dummyData = getZoneData(currentZoneId)[0];
      const groupedSensors = {};
      
      dummyData.sensors.forEach(sensor => {
        const sensorType = sensor.sensorType;
        if (!groupedSensors[sensorType]) {
          groupedSensors[sensorType] = [];
        }
        
        // 더미데이터를 프론트엔드 형식에 맞게 변환
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
      setLastUpdated(new Date().toLocaleTimeString());
      console.log(`${currentZoneId}존 더미데이터 설정 완료:`, groupedSensors);
      
      // 5초마다 더미데이터 업데이트
      const intervalId = setInterval(() => {
        const updatedData = getUpdatedZoneData(currentZoneId)[0];
        const updatedGroupedSensors = {};
        
        updatedData.sensors.forEach(sensor => {
          const sensorType = sensor.sensorType;
          if (!updatedGroupedSensors[sensorType]) {
            updatedGroupedSensors[sensorType] = [];
          }
          
          const convertedSensor = {
            sensor_id: sensor.sensorId,
            sensor_type: sensor.sensorType,
            timestamp: sensor.timestamp,
            status: sensor.sensorStatus
          };

          if (sensor.sensorType === 'particle') {
            convertedSensor.val_0_1 = parseFloat(sensor.values?.['0.1']) || 0;
            convertedSensor.val_0_3 = parseFloat(sensor.values?.['0.3']) || 0;
            convertedSensor.val_0_5 = parseFloat(sensor.values?.['0.5']) || 0;
          } else {
            convertedSensor.val = parseFloat(sensor.values?.value) || 0;
          }
          
          updatedGroupedSensors[sensorType].push(convertedSensor);
        });
        
        setSensorData(updatedGroupedSensors);
        setLastUpdated(new Date().toLocaleTimeString());
      }, 5000);
      
      return () => clearInterval(intervalId);
      // TODO: 더미 데이터 - 나중에 삭제 (끝)
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
              const zoneData = data[0];
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
                
                setSensorData(groupedSensors);
                setLastUpdated(updateTime);
                console.log(`${currentZoneId} 센서 데이터 업데이트:`, groupedSensors);
                return;
              }
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
        },
        onOpen: (event) => {
          console.log(`${currentZoneId} Zone SSE 연결 성공!`);
          setConnectionState('connected');
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
    // A01존은 A01ModelViewer를 사용
    if (currentZoneId.toLowerCase() === 'a01') {
      return <A01ModelViewer />;
    }
    // A02존은 ZoneModelViewer를 사용 (A02ModelViewer 포함)
    if (currentZoneId.toLowerCase() === 'a02') {
      return <ZoneModelViewer zoneId={currentZoneId} />;
    }
    // B01 존은 B01ModelViewer를 사용
    if (currentZoneId === 'b01') {
      return <B01ModelViewer />;
    }
    // 다른 존은 기본 ZoneModelViewer 사용
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
         <main className="flex items-start gap-[30px] relative w-full min-w-[1200px] p-6 pb-[30px] h-[calc(100vh-156px)]">
      {/* Zone 도면 영역 */}
      <section className="relative flex-1 max-w-[900px] h-full">
        <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">도면 영역</h1>
          <div className="w-full flex-1">
            {renderZoneDrawing()}
          </div>
        </div>
      </section>

{/* 실시간 센서 데이터 영역 */}
        <aside className="w-[60%] h-full">
                     <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col overflow-y-auto overflow-x-hidden">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">실시간 센서 데이터</h2>
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
        {/* <span className="text-sm text-gray-600">
          {connectionState === 'connected' && '연결됨'}
          {connectionState === 'connecting' && '연결중'}
          {connectionState === 'error' && '연결 오류'}
        </span>
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            {lastUpdated}
          </span>
        )} */}
      </div>
    </div>
    
                                       <div className="grid grid-cols-5 gap-[15px]">
                                  {/* 첫 번째 열 - 온도 */}
                  <div className="flex flex-col gap-4">
                    {[
                      { type: 'temperature', icon: '🌡️', name: '온도' }
                    ].map(({ type, icon, name }) => {
                      const sensors = sensorData[type];
                      
                      return (
                        <div key={type} className="w-full">
                          <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                            <span>{icon}</span>
                            {name}
                            {sensors && sensors.length > 0 && (
                              <span className="text-xs text-gray-400">({sensors.length}개)</span>
                            )}
                          </h4>
                          
                          {!sensors || sensors.length === 0 ? null : (
                            <div className="space-y-2">
                              {sensors.map((sensor, index) => (
                                <div key={`${sensor.sensor_id}-${index}`} className="w-full">
                                  <SensorDataCard 
                                    sensorData={sensor}
                                    zoneId={currentZoneId}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                                  {/* 두 번째 열 - 습도 */}
                  <div className="flex flex-col gap-4">
                    {[
                      { type: 'humidity', icon: '💧', name: '습도' }
                    ].map(({ type, icon, name }) => {
                      const sensors = sensorData[type];
                      
                      return (
                        <div key={type} className="w-full">
                          <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                            <span>{icon}</span>
                            {name}
                            {sensors && sensors.length > 0 && (
                              <span className="text-xs text-gray-400">({sensors.length}개)</span>
                            )}
                          </h4>
                          
                          {!sensors || sensors.length === 0 ? null : (
                            <div className="space-y-2">
                              {sensors.map((sensor, index) => (
                                <div key={`${sensor.sensor_id}-${index}`} className="w-full">
                                  <SensorDataCard 
                                    sensorData={sensor}
                                    zoneId={currentZoneId}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                                                                                                                                       {/* 세 번째 열 - 정전기 */}
                   <div className="flex flex-col gap-4">
                     {[
                       { type: 'esd', icon: '⚡', name: '정전기' }
                     ].map(({ type, icon, name }) => {
                       const sensors = sensorData[type];
                       
                       return (
                         <div key={type} className="w-full">
                           <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                             <span>{icon}</span>
                             {name}
                             {sensors && sensors.length > 0 && (
                               <span className="text-xs text-gray-400">({sensors.length}개)</span>
                             )}
                           </h4>
                           
                           {!sensors || sensors.length === 0 ? null : (
                             <div className="space-y-2">
                               {sensors.map((sensor, index) => (
                                 <div key={`${sensor.sensor_id}-${index}`} className="w-full">
                                   <SensorDataCard 
                                     sensorData={sensor}
                                     zoneId={currentZoneId}
                                   />
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                       );
                     })}
                   </div>

                                                                     {/* 네 번째 열 - 먼지 */}
                   <div className="flex flex-col gap-4">
                     {[
                       { type: 'particle', icon: '🌫️', name: '먼지' }
                     ].map(({ type, icon, name }) => {
                       const sensors = sensorData[type];
                       
                       return (
                         <div key={type} className="w-full">
                           <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                             <span>{icon}</span>
                             {name}
                             {sensors && sensors.length > 0 && (
                               <span className="text-xs text-gray-400">({sensors.length}개)</span>
                             )}
                           </h4>
                           
                           {!sensors || sensors.length === 0 ? null : (
                            <div className="space-y-2">
                              {sensors.map((sensor, index) => (
                                <div key={`${sensor.sensor_id}-${index}`} className="w-full">
                                  <SensorDataCard 
                                    sensorData={sensor}
                                    zoneId={currentZoneId}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                                                                     {/* 다섯 번째 열 - 풍향 */}
                   <div className="flex flex-col gap-4">
                     {[
                       { type: 'windDir', icon: '🌪️', name: '풍향' }
                     ].map(({ type, icon, name }) => {
                       const sensors = sensorData[type];
                       
                       return (
                         <div key={type} className="w-full">
                           <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                             <span>{icon}</span>
                             {name}
                             {sensors && sensors.length > 0 && (
                               <span className="text-xs text-gray-400">({sensors.length}개)</span>
                             )}
                           </h4>
                           
                           {!sensors || sensors.length === 0 ? null : (
                            <div className="space-y-2">
                              {sensors.map((sensor, index) => (
                                <div key={`${sensor.sensor_id}-${index}`} className="w-full">
                                  <SensorDataCard 
                                    sensorData={sensor}
                                    zoneId={currentZoneId}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
            </div>
        </div>
      </aside>
    </main>
  );
};

export default Zone;