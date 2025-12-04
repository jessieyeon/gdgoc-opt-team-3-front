/**
 * API 호출 로직
 * OpenAPI 3.0 스펙에 따라 작성됨
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

/**
 * API 요청 기본 함수
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getStoredToken()

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(errorData.message || `API 요청 실패: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error.message.includes('CORS')) {
      throw new Error('CORS 오류가 발생했습니다. 백엔드에서 CORS 설정을 확인해주세요.')
    }
    throw error
  }
}

/**
 * 토큰 관리 (localStorage)
 */
const TOKEN_KEY = 'yonsei-notes-token'

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch (error) {
    console.error('Failed to save token to localStorage:', error)
  }
}

// ==========================================
// [Auth] 회원가입 및 로그인
// ==========================================

/**
 * 회원가입
 * POST /auth/signup
 */
/**
 * 회원가입
 * POST /auth/signup
 */
export async function signup({ email, password, username, code }) {
  if (!email || !password || !username || !code) {
    throw new Error('모든 정보를 입력해주세요.')
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@yonsei\.ac\.kr$/
  if (!emailRegex.test(email)) {
    throw new Error('연세대학교 이메일(@yonsei.ac.kr)을 입력해주세요.')
  }

  // 백엔드 API 스펙에 맞게 전송
  // SignupRequest: email, password, username, code
  const response = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      username, // 표시용 아이디
      code,
    }),
  })

  return response
}

/**
 * 이메일 인증 코드 발송
 * POST /auth/email-code
 */
export async function sendEmailCode(email) {
  if (!email) {
    throw new Error('이메일을 입력해주세요.')
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@yonsei\.ac\.kr$/
  if (!emailRegex.test(email)) {
    throw new Error('연세대학교 이메일(@yonsei.ac.kr)을 입력해주세요.')
  }

  const response = await apiRequest('/auth/email-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })

  return response
}

/**
 * 로그인
 * POST /auth/login
 */
export async function login({ email, password }) {
  if (!email || !password) {
    throw new Error('이메일과 비밀번호를 입력해주세요.')
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@yonsei\.ac\.kr$/
  if (!emailRegex.test(email)) {
    throw new Error('연세대학교 이메일(@yonsei.ac.kr)을 입력해주세요.')
  }

  // 백엔드 API 스펙에 맞게 전송 (이메일을 username 필드에 넣기)
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  // 토큰 저장
  if (response.token) {
    setStoredToken(response.token)
  }

  return response
}

/**
 * 연세대 학생 인증 (현재 사용 안 함)
 * POST /auth/verify-student
 * 
 * 이메일 인증으로 변경되었으나, 우선 사용하지 않음
 * 필요시 이메일 인증 API로 업데이트 필요
 */
// export async function verifyStudent({ studentId, portalPassword }) {
//   if (!studentId || !portalPassword) {
//     throw new Error('학번과 포털 비밀번호를 입력해주세요.')
//   }
//
//   const response = await apiRequest('/auth/verify-student', {
//     method: 'POST',
//     body: JSON.stringify({ studentId, portalPassword }),
//   })
//
//   return response
// }

// ==========================================
// [Notes] 필기 목록 조회
// ==========================================

/**
 * 필기 목록 조회
 * GET /notes?sort=latest&category=학과명
 */
export async function fetchNotes({ sort = 'latest', category } = {}) {
  const params = new URLSearchParams()
  if (sort) params.append('sort', sort)
  if (category) params.append('category', category)

  const queryString = params.toString()
  const endpoint = `/notes${queryString ? `?${queryString}` : ''}`

  const response = await apiRequest(endpoint, {
    method: 'GET',
  })

  return response
}

/**
 * 필기 상세 정보 조회
 * GET /notes/{noteId}
 */
export async function fetchNoteDetail(noteId) {
  if (!noteId) {
    throw new Error('필기 ID가 필요합니다.')
  }

  const response = await apiRequest(`/notes/${noteId}`, {
    method: 'GET',
  })

  return response
}

/**
 * 필기 좋아요/싫어요
 * POST /notes/{noteId}/interaction
 */
export async function interactWithNote(noteId, type) {
  if (!noteId || !type) {
    throw new Error('필기 ID와 인터랙션 타입이 필요합니다.')
  }

  if (!['like', 'dislike'].includes(type)) {
    throw new Error('인터랙션 타입은 like 또는 dislike여야 합니다.')
  }

  const response = await apiRequest(`/notes/${noteId}/interaction`, {
    method: 'POST',
    body: JSON.stringify({ type }),
  })

  return response
}

// ==========================================
// [Notes] 필기 업로드
// ==========================================

/**
 * 필기 정보 등록 및 업로드 URL 발급
 * POST /notes
 */
export async function createNoteMetadata({
  fileName,
  fileType,
  semester,
  major,
  subject,
  professor,
  description,
}) {
  if (!fileName || !fileType || !semester || !major || !subject) {
    throw new Error('필수 정보를 모두 입력해주세요.')
  }

  const payload = {
    fileName,
    fileType,
    semester,
    major,
    subject,
    ...(professor && { professor }),
    ...(description && { description }),
  }

  return response
}

/**
 * AI 요약 업데이트 (임시 - 백엔드 미구현)
 * POST /notes/{noteId}/ai-summary
 */
export async function updateNoteAiSummary(noteId, aiSummary) {
  console.log('Mock updateNoteAiSummary called:', { noteId, aiSummary })
  // 백엔드 구현 전까지 성공으로 처리
  return { success: true }
}

/**
 * S3에 파일 업로드 (Presigned URL 사용)
 */
export async function uploadFileToS3(presignedUrl, file) {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!response.ok) {
      throw new Error(`S3 업로드 실패: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    throw new Error(`파일 업로드 중 오류가 발생했습니다: ${error.message}`)
  }
}

// ==========================================
// [Recommendation] For You
// ==========================================

/**
 * For You (맞춤 추천)
 * GET /notes/for-you
 */
export async function fetchForYouNotes() {
  const response = await apiRequest('/notes/for-you', {
    method: 'GET',
  })

  return response
}

// ==========================================
// [Users] 유저 관련
// ==========================================

/**
 * 특정 업로더의 다른 필기 보기
 * GET /users/{userId}/notes
 */
export async function fetchUserNotes(userId) {
  if (!userId) {
    throw new Error('유저 ID가 필요합니다.')
  }

  const response = await apiRequest(`/users/${userId}/notes`, {
    method: 'GET',
  })

  return response
}

/**
 * Top Contributors
 * GET /users/top-contributors
 */
export async function fetchTopContributors() {
  const response = await apiRequest('/users/top-contributors', {
    method: 'GET',
  })

  return response
}

// ==========================================
// [AI] Fact-Checking
// ==========================================

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:3001'

/**
 * AI 서비스 요청 기본 함수
 */
async function aiServiceRequest(endpoint, options = {}) {
  const url = `${AI_SERVICE_URL}${endpoint}`

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: response.statusText,
        message: response.statusText
      }))
      throw new Error(errorData.error || errorData.message || `AI 서비스 요청 실패: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error.message.includes('CORS')) {
      throw new Error('CORS 오류가 발생했습니다. AI 서비스에서 CORS 설정을 확인해주세요.')
    }
    if (error.message.includes('Failed to fetch')) {
      throw new Error('AI 서비스에 연결할 수 없습니다. 서비스가 실행 중인지 확인해주세요.')
    }
    throw error
  }
}

/**
 * 전체 노트에 대한 사실 검증
 * POST /api/fact-check
 */
export async function factCheckNote({ noteContent, subject, checkAll = false }) {
  if (!noteContent || noteContent.trim().length < 100) {
    throw new Error('노트 내용이 필요하며 최소 100자 이상이어야 합니다.')
  }

  const response = await aiServiceRequest('/api/fact-check', {
    method: 'POST',
    body: JSON.stringify({
      noteContent,
      subject,
      checkAll,
    }),
  })

  return response
}

/**
 * 노트에서 검증 가능한 주장만 추출
 * POST /api/extract-claims
 */
export async function extractClaims({ noteContent, subject }) {
  if (!noteContent || noteContent.trim().length < 100) {
    throw new Error('노트 내용이 필요하며 최소 100자 이상이어야 합니다.')
  }

  const response = await aiServiceRequest('/api/extract-claims', {
    method: 'POST',
    body: JSON.stringify({
      noteContent,
      subject,
    }),
  })

  return response
}

/**
 * 단일 주장 검증
 * POST /api/verify-claim
 */
export async function verifyClaim({ claim }) {
  if (!claim || !claim.text) {
    throw new Error('검증할 주장이 필요합니다.')
  }

  const response = await aiServiceRequest('/api/verify-claim', {
    method: 'POST',
    body: JSON.stringify({
      claim,
    }),
  })

  return response
}

