import { Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthenticationGuard } from './features/authentication/components/auth-guard'
import QueuePage from './features/queue/components/queue-page'
import LoginPage from './features/authentication/components/login-page'

function App() {
  return (
    <>
        <Routes>
            <Route path="/" element={<AuthenticationGuard component={QueuePage} />} />
            <Route path="/login" element={<AuthenticationGuard component={LoginPage} />} />
        </Routes>
    </>
  )
}

export default App
