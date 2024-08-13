import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
import TransactionDate from './pages/Transactions/TransactionDate'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function AppRoutes(){
  const location = useLocation();
  const previousLocation = location.state?.previousLocation;
  return (
    <>
        <Routes location={previousLocation || location}>
          <Route path='/' element={<Home />}/>
          <Route path='/profile/create' element={<CreateProfile />}/>
          <Route path='/dashboard' element={<Dashboard />}/>

          <Route element={<TransactionsContextProvider />}>
              {previousLocation && (
                <Route element={<TransactionDate />}> 
                  <Route path='/transaction' element={<Transaction />}/>
                </Route>
              )}
              {!previousLocation && (
                <Route path='/transaction' element={<Transaction />}/>
              )}
              <Route path='/categories/:type' element={<Categories />} />
              <Route path='/categories/sub/:category' element={<SubCategories />} />
              <Route path='/transaction-accounts/list' element={<TransactionAccount />} />
              <Route path='/recurrency' element={<Recurrency />} />
          </Route>
      </Routes>

    </>
  );
}

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppRoutes /> 
          <Toaster />
        </QueryClientProvider>
      </BrowserRouter>
    </>
  )
}

export default App
