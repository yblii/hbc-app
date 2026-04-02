import { Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthenticationGuard } from './features/authentication/components/auth-guard'
import LoginPage from './features/authentication/components/login-page'
import QueuePage from './features/queue/components/QueuePage'
import { MobileLayout } from './components/MobileLayout'

function App() {
  return (
    <>
        <Routes>
            <Route path="/" element={<AuthenticationGuard component={MobileLayout} />}>
                <Route index element={<QueuePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="profile" element={<LoginPage />} />
                <Route path="timers" element={<LoginPage />} />
            </Route>
        </Routes>
    </>
  )
}

export default App
