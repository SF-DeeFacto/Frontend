import React, { useMemo, useState } from 'react';
import ZoneModelViewer from './ZoneModelViewer';
import SensorInfoPanel from '../../common/SensorInfoPanel';
import LoadingSpinner from '../../common/LoadingSpinner';

const ZoneDrawingSection = ({ 
  zoneId, 
  sensorData, 
  selectedObject, 
  onObjectClick, 
  onCloseSensorInfo 
}) => {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);
  
  const handleLoadingChange = (loading) => {
    setIsModelLoading(loading);
  };
  
  const handleErrorChange = (error) => {
    setModelError(error);
  };
  
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
        
        {isModelLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
            <LoadingSpinner />
          </div>
        )}
        
        {modelError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
            <div className="text-center">
              <div className="text-red-500 text-lg font-semibold mb-2">모델 로딩 실패</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">{modelError.message}</div>
            </div>
          </div>
        )}
        
        <ZoneModelViewer 
          key={zoneId} // zoneId가 변경될 때마다 컴포넌트 재마운트
          zoneId={zoneId} 
          sensorData={sensorData}
          selectedObject={selectedObject}
          onObjectClick={onObjectClick}
          onLoadingChange={handleLoadingChange}
          onErrorChange={handleErrorChange}
        />
      </div>
    );
  }, [zoneId, sensorData, selectedObject, onObjectClick, onCloseSensorInfo, isModelLoading, modelError]);

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
