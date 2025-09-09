import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { BaseModel } from '../common/BaseModel';

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
      // 카메라 설정 - 모델을 더 작게 보이게 하기
      camera.position.set(10, 10, 19);
      camera.lookAt(0, 0, 0);
    }
  };




  // 클릭 이벤트 (BaseModel의 SensorRenderer에서 처리)
  const handleClick = event => {
    event.stopPropagation();
    // 센서 클릭은 BaseModel의 SensorRenderer에서 handleSensorClick으로 처리됨
  };


  return (
    <group ref={groupRef}>
      <BaseModel
        modelPath={modelPath}
        onLoad={handleModelLoad}
        sensorData={sensorData}
        zoneId={zoneId}
        onSensorClick={handleSensorClick}
        lighting="basic"
        scale={[0.002, 0.002, 0.002]}
        onPointerDown={handleClick}
      />
    </group>
  );
}

export default ZoneModel;