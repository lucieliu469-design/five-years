import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import YearView from '@/pages/YearView'
import MonthView from '@/pages/MonthView'
import DiaryEditor from '@/pages/DiaryEditor'
import EntryView from '@/pages/EntryView'
import CompareView from '@/pages/CompareView'
import ProustPage from '@/pages/Proust'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/year/:year" element={<YearView />} />
          <Route path="/month/:year/:month" element={<MonthView />} />
          <Route path="/entry/new" element={<DiaryEditor />} />
          <Route path="/entry/:id/view" element={<EntryView />} />
          <Route path="/entry/:id" element={<DiaryEditor />} />
          <Route path="/compare/:month/:day" element={<CompareView />} />
          <Route path="/proust" element={<ProustPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
