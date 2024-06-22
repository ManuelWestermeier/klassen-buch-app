import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './comp/navbar'
import useAuth from './hooks/use-auth'
import Home from './page/home'
import Login from './page/login'

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
                <Route path='*' element={<Navigate to="/" />} />
            </Routes>
        </main>
    </>
}

export default App