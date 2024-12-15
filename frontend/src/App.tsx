import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Toaster } from './components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

//pages
import Dashboard from './pages/Dashboard/Dashboard'
import Transaction from './pages/Transactions/Transaction'
import Categories from './pages/Transactions/Categories'
import SubCategories from './pages/Transactions/SubCategories'
import Home from './pages/Home'
import CreateProfile from './pages/Profile/CreateProfile'
import TransactionAccount from './pages/Transactions/TransactionAccount'
import Recurrency from './pages/Transactions/Recurrency'
import SignIn from './pages/Profile/SignIn'
import MonthPicker from './pages/MonthPicker';

//context
import { TransactionsContextProvider } from './context/TransactionsContext'
import { AuthContextProvider } from './context/AuthContext'
import AuthenticatedRoutesContext from './context/AuthenticatedRoutesContext'
import UnauthRoutesContext from './context/UnauthRoutesContext'
import ListAllTransactions from './pages/Dashboard/ListAllTransactions'

function AppRoutes(){
  return (
    <>
      <Routes>
        <Route element={<AuthContextProvider />}>
          <Route element={<UnauthRoutesContext />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile/create" element={<CreateProfile />} />
            <Route path="profile/signin" element={<SignIn />} />
          </Route>

          <Route element={<AuthenticatedRoutesContext />}>
            <Route element={<MonthPicker />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/transaction/list/:dateParams"
                element={<ListAllTransactions />}
              />
              <Route
                path="/transaction/list"
                element={<ListAllTransactions />}
              />
            </Route>

            <Route element={<TransactionsContextProvider />}>
              <Route
                  path="/transaction/edit/:transactionScope/:id"
                  element={<Transaction mode="edit" />}
              />
              <Route
                path="/transaction"
                element={<Transaction mode="create" />}
              />

              <Route path="/categories/:type" element={<Categories />} />
              <Route
                path="/categories/sub/:category"
                element={<SubCategories />}
              />
              <Route
                path="/transaction-accounts/list"
                element={<TransactionAccount />}
              />
              <Route path="/recurrency" element={<Recurrency />} />
            </Route>
          </Route>
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
