// Les imports importants
import React, { useState } from "react";
import ReactDom from "react-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import {
  HashRouter,
  Switch,
  Route,
  withRouter,
  Redirect
} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";

import LoginPage from "./pages/loginPage";
import AuthAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from './components/PrivateRoute';

// any CSS you require will output into a single css file (app.css in this case)
require("../css/app.css");

AuthAPI.setup();



const App = () => {
  const [IsAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.IsAuthenticated()
  );
  //console.log(IsAuthenticated);
  const NavBarWithRouter = withRouter(Navbar);

  

  return (
    <AuthContext.Provider value={{
      IsAuthenticated, setIsAuthenticated
    }}>
      <HashRouter>
        <NavBarWithRouter />
        <main className="container pt-5">
          <Switch>
            <Route path="/login" component={LoginPage} />

            <PrivateRoute path="/invoices" component={InvoicesPage} />

            <PrivateRoute path="/customers" component={CustomersPage} />

            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
ReactDom.render(<App />, rootElement);
