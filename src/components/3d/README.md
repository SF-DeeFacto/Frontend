# 3D 컴포넌트 구조

이 디렉토리는 3D 모델 뷰어와 관련된 컴포넌트들을 포함합니다.

## 컴포넌트 구조

```
src/components/3d/
├── ZoneModelViewer.jsx     # 전체 뷰어 (Canvas, OrbitControls 등)
├── ZoneModel.jsx           # GLB 모델 로드 + 센서 배치
├── SensorIndicator.jsx     # 센서 표시 컴포넌트
├── ModelViewer.jsx         # 기존 모델 뷰어
├── SimpleModel.jsx         # 간단한 모델 뷰어
├── index.js                # 컴포넌트 export
└── README.md               # 사용법 및 구조 설명

src/components/utils/        # 🆕 공용 유틸리티 (루트 레벨)
├── colors.js              # 센서 상태별 색상 정의
├── sensorHelpers.js       # 센서 Mesh 탐색 및 좌표 계산
└── index.js               # 유틸리티 export
```

## 주요 컴포넌트 설명

### 1. ZoneModelViewer.jsx
- **역할**: 전체 3D 뷰어의 메인 컴포넌트
- **기능**: 
  - Canvas 설정 (camera, light, controls 등)
  - ZoneModel 불러오기
  - 센서 데이터 상태(sensorData) 관리
- **Props**:
  - `zoneId`: Zone ID (예: 'B01', 'A02' 등)
  - `sensorData`: 센서 데이터 객체
  - `onObjectClick`: 객체 클릭 이벤트 핸들러

### 2. ZoneModel.jsx
- **역할**: GLB 모델 로딩 및 센서 배치
- **기능**:
  - GLB 모델 로딩
  - 센서 55개 자동 생성 & GLB 내 위치 매핑
  - 각 센서마다 SensorIndicator 렌더링
- **Props**:
  - `zoneId`: Zone ID
  - `sensorData`: 센서 데이터
  - `onObjectClick`: 클릭 이벤트 핸들러

### 3. SensorIndicator.jsx
- **역할**: 개별 센서 표시 컴포넌트
- **기능**:
  - 작은 원/아이콘 mesh 표시
  - 색상(status) 반영
  - hover tooltip (센서 이름/타입)
  - onClick 이벤트
- **Props**:
  - `position`: 3D 위치 좌표
  - `status`: 센서 상태 ('GREEN', 'YELLOW', 'RED')
  - `onClick`: 클릭 이벤트 핸들러
  - `sensorName`: 센서 이름
  - `sensorType`: 센서 타입
  - `size`: 인디케이터 크기

## 유틸리티 설명

### 1. colors.js
- **SENSOR_STATUS_COLORS**: 센서 상태별 색상 상수
- **getStatusColor(status)**: 상태 문자열을 색상 코드로 변환
- **getStatusDescription(status)**: 상태별 한글 설명 반환

### 2. sensorHelpers.js
- **calculateMeshBounds(mesh)**: 메쉬의 AABB 정보 계산
- **calculateIndicatorPosition(bounds)**: 센서 인디케이터 위치 계산
- **generateSensorIds()**: S01~S55 센서 ID 배열 생성
- **findAndCalculateSensorPositions(scene, zoneId)**: GLB 모델에서 센서 위치 계산
- **findSensorDataByMeshName(meshName, sensorData)**: 센서 데이터 검색
- **calculateModelBounds(scene)**: 모델 전체 크기 및 중심점 계산

## 사용 예시

```jsx
import { ZoneModelViewer } from '@/components/3d';

function ZonePage() {
  const [sensorData, setSensorData] = useState({});
  
  const handleObjectClick = (objectInfo) => {
    console.log('클릭된 객체:', objectInfo);
  };

  return (
    <ZoneModelViewer
      zoneId="B01"
      sensorData={sensorData}
      onObjectClick={handleObjectClick}
    />
  );
}
```

## 센서 데이터 형식

센서 데이터는 다음과 같은 형식으로 전달되어야 합니다:

```javascript
const sensorData = {
  particle: [
    {
      sensor_id: 'S01',
      sensor_type: 'particle',
      status: 'GREEN',
      val_0_1: 10,
      val_0_3: 5,
      val_0_5: 2,
      timestamp: '2024-01-01T00:00:00Z'
    }
  ],
  temperature: [
    {
      sensor_id: 'S02',
      sensor_type: 'temperature',
      status: 'YELLOW',
      val: 25.5,
      timestamp: '2024-01-01T00:00:00Z'
    }
  ]
};
```

## 센서 상태 색상

- **GREEN**: 정상 상태 (0x10b981)
- **YELLOW**: 경고 상태 (0xf59e0b)
- **RED**: 오류 상태 (0xef4444)
- **DEFAULT**: 알 수 없는 상태 (0x6b7280)

## 개선된 구조의 장점

### 1. **일관성 향상**
- 공용 색상 유틸리티로 모든 컴포넌트에서 동일한 색상 사용
- 센서 상태 처리 로직 통일

### 2. **재사용성 증대**
- 센서 헬퍼 함수들을 다른 컴포넌트에서도 활용 가능
- 색상 및 상태 관련 로직 재사용

### 3. **유지보수성 향상**
- 센서 관련 로직을 utils로 분리하여 중앙 관리
- 각 컴포넌트의 책임 명확화

### 4. **테스트 용이성**
- 유틸리티 함수들을 독립적으로 테스트 가능
- 컴포넌트 로직과 비즈니스 로직 분리

### 5. **단순한 구조**
- 불필요한 index.js 파일 제거로 구조 단순화
- 직접 import로 명확한 의존성 파악

## 유지보수 가이드

1. **새로운 Zone 추가**: ZoneModel.jsx의 모델 로딩 경로만 수정
2. **센서 타입 추가**: SensorIndicator.jsx의 상태 처리 로직 수정
3. **색상 변경**: utils/colors.js에서 중앙 관리
4. **센서 로직 수정**: utils/sensorHelpers.js에서 관리
5. **UI 변경**: 각 컴포넌트별로 독립적으로 수정 가능
6. **성능 최적화**: 각 컴포넌트의 useEffect 의존성 배열 최적화
