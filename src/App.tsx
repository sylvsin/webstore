import React from "react";
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppContextProvider } from "./AppContext";
import { Home } from "./Home";
import { Order } from "./Order";
import { Admin } from "./Admin";
import { ProductContextProvider } from "./ProductContext";
import "./App.css"

const baseURL: string =
  "https://medieinstitutet-wie-products.azurewebsites.net/api/";

const App: React.FC = () => {
  return (
    <div className="app-wrapper">
      <AppContextProvider baseUrl={baseURL}>
        <ProductContextProvider>
          <Router>
            <div className="nav-wrapper">
              <div>
                <Link to="/">Home</Link>
              </div>
              <div>
                <Link to="/order">Orders</Link>
              </div>
              <div>
                <Link to="/admin">Administration</Link>
              </div>
            </div>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/order/" component={Order} />
              <Route path="/admin/" component={Admin} />
              <Route component={DefaultPage} />
            </Switch>
          </Router>
        </ProductContextProvider>
      </AppContextProvider>
    </div>
  );
};

const DefaultPage = () => {
  return <div>Not Found</div>;
};

export default App;
