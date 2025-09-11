import React from 'react';
import { COLORS } from '../../../config/constants';

// 기본 조명 설정
export const BasicLighting = ({ intensity = 1 }) => (
  <>
    <ambientLight intensity={0.6 * intensity} />
    <directionalLight 
      position={[5, 10, 5]} 
      intensity={0.8 * intensity}
      castShadow={false}
    />
  </>
);

// 부드러운 조명 설정 (호버 오버레이용)
export const SoftLighting = ({ intensity = 1 }) => (
  <>
    <ambientLight intensity={0.6 * intensity} />
    <directionalLight 
      position={[5, 10, 5]} 
      intensity={0.8 * intensity}
      castShadow={false}
    />
    <pointLight position={[-5, 5, -5]} intensity={0.15 * intensity} color={COLORS.PRIMARY} />
    <pointLight position={[5, -5, 5]} intensity={0.1 * intensity} color={COLORS.INFO} />
  </>
);

// 강화된 조명 설정 (메인 모델용)
export const EnhancedLighting = ({ intensity = 1 }) => (
  <>
    <ambientLight intensity={0.6 * intensity} />
    <directionalLight 
      position={[5, 5, 5]} 
      intensity={1.2 * intensity}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
  </>
);
