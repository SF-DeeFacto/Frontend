# 통합 로딩 시스템

공용 로딩 시스템입니다. 다양한 상황에 맞는 로딩 컴포넌트와 훅을 제공합니다.

## 🚀 새로운 통합 시스템

### 1. LoadingSpinner (기본 스피너)
```jsx
import { LoadingSpinner } from '../ui';

// 기본 사용
<LoadingSpinner />
<LoadingSpinner text="로딩 중..." />
<LoadingSpinner size="lg" variant="primary" />
```

### 2. 통합 로딩 컴포넌트들
```jsx
import { 
  Loading, 
  SectionLoading, 
  PageLoading, 
  ButtonLoading, 
  InlineLoading, 
  SmartLoading 
} from '../ui';
```

## 📋 사용법

### 페이지 로딩 (인증 등 특별한 경우에만 사용)
```jsx
import { PageLoading } from '../ui';

// ❌ 일반적인 데이터 로딩에는 사용하지 않음
// ✅ 인증, 초기 로딩 등 특별한 경우에만 사용
const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  
  return (
    <PageLoading 
      loading={loading}
      loadingText="인증을 확인하는 중..."
      fullScreen={true}
    >
      <PageContent />
    </PageLoading>
  );
};
```

### 섹션 로딩
```jsx
import { SectionLoading } from '../ui';

const DataSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  
  return (
    <SectionLoading 
      loading={loading}
      loadingText="데이터를 불러오는 중..."
      error={error}
      errorText="오류가 발생했습니다."
      empty={data.length === 0}
      emptyText="데이터가 없습니다."
      showHeader={false}
    >
      <DataTable data={data} />
    </SectionLoading>
  );
};
```

### 버튼 로딩
```jsx
import { ButtonLoading } from '../ui';

const SaveButton = () => {
  const [loading, setLoading] = useState(false);
  
  return (
    <ButtonLoading
      loading={loading}
      loadingText="저장 중..."
      onClick={handleSave}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      저장
    </ButtonLoading>
  );
};
```

### 인라인 로딩
```jsx
import { InlineLoading } from '../ui';

const Header = () => {
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="flex items-center gap-2">
      <span>날씨</span>
      <InlineLoading 
        loading={loading} 
        loadingText="날씨 정보를 불러오는 중..." 
      />
    </div>
  );
};
```

### 스마트 로딩
```jsx
import { SmartLoading } from '../ui';

const DataComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [empty, setEmpty] = useState(false);
  
  return (
    <SmartLoading
      loading={loading}
      error={error}
      empty={empty}
      loadingText="데이터를 불러오는 중..."
      errorText="오류가 발생했습니다."
      emptyText="데이터가 없습니다."
    >
      <DataContent />
    </SmartLoading>
  );
};
```

## 🔧 통합 로딩 훅

### useUnifiedLoading (권장)
```jsx
import { useUnifiedLoading } from '../hooks';

const MyComponent = () => {
  const { 
    loading, 
    loadingText, 
    error, 
    withLoading, 
    withSave, 
    withUpdate, 
    withDelete 
  } = useUnifiedLoading({
    componentName: 'MyComponent' // 자동 텍스트 감지
  });
  
  const handleSave = async () => {
    await withSave(async () => {
      await saveData();
    });
  };
  
  return (
    <SectionLoading loading={loading} loadingText={loadingText}>
      <Content />
    </SectionLoading>
  );
};
```

### useSimpleLoading
```jsx
import { useSimpleLoading } from '../hooks';

const SimpleComponent = () => {
  const { loading, startLoading, stopLoading } = useSimpleLoading();
  
  return (
    <div>
      {loading && <LoadingSpinner />}
      <button onClick={startLoading}>로딩 시작</button>
    </div>
  );
};
```

### useButtonLoading
```jsx
import { useButtonLoading } from '../hooks';

const MultiButtonComponent = () => {
  const { isButtonLoading, withButtonLoading } = useButtonLoading();
  
  const handleSave = async () => {
    await withButtonLoading('save', async () => {
      await saveData();
    });
  };
  
  return (
    <div>
      <button disabled={isButtonLoading('save')}>
        {isButtonLoading('save') ? '저장 중...' : '저장'}
      </button>
    </div>
  );
};
```

## 📊 컴포넌트 비교

| 컴포넌트 | 용도 | 특징 |
|---------|------|------|
| `LoadingSpinner` | 기본 스피너 | 가장 기본적인 로딩 표시 |
| `Loading` | 간단한 로딩 | 조건부 렌더링 |
| `SectionLoading` | 섹션별 로딩 | 에러/빈 상태 포함, 카드 스타일 |
| `PageLoading` | 페이지 로딩 | 전체 화면 또는 영역 로딩 |
| `ButtonLoading` | 버튼 로딩 | 버튼 내부 로딩 상태 |
| `InlineLoading` | 인라인 로딩 | 텍스트와 함께 표시 |
| `SmartLoading` | 스마트 로딩 | 자동 상태 감지 |

## 🎯 마이그레이션 가이드

### 기존 코드
```jsx
// ❌ 기존 방식
import LoadingSpinner from '../ui/LoadingSpinner';
import { LoadingWrapper } from '../ui';
import { useSmartLoading } from '../hooks';

const { loading, loadingText } = useSmartLoading();
<LoadingWrapper loading={loading}>
  <Content />
</LoadingWrapper>
```

### 새로운 코드
```jsx
// ✅ 새로운 방식
import { SectionLoading, useUnifiedLoading } from '../ui';

const { loading, loadingText } = useUnifiedLoading();
<SectionLoading loading={loading} loadingText={loadingText}>
  <Content />
</SectionLoading>
```

## 🚀 장점

1. **일관성**: 모든 로딩이 동일한 패턴
2. **재사용성**: 6가지 컴포넌트로 모든 상황 커버
3. **자동화**: 자동 텍스트 감지 및 상태 관리
4. **유지보수성**: 중앙 집중식 관리
5. **성능**: 불필요한 전체 페이지 로딩 방지