# 공용 유틸리티

이 디렉토리는 모든 컴포넌트에서 공통으로 사용할 수 있는 유틸리티 함수들을 포함합니다.

## 구조

```
src/components/utils/
├── colors.js              # 색상 관련 유틸리티
├── sensorHelpers.js       # 센서 관련 유틸리티
├── index.js               # 모든 유틸리티 export
└── README.md              # 이 파일
```

## 사용법

### 1. 개별 import (권장)
```javascript
import { getStatusColor } from '@/components/utils/colors';
import { calculateMeshBounds } from '@/components/utils/sensorHelpers';
```

### 2. 전체 utils import
```javascript
import { getStatusColor, calculateMeshBounds } from '@/components/utils';
```

### 3. 3D 컴포넌트에서 사용
```javascript
import { getStatusColor } from '../utils/colors';
import { calculateMeshBounds } from '../utils/sensorHelpers';
```

## 유틸리티 설명

### colors.js
센서 상태별 색상 정의 및 변환 함수
- `SENSOR_STATUS_COLORS`: 색상 상수
- `getStatusColor(status)`: 상태를 색상 코드로 변환
- `getStatusDescription(status)`: 상태를 한글 설명으로 변환

### sensorHelpers.js
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
