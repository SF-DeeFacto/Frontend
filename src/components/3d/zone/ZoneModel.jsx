import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { BaseModel } from '../common/BaseModel';
import { getSensorTypeConfig, getStatusText } from '../../../config/sensorConfig';

function ZoneModel({ modelPath, zoneId, sensorData, selectedObject, onObjectClick }) {
  const groupRef = useRef();
  const { camera } = useThree();
  const [isModelReady, setIsModelReady] = useState(false);

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
      setIsModelReady(true);
    }
  };




  // 클릭 이벤트
  const handleClick = event => {
    console.log('클릭 이벤트 발생!', event);
    event.stopPropagation();
    
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    console.log('마우스 좌표:', mouse);
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjectsRef.current, false);
    
    console.log('클릭 가능한 객체들:', clickableObjectsRef.current);
    console.log('교차된 객체들:', intersects);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      console.log('클릭된 객체:', clickedObject);
      
      if (clickedObject.userData.clickable) {
        const worldPosition = new THREE.Vector3();
        clickedObject.getWorldPosition(worldPosition);

        if (onObjectClick) {
          // 실제 센서 데이터에서 상태 가져오기
          const actualStatus = getSensorStatusFromData(clickedObject.name);
          const sensorInfo = getSensorInfoFromData(clickedObject.name);
          
          onObjectClick({
            name: clickedObject.name,
            position: worldPosition,
            object: clickedObject,
            isSensor: true,
            status: actualStatus, // 실제 센서 상태 사용
            id: clickedObject.name,
            type: getSensorType(clickedObject.name),
            sensorData: sensorInfo // 센서 데이터 추가
          });
        }
      }
    }
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