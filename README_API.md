# API 연동 가이드

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## 주요 변경 사항

### 1. 인증 (Auth)
- **회원가입**: `POST /auth/signup` - username, password, name만 필요
- **로그인**: `POST /auth/login` - username, password 사용 (학번 아님)
- **학생 인증**: `POST /auth/verify-student` - 로그인 후 별도로 호출

### 2. 필기 목록
- **전체 목록**: `GET /notes?sort=latest`
- **Trending**: `GET /notes?sort=likes`
- **카테고리별**: `GET /notes?category=학과명`

### 3. 필기 상세
- **상세 조회**: `GET /notes/{noteId}`
- **좋아요/싫어요**: `POST /notes/{noteId}/interaction`

### 4. 추천
- **For You**: `GET /notes/for-you` (로그인 필요)

### 5. 업로드
- **메타데이터 저장**: `POST /notes` - presignedUrl 반환
- **파일 업로드**: presignedUrl로 S3에 직접 PUT 요청

## OpenAPI 스펙에 없는 기능

다음 기능들은 현재 OpenAPI 스펙에 없어 `mockApi.js`를 계속 사용 중입니다:
- `fetchUploadMetadata`: 학과/과목 목록 (프론트에서 하드코딩 또는 별도 API 필요)
- `fetchUserLibrary`: 내 필기/좋아요/북마크/다운로드 목록 (별도 API 필요)
- `generateNoteSummary`: AI 요약 생성 (백엔드에서 자동 처리 예정)

## CORS 오류 발생 시

CORS 오류가 발생하면 프론트엔드에서 해결하지 말고, 백엔드에서 CORS 설정을 확인해주세요.

