import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import CreateProfile from './pages/Profile/CreateProfile'
import { Toaster } from './components/ui/toaster'
import Dashboard from './pages/Dashboard'
import Transaction from './pages/Transaction'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/profile/create' element={<CreateProfile />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/transaction' element={<Transaction />}/>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  )
}

export default App
