import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import CreateProfile from './pages/Profile/CreateProfile'
import { Toaster } from './components/ui/toaster'
import Dashboard from './pages/Dashboard'
import Transaction from './pages/Transactions/Transaction'
import Categories from './pages/Transactions/Categories'
import SubCategories from './pages/Transactions/SubCategories'
import { TransactionsContextProvider } from './context/TransactionsContext'
import TransactionAccount from './pages/Transactions/TransactionAccount'
import Recurrency from './pages/Transactions/Recurrency'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/profile/create' element={<CreateProfile />}/>
          <Route path='/dashboard' element={<Dashboard />}/>

          <Route element={<TransactionsContextProvider />}>
            <Route path='/transaction' element={<Transaction />}/>
            <Route path='/categories/:type' element={<Categories />} />
            <Route path='/categories/sub/:category' element={<SubCategories />} />
            <Route path='/transaction-accounts/list' element={<TransactionAccount />} />
            <Route path='/recurrency' element={<Recurrency />} />
          </Route>
          
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  )
}

export default App
