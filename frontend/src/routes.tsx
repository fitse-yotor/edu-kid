import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './ui/MainLayout'
import { DashboardPage } from './ui/dashboard/DashboardPage'
import { ProjectEditorPage } from './ui/projects/ProjectEditorPage'
import { LearnLandingPage } from './ui/learn/LearnLandingPage'
import { LessonViewerPage } from './ui/learn/LessonViewerPage'
import { SimulatorPage } from './ui/simulator/SimulatorPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/projects/:projectId" element={<ProjectEditorPage />} />
          <Route path="/learn" element={<LearnLandingPage />} />
          <Route path="/learn/:topicId" element={<LessonViewerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}


