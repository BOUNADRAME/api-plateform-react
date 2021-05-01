import { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Navbar from "./components/Navbar";
import CustomersPage from "./pages/CustomersPage";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import authService from "./services/authService";
import AuthContext from "./contexts/AuthContext";
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";
// Toast
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

authService.setup();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      <Router>
        <Navbar />

        <main className="container pt-5">
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />
            <PrivateRoute exact path="/invoices/:id" component={InvoicePage} />
            <PrivateRoute exact path="/invoices" component={InvoicesPage} />
            <PrivateRoute path="/customers/:id" component={CustomerPage} />
            <PrivateRoute exact path="/customers" component={CustomersPage} />
            {/* <Route exact path="/customers" component={CustomerPageWithPagination} /> */}
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </Router>
      {/* Toast */}
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
    </AuthContext.Provider>
  );
};

export default App;
