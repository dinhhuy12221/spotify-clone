import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { Routes, Route } from 'react-router-dom'
import AddSong from './pages/AddSong'
import AddAlbum from './pages/AddAlbum'
import ListSong from './pages/ListSong'
import ListAlbum from './pages/ListAlbum'
import ListUser from './pages/ListUser'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Login from './pages/Login'

// Các route bảo vệ
import ProtectedRoute from './routes/ProtectedRoute'
// Các route public (login, register…)
import PublicRoute from './routes/PublicRoute'

export const url = 'http://localhost:8000/api'

const AdminLayout = ({ children }) => (
  <div className='flex items-start min-h-screen'>
    <ToastContainer/>
    <Sidebar/>
    <div className='flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]'>
      <Navbar/>
      <div className='pt-8 pl-5 sm:pt-12 sm:pl-12'>
        {children}
      </div>
    </div>
  </div>
)

const App = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        {/* nếu có register, forgot-pass… thì thêm ở đây */}
      </Route>

      {/* protected/admin routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="add-song" element={<AddSong />} />
                <Route path="add-album" element={<AddAlbum />} />
                <Route path="list-user" element={<ListUser />} />
                <Route path="list-song" element={<ListSong />} />
                <Route path="list-album" element={<ListAlbum />} />
                {/* dashboard, home… */}
              </Routes>
            </AdminLayout>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
