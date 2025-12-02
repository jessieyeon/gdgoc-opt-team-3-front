# API 연동 설정 가이드

## 1. 환경 변수 설정 완료 ✅

`.env` 파일이 생성되었습니다:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## 2. 현재 상태

### 실제 API 사용 중인 기능
- ✅ **회원가입** (`RegisterPage`) - `POST /auth/signup`
- ✅ **필기 목록 조회** (`NotesPage`) - `GET /notes`
- ✅ **필기 상세 조회** (`NoteViewer`) - `GET /notes/{noteId}`
- ✅ **좋아요/싫어요** (`NoteViewer`) - `POST /notes/{noteId}/interaction`
- ✅ **Trending Notes** (`HomePage`) - `GET /notes?sort=likes`
- ✅ **For You** (`HomePage`) - `GET /notes/for-you`
- ✅ **Top Contributors** (`HomePage`) - `GET /users/top-contributors`
- ✅ **필기 업로드** (`UploadForm`) - `POST /notes` + S3 업로드

### Mock API 사용 중인 기능
- 🔄 **로그인** (`LoginPage`) - 현재 `mockApi` 사용 중
- 🔄 **학과/과목 목록** (`UploadForm`) - `fetchUploadMetadata`
- 🔄 **AI 요약 생성** (`UploadForm`) - `generateNoteSummary`
- 🔄 **마이페이지 라이브러리** (`MyPageTabs`) - `fetchUserLibrary`

## 3. 실제 API로 전환하기

### 로그인 페이지 전환
`LoginPage.jsx`를 실제 API로 전환하려면:

```javascript
// 변경 전
import { loginWithRunUs } from '@/services/mockApi'
loginWithRunUs({ studentId, password })

// 변경 후
import { login } from '@/services/api'
import { useAuth } from '@/context/AuthContext.jsx'

const { setUser, setToken } = useAuth()
login({ username, password })
  .then((response) => {
    setUser(response.user)
    setToken(response.token)
  })
```

**주의**: OpenAPI 스펙에 따르면 로그인은 `username`과 `password`를 사용합니다. 
현재 UI는 `studentId`를 사용하고 있으므로, 백엔드 API 스펙에 맞게 수정이 필요합니다.

## 4. 백엔드 서버 실행

1. 백엔드 서버를 `http://localhost:8080`에서 실행
2. CORS 설정 확인 (프론트엔드 도메인 허용)
3. API 엔드포인트 테스트

## 5. 테스트 방법

### 개발 서버 실행
```bash
npm run dev
```

### API 테스트 순서
1. 회원가입 (`/register`) - 실제 API 사용 중
2. 로그인 (`/login`) - 현재 mockApi 사용 중
3. 필기 목록 조회 (`/notes`) - 실제 API 사용 중
4. 필기 상세 보기 (`/notes/:id`) - 실제 API 사용 중
5. 필기 업로드 (`/upload`) - 실제 API 사용 중

## 6. CORS 오류 발생 시

CORS 오류가 발생하면:
- ❌ 프론트엔드에서 해결하지 마세요
- ✅ 백엔드에서 CORS 설정을 확인하세요
- 백엔드에서 `http://localhost:5173` (Vite 기본 포트) 허용 필요

## 7. 환경 변수 변경

다른 서버를 사용하려면 `.env` 파일을 수정하세요:
```env
VITE_API_BASE_URL=https://api.example.com/api/v1
```

변경 후 개발 서버를 재시작하세요.



