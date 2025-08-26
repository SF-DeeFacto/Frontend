# 3D 유틸리티 (레거시)

⚠️ **주의**: 이 디렉토리는 레거시입니다. 새로운 프로젝트에서는 `src/config/`를 사용하세요.

## 통합된 설정 위치
색상 관련 설정은 모두 `src/config/sensorConfig.js`로 통합되었습니다.

## 구조

```
src/components/utils/
├── sensorHelpers.js       # 3D 센서 관련 유틸리티 (유지)
├── index.js               # 색상 함수들을 config에서 re-export
└── README.md              # 이 파일
```

## 권장 사용법

### 색상 관련 함수 (통합된 설정 사용)
```javascript
// 권장: config에서 직접 import
import { getStatus3DColor, getStatusColor } from '../../config/sensorConfig';

// 또는: utils에서 re-export된 함수 사용
import { getStatus3DColor, getStatusColor } from '../utils';
```

### 3D 헬퍼 함수들
```javascript
import { calculateMeshBounds, findAndCalculateSensorPositions } from '../utils/sensorHelpers';
```

## 유틸리티 설명

### sensorHelpers.js (유지)
3D 센서 관련 헬퍼 함수들
- `calculateMeshBounds(mesh)`: 메쉬 AABB 계산
- `calculateIndicatorPosition(bounds)`: 센서 인디케이터 위치 계산
- `generateSensorIds()`: S01~S55 센서 ID 생성
- `findAndCalculateSensorPositions(scene, zoneId)`: GLB 모델에서 센서 위치 계산
- `findSensorDataByMeshName(meshName, sensorData)`: 센서 데이터 검색
- `calculateModelBounds(scene)`: 모델 전체 크기 및 중심점 계산

## 장점

1. **접근성**: 모든 컴포넌트에서 쉽게 사용 가능
2. **재사용성**: 3D가 아닌 다른 컴포넌트에서도 활용
3. **일관성**: 동일한 로직을 모든 곳에서 사용
4. **유지보수성**: 중앙에서 관리하여 수정 시 한 곳만 변경
