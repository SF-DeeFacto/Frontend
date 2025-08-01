import React from 'react';
// import { Canvas } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
// import ThreeElement from '../../ThreeElement.jsx';
// import WarningLight from '../../components/WarningLight.jsx';


const ZoneA = () => {

  return (
    <div style={{ 
      display: 'flex',
      width: '870px',
      height: '496px',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f0f8ff',
      border: '2px solid #4a90e2',
      borderRadius: '8px',
      padding: '16px',
      position: 'relative'
    }}>
{/* 
      
      <Canvas
        camera={{ position: [15, 10, 15], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ThreeElement />
        <OrbitControls />
      </Canvas> */}
      
      {/* 경고등 */}
      {/* <WarningLight 
        position={{ x: 435, y: 248 }}
        isActive={true}
        targetPosition={{ x: 435, y: 248 }}
      />
       */}

    </div>
  );
};

export default ZoneA; 