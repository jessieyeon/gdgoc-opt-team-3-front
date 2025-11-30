import { Header } from '@/components/header'
import { UploadForm } from '@/components/upload-form'

export default function UploadPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">필기 업로드</h1>
            <p className="text-muted-foreground">AI 요약과 함께 여러분의 필기를 공유해주세요</p>
          </div>

          <UploadForm />
        </div>
      </main>
    </div>
  )
}

