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
export async function signup({ email, password, username }) {
  if (!email || !password) {
    throw new Error('이메일과 비밀번호를 입력해주세요.')
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@yonsei\.ac\.kr$/
  if (!emailRegex.test(email)) {
    throw new Error('연세대학교 이메일(@yonsei.ac.kr)을 입력해주세요.')
  }

  // 백엔드 API 스펙에 맞게 email, password, username, code 전송
  const response = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ 
      email, // email 필드 직접 전송
      password,
      username: username || email.substring(0, email.indexOf('@')), // username이 없으면 email에서 자동 생성
      code: '', // TODO: 이메일 인증 코드 추가 필요
    }),
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

  // 백엔드 API 스펙에 맞게 email, password 직접 전송
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }), // email 필드 직접 사용
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

  const response = await apiRequest('/notes', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response
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

