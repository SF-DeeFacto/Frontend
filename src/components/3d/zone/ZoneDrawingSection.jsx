import React, { useMemo } from 'react';
import ZoneModelViewer from './ZoneModelViewer';
import SensorInfoPanel from '../../common/SensorInfoPanel';

const ZoneDrawingSection = ({ 
  zoneId, 
  sensorData, 
  selectedObject, 
  onObjectClick, 
  onCloseSensorInfo 
}) => {
  /**
   * Zone 도면 영역을 렌더링하는 함수
   */
  const renderZoneDrawing = useMemo(() => {
    return (
      <div className="relative w-full h-full">
        <SensorInfoPanel 
          selectedObject={selectedObject}
          onClose={onCloseSensorInfo}
        />
        
        <ZoneModelViewer 
          key={zoneId} // zoneId가 변경될 때마다 컴포넌트 재마운트
          zoneId={zoneId} 
          sensorData={sensorData}
          selectedObject={selectedObject}
          onObjectClick={onObjectClick} 
        />
      </div>
    );
  }, [zoneId, sensorData, selectedObject, onObjectClick, onCloseSensorInfo]);

  return (
    <section className="relative flex-1 max-w-[900px] h-full">
      <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">도면 영역</h1>
        <div className="w-full flex-1">
          {renderZoneDrawing}
        </div>
      </div>
    </section>
  );
};

export default ZoneDrawingSection;
