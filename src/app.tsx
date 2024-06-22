import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './comp/navbar'
import useAuth from './hooks/use-auth'
import Home from './pages/home'
import Login from './pages/login'
import Admin from './pages/admin'
import AdminClasses from './pages/admin/classes'
import AdminAbsent from './pages/admin/absent'

function App() {
    const [auth, setAuth] = useAuth()

    return <>
        <Navbar />
        <main>
            <Routes>
                <Route path='/' element={auth.isAuth ?
                    <Home auth={auth} /> :
                    <Navigate to="/login" />} />
                <Route path='/login' element={<Login setAuth={setAuth} />} />
                <Route path='/admin/' element={<Admin />} >
                    <Route path='classes' index element={<AdminClasses />} />
                    <Route path='absent' element={<AdminAbsent />} />
                </Route>
                <Route path='*' element={<Navigate to="/" />} />
            </Routes>
        </main>
    </>
}

export default App