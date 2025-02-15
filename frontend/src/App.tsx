import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Transaction from "./pages/Transactions/Transaction";
import Categories from "./pages/Transactions/Categories";
import SubCategories from "./pages/Transactions/SubCategories";
import Home from "./pages/Home";
import CreateProfile from "./pages/Profile/CreateProfile";
import Accounts from "./pages/Transactions/Accounts";
import Recurrency from "./pages/Transactions/Recurrency";
import SignIn from "./pages/Profile/SignIn";

//context
import { TransactionsContext } from "./context/TransactionsContext";
import { AuthContextProvider } from "./context/AuthContext";
import AuthenticatedRoutesContext from "./context/AuthenticatedRoutesContext";
import UnauthRoutesContext from "./context/UnauthRoutesContext";
import {ListAllTransactions} from "./pages/Dashboard/ListAllTransactions";
import { DashboardContext } from "./context/DashboardContext";
import { UserProfile } from "./pages/Profile/UserProfile/UserProfile";
import EditUserData from "./pages/Profile/UserProfile/EditUserData";
import { ChangePassword } from "./pages/Profile/UserProfile/ChangePassword";
import { SearchCoin } from "./pages/SearchCoin";
import { SplashDefaultCoin } from "./pages/Profile/SplashDefaultCoin";
import { ProfileCreationDefaultCoin } from "./pages/Profile/ProfileCreationDefaultCoin";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route element={<AuthContextProvider />}>
          <Route element={<UnauthRoutesContext />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile/create" element={<CreateProfile />} />
            <Route path="/profile/signin" element={<SignIn />} />
            <Route path="/profile/default-coin" element={<SplashDefaultCoin />} />
            <Route path="/profile/default-coin/search" element={<ProfileCreationDefaultCoin />} />
          </Route>

          <Route element={<AuthenticatedRoutesContext />}>
            
            <Route element={<DashboardContext />}>
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

            <Route element={<TransactionsContext />}>
              <Route
                path="/transaction/edit/:paramTransactionScope/:paramId"
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
                element={<Accounts />}
              />
              <Route path="/recurrency" element={<Recurrency />} />
            </Route>

            <Route path="/profile/user" element={<UserProfile />} />
            <Route path="/profile/user/edit" element={<EditUserData />} />
            <Route path="/profile/user/change-password" element={<ChangePassword />} />

            <Route path="/coins/search" element={<SearchCoin />} />

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
  );
}

export default App;
