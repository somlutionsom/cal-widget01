# 심플 캘린더 위젯

Notion 데이터베이스와 연동하여 사용할 수 있는 심플하고 깔끔한 캘린더 위젯입니다.

## 주요 기능

- 📅 **Notion DB 자동 연동**: 날짜 속성 기반으로 일정 자동 표시
- 🎨 **커스터마이즈 가능**: 색상 테마 설정 지원
- 📱 **반응형 디자인**: 데스크톱과 모바일 모두 지원
- 🔒 **보안**: API 키 암호화 저장
- ⚡ **빠른 성능**: 캐싱 및 최적화 적용
- ♿ **접근성**: WCAG 가이드라인 준수

## 빠른 시작

### 1. 사전 요구사항

- Node.js 18.0.0 이상
- npm 9.0.0 이상
- Notion 계정 및 Integration API 키

### 2. 설치

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 값 설정
```

### 3. Notion 설정

#### Notion Integration 생성

1. [Notion Developers](https://www.notion.so/my-integrations)에 접속
2. "New Integration" 클릭
3. 이름 설정 및 워크스페이스 선택
4. Capabilities에서 필요한 권한 설정:
   - Read content
   - Read user information
5. "Submit" 클릭 후 API 키 복사

#### Database 연결

1. Notion에서 사용할 데이터베이스 열기
2. 오른쪽 상단 "..." → "Connections" → Integration 선택
3. 데이터베이스 URL에서 ID 복사

**필수 속성:**
- 날짜 (Date 타입)
- 제목 (Title 타입)
- 일정1~5 (Text 타입)
- 중요 (Select 또는 Checkbox 타입)

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속

### 5. 프로덕션 빌드

```bash
npm run build
npm start
```

## 사용 방법

### 위젯 설정

1. `/onboarding` 페이지 접속
2. Step 1: Notion API 키와 Database ID 입력
3. Step 2: 데이터베이스 속성명 매핑
4. Step 3: 색상 테마 설정
5. 생성된 임베드 URL 복사

### 위젯 임베드

#### iframe으로 임베드

```html
<iframe 
  src="https://your-domain.com/u/YOUR_CONFIG_ID" 
  width="100%" 
  height="600" 
  frameborder="0">
</iframe>
```

#### Notion 페이지에 임베드

1. Notion 페이지에서 `/embed` 입력
2. 위젯 URL 붙여넣기
3. 크기 조절

## API 엔드포인트

### POST `/api/setup`
위젯 설정을 생성하고 저장합니다.

### GET `/api/events/[configId]`
캘린더 이벤트를 조회합니다.

**쿼리 파라미터:**
- `startDate`: YYYY-MM-DD 형식
- `endDate`: YYYY-MM-DD 형식

### POST `/api/preview`
설정 미리보기를 생성합니다.

## 보안 고려사항

### API 키 보호

- ✅ API 키는 서버에서만 사용되며 클라이언트에 노출되지 않음
- ✅ 모든 설정 데이터는 AES-256-GCM으로 암호화되어 저장
- ✅ HTTPS를 통한 안전한 통신 필수

### 환경변수 설정

**필수 환경변수:**
```env
# 32자 이상의 강력한 암호화 키 사용
ENCRYPTION_KEY=your-very-strong-32-character-key!!

# 프로덕션 환경에서 필수
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 성능 최적화

### 캐싱 전략

- 이벤트 데이터: 60초 캐시 (Cache-Control)
- Stale-while-revalidate로 사용자 경험 개선

## 접근성

### WCAG 2.1 준수

- ✅ 키보드 네비게이션 지원
- ✅ 스크린 리더 호환 (ARIA 레이블)
- ✅ 고대비 모드 지원
- ✅ 최소 44px 터치 타겟
- ✅ 명확한 포커스 표시

## 문제 해결

### 일반적인 문제

#### "Database not found" 오류
- Database ID가 올바른지 확인
- Integration이 데이터베이스에 연결되어 있는지 확인

#### "Invalid API key" 오류
- API 키가 정확한지 확인
- Integration이 활성화되어 있는지 확인

#### 일정이 표시되지 않음
- 날짜 속성명이 정확한지 확인
- 날짜 형식이 올바른지 확인 (Date 타입)

## 배포

### Vercel 배포

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/simple-calendar-widget)

### 수동 배포

```bash
# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 라이선스

MIT

## 크레딧

- Next.js 15+ 기반
- Notion API 활용
- TypeScript로 작성
