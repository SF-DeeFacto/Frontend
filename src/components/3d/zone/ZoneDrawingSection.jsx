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
          onObjectClick={onObjectClick} 
        />
      </div>
    );
  }, [zoneId, sensorData, selectedObject, onObjectClick, onCloseSensorInfo]);

  return (
    <section className="relative flex-1 max-w-[50%] h-full">
      <div className="modern-card p-6 h-full flex flex-col">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-neutral-100 mb-4 transition-colors duration-300">도면 영역</h1>
        <div className="w-full flex-1">
          {renderZoneDrawing}
        </div>
      </div>
    </section>
  );
};

export default ZoneDrawingSection;
