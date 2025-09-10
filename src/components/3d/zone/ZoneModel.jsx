import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { BaseModel } from '../common/BaseModel';
import { getZoneModelConfig } from '../../../config/modelConfig';

function ZoneModel({ modelPath, zoneId, sensorData, selectedObject, onObjectClick }) {
  const groupRef = useRef();
  const { camera } = useThree();

  // 센서 클릭 핸들러
  const handleSensorClick = (sensorInfo) => {
    if (onObjectClick) {
      onObjectClick({
        type: 'sensor',
        ...sensorInfo
      });
    }
  };

  // 모델 로딩 완료 후 처리
  const handleModelLoad = (loadedGltf) => {
    if (loadedGltf.scene) {
      // 존별 카메라 설정 가져오기
      const modelConfig = getZoneModelConfig(zoneId);
      const { position, lookAt } = modelConfig.camera;
      
      camera.position.set(...position);
      camera.lookAt(...lookAt);
    }
  };




  // 클릭 이벤트 (BaseModel의 SensorRenderer에서 처리)
  const handleClick = event => {
    event.stopPropagation();
    // 센서 클릭은 BaseModel의 SensorRenderer에서 handleSensorClick으로 처리됨
  };


  // 존별 모델 설정 가져오기
  const modelConfig = getZoneModelConfig(zoneId);

  return (
    <group ref={groupRef}>
      <BaseModel
        modelPath={modelPath}
        onLoad={handleModelLoad}
        sensorData={sensorData}
        zoneId={zoneId}
        onSensorClick={handleSensorClick}
        lighting="basic"
        scale={modelConfig.scale}
        position={modelConfig.position}
        rotation={modelConfig.rotation}
        onPointerDown={handleClick}
      />
    </group>
  );
}

export default ZoneModel;