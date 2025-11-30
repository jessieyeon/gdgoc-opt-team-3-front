import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import NotesPage from '@/pages/NotesPage'
import NoteDetailPage from '@/pages/NoteDetailPage'
import UploadPage from '@/pages/UploadPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import MyPage from '@/pages/MyPage'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/my-page" element={<MyPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App

