import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, File, X, Sparkles, Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { fetchUploadMetadata, generateNoteSummary } from '@/services/mockApi'
import { createNoteMetadata, uploadFileToS3, updateNoteAiSummary } from '@/services/api'
import { useAuth } from '@/context/AuthContext'

function mapDifficultyToEnum(koreanDifficulty) {
  switch (koreanDifficulty) {
    case '입문':
    case '초급':
      return 'Easy'
    case '중급':
      return 'Medium'
    case '중상급':
    case '고급':
      return 'Hard'
    default:
      return 'Medium'
  }
}

export function UploadForm() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, updateUserUploadStatus } = useAuth()
  const [title, setTitle] = useState('')
  const [semester, setSemester] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [professor, setProfessor] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const [aiSummary, setAiSummary] = useState(null)
  const [metadata, setMetadata] = useState({ semesters: [], departments: [] })
  const [metaLoading, setMetaLoading] = useState(true)

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="rounded-full bg-muted p-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-xl font-semibold">로그인을 해주세요!</p>
          <p className="text-muted-foreground">필기를 업로드하려면 로그인이 필요합니다.</p>
          <Button onClick={() => navigate('/login')}>로그인 하러 가기</Button>
        </CardContent>
      </Card>
    )
  }

  useEffect(() => {
    fetchUploadMetadata()
      .then(setMetadata)
      .finally(() => setMetaLoading(false))
  }, [])

  useEffect(() => {
    setCourseId('')
    setProfessor('')
  }, [departmentId])

  useEffect(() => {
    setProfessor('')
  }, [courseId])

  const selectedDepartment = useMemo(
    () => metadata.departments.find((dept) => dept.id === departmentId),
    [metadata.departments, departmentId],
  )
  const courses = selectedDepartment?.subjects || []
  const selectedCourse = courses.find((course) => course.id === courseId)
  const professors = selectedCourse?.professors || []
  const selectedMajor = selectedDepartment?.name || ''
  const selectedSubject = selectedCourse?.name || ''

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type !== 'application/pdf' && !droppedFile.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: '지원하지 않는 파일 형식',
          description: 'PDF 파일만 업로드 가능합니다.',
          variant: 'destructive',
        })
        return
      }
      setFile(droppedFile)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: '지원하지 않는 파일 형식',
          description: 'PDF 파일만 업로드 가능합니다.',
          variant: 'destructive',
        })
        return
      }
      setFile(selectedFile)
    }
  }

  const handleGenerateSummary = async () => {
    if (!file || !title || !departmentId) {
      alert('파일, 제목, 학과를 모두 입력해주세요')
      return
    }

    setGeneratingSummary(true)
    try {
      const summary = await generateNoteSummary({
        file, // 실제 파일 객체 전달
        title,
        subject: selectedDepartment?.subjectLabel || selectedSubject || '기타',
        professor: professor || undefined,
        semester: semester || undefined,
      })
      setAiSummary(summary)
      setDescription(summary.summary)
    } catch (error) {
      console.error('Failed to generate summary:', error)
      toast({
        title: 'AI 요약 생성 실패',
        description: error.message || 'AI 요약 생성에 실패했습니다.',
        variant: 'destructive',
      })
    } finally {
      setGeneratingSummary(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file || !title || !departmentId || !courseId || !professor || !semester) {
      toast({
        title: '입력 항목을 확인해주세요',
        description: '파일, 제목, 학기, 학과, 과목, 교수님은 필수 항목입니다.',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)

    try {
      toast({
        title: '업로드 중...',
        description: '필기를 업로드하고 있습니다. 잠시만 기다려주세요.',
      })

      // 1. 메타데이터 저장 및 presignedUrl 받기
      const { noteId, presignedUrl, fileKey } = await createNoteMetadata({
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        semester,
        major: selectedMajor,
        subject: selectedSubject,
        professor,
        description: description || undefined,
        difficulty: aiSummary ? mapDifficultyToEnum(aiSummary.difficulty) : undefined,
        estimatedTime: aiSummary?.estimatedTime,
        aiSummary: aiSummary?.summary,
      })

      console.log('Received Presigned URL:', presignedUrl) // Debug log

      // 2. S3에 파일 업로드
      await uploadFileToS3(presignedUrl, file)

      // 3. AI 요약이 있으면 백엔드에 업데이트
      if (aiSummary) {
        try {
          await updateNoteAiSummary(noteId, aiSummary)
          console.log('AI summary updated:', { noteId })
        } catch (aiError) {
          console.error('AI 요약 업데이트 실패 (업로드는 성공):', aiError)
          // AI 요약 업데이트 실패해도 업로드는 성공으로 처리
        }
      }

      // 업로드 완료
      console.log('Upload completed:', { noteId, fileKey })

      toast({
        title: '업로드 완료!',
        description: '필기가 성공적으로 업로드되었습니다. 필기 탐색 페이지로 이동합니다.',
      })

      updateUserUploadStatus(true)

      setTimeout(() => {
        navigate('/notes')
      }, 800)
    } catch (err) {
      toast({
        title: '업로드 실패',
        description: err.message || '필기 업로드 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label>파일 *</Label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${dragActive
                ? 'border-primary bg-primary/5'
                : file
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-sm font-medium">파일을 드래그하거나 클릭하여 업로드</p>
                    <p className="text-xs text-muted-foreground">
                      PDF 형식만 지원 (최대 50MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    파일 선택
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                placeholder="미적분학 1 - 극한과 연속성"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">학기 *</Label>
              <Select value={semester} onValueChange={setSemester} disabled={metaLoading}>
                <SelectTrigger id="semester">
                  <SelectValue placeholder="학기를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {metadata.semesters.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>학과 *</Label>
              <Select value={departmentId} onValueChange={setDepartmentId} disabled={metaLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="학과를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {metadata.departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>과목 *</Label>
              <Select
                value={courseId}
                onValueChange={setCourseId}
                disabled={!selectedDepartment || courses.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="과목을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>교수님 성함 *</Label>
            <Select
              value={professor}
              onValueChange={setProfessor}
              disabled={!selectedCourse || professors.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="교수님을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {professors.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {file && title && departmentId && (
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateSummary}
              disabled={generatingSummary}
              className="w-full border-primary/30 hover:bg-primary/5"
            >
              {generatingSummary ? (
                <>
                  <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  AI 분석 중...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI로 자동 요약 생성
                </>
              )}
            </Button>
          )}

          {aiSummary && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">AI 요약</span>
              </div>
              <ul className="space-y-1">
                {aiSummary.keyPoints.map((point, index) => (
                  <li key={index} className="flex gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 text-xs text-muted-foreground pt-2">
                <span>난이도: {aiSummary.difficulty}</span>
                <span>•</span>
                <span>예상 시간: {aiSummary.estimatedTime}</span>
                <span>•</span>
                <span className="text-blue-600 font-medium">정확도: {aiSummary.accuracy}%</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">추가 설명 (선택)</Label>
            <Textarea
              id="description"
              placeholder="필기에 대한 추가 정보를 입력하세요..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={
                !file ||
                !title ||
                !departmentId ||
                !courseId ||
                !professor ||
                !semester ||
                uploading
              }
              className="min-w-[140px]"
            >
              {uploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  업로드
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

