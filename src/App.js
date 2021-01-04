import React, {useState} from "react"
import "./App.css"
import Header from "./components/Header";
// import HomeGueast from "./components/HomeGueast";
import Footer from "./components/Footer";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";

function App() {

    const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexappToken")));

    return (
      <Router>
          <div className="App">
            <Header loggedin={loggedIn} setLoggedIn={setLoggedIn}/>
                <Switch>
                    <Route path="/" exact>
                        <Home/>
                    </Route>
                    <Route path="/about">
                        <About/>
                    </Route>
                    <Route path="/terms">
                        <Terms/>
                    </Route>
                </Switch>
            <Footer/>
          </div>
      </Router>
  );
}
export default App;
