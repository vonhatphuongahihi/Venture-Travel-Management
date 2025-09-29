

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Bookings from './pages/Bookings'
import Overview from './pages/Overview'
import Tours from './pages/Tours'
import Places from './pages/Places'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import { Sidebar } from './components/Sidebar'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <BrowserRouter>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 bg-[#F9FDFF]">
            <Routes>
              <Route path="/" element={<Navigate to="/bookings" replace />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/places" element={<Places />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
