const clone = (value) => JSON.parse(JSON.stringify(value))

const delay = (value, ms = 350) => new Promise((resolve) => {
  setTimeout(() => resolve(clone(value)), ms)
})

const semesters = []
for (let year = 2025; year >= 2018; year -= 1) {
  semesters.push(`${year}년 2학기`, `${year}년 1학기`)
}

const departments = [
  {
    id: 'math',
    name: '수학과',
    subjectLabel: '수학',
    subjects: [
      {
        id: 'calc-1',
        name: '미적분학 1',
        professors: ['김연세', '강수학'],
      },
      {
        id: 'linear-algebra',
        name: '선형대수학',
        professors: ['강수학'],
      },
    ],
  },
  {
    id: 'physics',
    name: '물리학과',
    subjectLabel: '물리학',
    subjects: [
      {
        id: 'mechanics',
        name: '일반물리학',
        professors: ['이공대', '박물리'],
      },
    ],
  },
  {
    id: 'economics',
    name: '경제학과',
    subjectLabel: '경제학',
    subjects: [
      {
        id: 'microeconomics',
        name: '미시경제학',
        professors: ['박경제'],
      },
    ],
  },
  {
    id: 'cs',
    name: '컴퓨터과학과',
    subjectLabel: '컴퓨터과학',
    subjects: [
      {
        id: 'data-structure',
        name: '자료구조',
        professors: ['정소프트'],
      },
      {
        id: 'database',
        name: '데이터베이스',
        professors: ['정소프트', '최데이터'],
      },
    ],
  },
  {
    id: 'chemistry',
    name: '화학과',
    subjectLabel: '화학',
    subjects: [
      {
        id: 'organic',
        name: '유기화학',
        professors: ['최화학'],
      },
    ],
  },
]

const mockUsers = [
  {
    studentId: '2023123456',
    name: '이연세',
    username: '연필장인',
    departmentId: 'math',
    avatarUrl: '/placeholder-user.jpg',
    password: '1234',
  },
  {
    studentId: '2023234567',
    name: '박하늘',
    username: 'NewtonChaser',
    departmentId: 'physics',
    avatarUrl: '/placeholder-user.jpg',
    password: '1234',
  },
  {
    studentId: '2023345678',
    name: '김경제',
    username: 'SupplyDemand',
    departmentId: 'economics',
    avatarUrl: '/placeholder-user.jpg',
    password: '1234',
  },
  {
    studentId: '2023456789',
    name: '최소프트',
    username: 'StackGuru',
    departmentId: 'cs',
    avatarUrl: '/placeholder-user.jpg',
    password: '1234',
  },
  {
    studentId: '2023567890',
    name: '장화학',
    username: 'CarbonWizard',
    departmentId: 'chemistry',
    avatarUrl: '/placeholder-user.jpg',
    password: '1234',
  },
]

const userActivities = {
  '2023123456': {
    liked: ['note-4', 'note-5'],
    bookmarked: ['note-2', 'note-3'],
    downloaded: ['note-5'],
  },
  '2023234567': {
    liked: ['note-1'],
    bookmarked: ['note-3'],
    downloaded: [],
  },
}

const notes = [
  {
    id: 'note-1',
    title: '미적분학 1 - 극한과 연속성',
    subject: '수학',
    courseId: 'calc-1',
    departmentId: 'math',
    professor: '김연세',
    semester: '2024년 1학기',
    uploadDate: '2024-03-15',
    likes: 245,
    dislikes: 12,
    summary:
      '극한의 정의와 성질, 연속함수의 특성을 다룹니다. 엡실론-델타 논법과 중간값 정리를 중점적으로 설명합니다.',
    uploaderId: '2023123456',
    thumbnailUrl: '/calculus-notes-page.jpg',
    previewImage: '/calculus-notes-full-page.jpg',
    aiSummary: {
      keyPoints: [
        '극한의 엄밀한 정의와 직관',
        '연속함수의 성질과 판별법',
        '중간값 정리 및 응용',
      ],
      summary:
        '극한과 연속성의 핵심 개념을 정의에서부터 증명까지 순차적으로 정리하고, 시험에 자주 등장하는 응용 예제를 함께 제공합니다.',
      difficulty: '중급',
      estimatedTime: '45분',
    },
    tags: ['수학', '시험대비'],
  },
  {
    id: 'note-2',
    title: '일반물리학 - 뉴턴의 운동법칙',
    subject: '물리학',
    courseId: 'mechanics',
    departmentId: 'physics',
    professor: '이공대',
    semester: '2024년 1학기',
    uploadDate: '2024-03-14',
    likes: 189,
    dislikes: 8,
    summary:
      '뉴턴의 3가지 운동법칙과 이를 활용한 문제 풀이. 힘의 평형, 마찰력, 장력에 대한 예제 포함.',
    uploaderId: '2023234567',
    thumbnailUrl: '/physics-newton-laws-notes.jpg',
    previewImage: '/physics-newton-laws-notes.jpg',
    aiSummary: {
      keyPoints: ['관성의 법칙', 'F=ma의 해석', '작용 반작용'],
      summary:
        '기본 법칙을 실제 예제로 연결하여 이해도를 높입니다. 마찰과 장력 문제를 단계적으로 풉니다.',
      difficulty: '초급',
      estimatedTime: '35분',
    },
    tags: ['물리학', '기초'],
  },
  {
    id: 'note-3',
    title: '미시경제학 - 수요와 공급의 원리',
    subject: '경제학',
    courseId: 'microeconomics',
    departmentId: 'economics',
    professor: '박경제',
    semester: '2024년 1학기',
    uploadDate: '2024-03-13',
    likes: 312,
    dislikes: 15,
    summary:
      '시장균형의 개념과 수요/공급 곡선의 이동. 탄력성의 정의와 계산 방법을 그래프와 함께 정리.',
    uploaderId: '2023345678',
    thumbnailUrl: '/economics-supply-demand-graph.jpg',
    previewImage: '/economics-supply-demand-graph.jpg',
    aiSummary: {
      keyPoints: ['시장 균형', '탄력성 계산', '정책 변화 효과'],
      summary:
        '수요 공급 모델을 시각적으로 설명하고, 정부 정책이 시장에 미치는 영향을 사례 중심으로 정리했습니다.',
      difficulty: '중급',
      estimatedTime: '50분',
    },
    tags: ['경제학', '정책'],
  },
  {
    id: 'note-4',
    title: '자료구조 - 스택과 큐',
    subject: '컴퓨터과학',
    courseId: 'data-structure',
    departmentId: 'cs',
    professor: '정소프트',
    semester: '2024년 1학기',
    uploadDate: '2024-03-12',
    likes: 428,
    dislikes: 9,
    summary:
      '스택과 큐의 개념, 구현 방법, 시간복잡도 분석. 실제 코드 예제와 함께 ADT 정의를 명확히 설명.',
    uploaderId: '2023456789',
    thumbnailUrl: '/data-structures-stack-queue-diagram.jpg',
    previewImage: '/data-structures-stack-queue-diagram.jpg',
    aiSummary: {
      keyPoints: ['ADT 정의', '배열/연결리스트 구현', '응용 사례'],
      summary:
        '스택과 큐를 상황별로 비교하고, 시험에 자주 나오는 알고리즘 문제 유형을 정리했습니다.',
      difficulty: '중상급',
      estimatedTime: '60분',
    },
    tags: ['컴퓨터과학', '자료구조'],
  },
  {
    id: 'note-5',
    title: '유기화학 - 알케인과 알켄',
    subject: '화학',
    courseId: 'organic',
    departmentId: 'chemistry',
    professor: '최화학',
    semester: '2024년 1학기',
    uploadDate: '2024-03-11',
    likes: 156,
    dislikes: 7,
    summary:
      '탄화수소의 명명법과 구조. 이성질체의 종류와 물리적 성질의 차이. 반응 메커니즘 포함.',
    uploaderId: '2023567890',
    thumbnailUrl: '/organic-chemistry-molecular-structures.jpg',
    previewImage: '/organic-chemistry-molecular-structures.jpg',
    aiSummary: {
      keyPoints: ['알케인 구조', '이성질체 분류', '반응 경로'],
      summary:
        '알케인/알켄의 핵심 성질과 반응성을 표로 정리하고, 문제 풀이 팁을 제공합니다.',
      difficulty: '중급',
      estimatedTime: '40분',
    },
    tags: ['화학', '반응기작'],
  },
  {
    id: 'note-6',
    title: '선형대수학 - 행렬과 행렬식',
    subject: '수학',
    courseId: 'linear-algebra',
    departmentId: 'math',
    professor: '강수학',
    semester: '2024년 1학기',
    uploadDate: '2024-03-10',
    likes: 201,
    dislikes: 11,
    summary:
      '행렬 연산의 기본 성질과 행렬식 계산법. 역행렬의 존재 조건과 크래머 공식 유도 과정.',
    uploaderId: '2023123456',
    thumbnailUrl: '/linear-algebra-matrix-determinant.jpg',
    previewImage: '/linear-algebra-matrix-determinant.jpg',
    aiSummary: {
      keyPoints: ['행렬식 성질', '역행렬 조건', '크래머 공식'],
      summary:
        '문제 풀이 과정을 단계적으로 정리하여 개념과 계산을 동시에 잡을 수 있도록 구성했습니다.',
      difficulty: '중상급',
      estimatedTime: '55분',
    },
    tags: ['수학', '선형대수'],
  },
]

const findUser = (studentId) => mockUsers.find((user) => user.studentId === studentId)

const sanitizeUser = (user) => {
  if (!user) return null
  const { password, ...publicProfile } = user
  return publicProfile
}

const buildNotePayload = (note) => {
  const uploader = sanitizeUser(findUser(note.uploaderId))
  return {
    ...note,
    uploader,
  }
}

export async function loginWithRunUs({ studentId, password }) {
  const user = findUser(studentId)
  if (!user) {
    throw new Error('등록되지 않은 계정입니다.')
  }
  if (!password) {
    throw new Error('비밀번호를 입력해주세요.')
  }
  if (user.password !== password) {
    throw new Error('비밀번호가 일치하지 않습니다.')
  }
  return delay({
    token: `mock-token-${studentId}`,
    user: sanitizeUser(user),
  })
}

export async function registerUser({ studentId, password, name, username, departmentId }) {
  if (!studentId || !password || !name || !username || !departmentId) {
    throw new Error('모든 정보를 입력해주세요.')
  }
  if (findUser(studentId)) {
    throw new Error('이미 등록된 학번입니다.')
  }
  const department = departments.find((dept) => dept.id === departmentId) || departments[0]
  const newUser = {
    studentId,
    password,
    name,
    username: username.trim(),
    departmentId: department.id,
    avatarUrl: '/placeholder-user.jpg',
  }
  mockUsers.push(newUser)
  userActivities[studentId] = { liked: [], bookmarked: [], downloaded: [] }
  return delay(sanitizeUser(newUser))
}

export async function updateUsername({ studentId, username }) {
  const user = findUser(studentId)
  if (!user) {
    throw new Error('계정을 찾을 수 없습니다.')
  }
  user.username = username
  return delay(sanitizeUser(user))
}

export async function generateProfileImage({ studentId }) {
  const user = findUser(studentId)
  if (!user) {
    throw new Error('계정을 찾을 수 없습니다.')
  }
  const imageUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
    user.username || studentId,
  )}`
  user.avatarUrl = imageUrl
  return delay({ imageUrl })
}

export async function fetchNotes({ category = '전체', limit } = {}) {
  let result = notes.slice().sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))

  if (category && category !== '전체') {
    result = result.filter((note) => note.subject === category)
  }

  if (limit) {
    result = result.slice(0, limit)
  }

  return delay(result.map(buildNotePayload))
}

export async function fetchNoteCategories() {
  const uniqueSubjects = Array.from(new Set(notes.map((note) => note.subject)))
  return delay(['전체', ...uniqueSubjects])
}

export async function fetchNoteDetail(noteId) {
  const note = notes.find((item) => item.id === noteId)
  if (!note) {
    throw new Error('해당 필기를 찾을 수 없습니다.')
  }

  const relatedNotes = notes
    .filter((item) => item.id !== noteId && item.departmentId === note.departmentId)
    .slice(0, 3)

  return delay({
    ...buildNotePayload(note),
    relatedNotes: relatedNotes.map(buildNotePayload),
  })
}

export async function fetchTrendingNotes(limit = 3) {
  const trending = notes.slice().sort((a, b) => b.likes - a.likes).slice(0, limit)
  return delay(trending.map(buildNotePayload))
}

export async function fetchForYouNotes(studentId, limit = 3) {
  const user = findUser(studentId)
  let list = notes.slice()

  if (user?.departmentId) {
    list = list.filter((note) => note.departmentId === user.departmentId)
  }

  return delay(list.slice(0, limit).map(buildNotePayload))
}

export async function fetchTopContributors(limit = 3) {
  const aggregate = mockUsers
    .map((user) => {
      const userNotes = notes.filter((note) => note.uploaderId === user.studentId)
      const totalLikes = userNotes.reduce((sum, note) => sum + note.likes, 0)
      return {
        ...user,
        uploads: userNotes.length,
        totalLikes,
      }
    })
    .sort((a, b) => b.uploads - a.uploads || b.totalLikes - a.totalLikes)
    .slice(0, limit)

  return delay(aggregate)
}

export async function fetchUserLibrary(studentId) {
  const activity = userActivities[studentId] || {}

  const myNotes = notes.filter((note) => note.uploaderId === studentId)
  const likedNotes = notes.filter((note) => activity.liked?.includes(note.id))
  const bookmarkedNotes = notes.filter((note) => activity.bookmarked?.includes(note.id))
  const downloadedNotes = notes.filter((note) => activity.downloaded?.includes(note.id))

  return delay({
    myNotes: myNotes.map(buildNotePayload),
    likedNotes: likedNotes.map(buildNotePayload),
    bookmarkedNotes: bookmarkedNotes.map(buildNotePayload),
    downloadedNotes: downloadedNotes.map(buildNotePayload),
  })
}

export async function fetchUploadMetadata() {
  return delay({
    semesters,
    departments,
  })
}

export async function generateNoteSummary({ title, subject, fileName }) {
  return delay({
    keyPoints: [
      `${subject} 핵심 개념 요약`,
      '시험에 자주 나오는 문제 유형',
      '실전 적용 팁과 주의사항',
    ],
    difficulty: ['입문', '초급', '중급', '중상급'][Math.floor(Math.random() * 4)],
    estimatedTime: `${30 + Math.floor(Math.random() * 40)}분`,
    summary: `${title} 자료를 기반으로 ${subject}의 핵심 내용을 정리했습니다. 파일(${fileName})을 분석하여 학습 효율을 높일 수 있는 포인트를 제공합니다.`,
    tags: [subject, '시험대비'],
  })
}

export async function uploadNote({
  title,
  departmentId,
  courseId,
  professor,
  semester,
  description,
  subjectLabel,
  uploaderId = '2023123456',
  fileName,
  aiSummary,
}) {
  if (!title || !departmentId || !courseId || !professor || !semester) {
    throw new Error('필수 정보를 모두 입력해주세요.')
  }

  const department = departments.find((dept) => dept.id === departmentId)
  const course = department?.subjects.find((subject) => subject.id === courseId)

  const newNote = {
    id: `note-${Date.now()}`,
    title,
    subject: subjectLabel || department?.subjectLabel || course?.name || '기타',
    courseId,
    departmentId,
    professor,
    semester,
    uploadDate: new Date().toISOString().slice(0, 10),
    likes: 0,
    dislikes: 0,
    summary: description || `${title} 자료입니다.`,
    uploaderId,
    thumbnailUrl: '/placeholder.svg',
    previewImage: '/placeholder.svg',
    aiSummary: aiSummary || {
      keyPoints: ['핵심 요약 준비 중'],
      summary: 'AI 요약이 곧 생성됩니다.',
      difficulty: '중급',
      estimatedTime: '40분',
    },
    tags: [department?.name || '기타'],
    fileName,
  }

  notes.unshift(newNote)
  return delay(buildNotePayload(newNote))
}

