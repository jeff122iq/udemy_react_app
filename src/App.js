import React, {useState} from "react"
import "./App.css"
import Header from "./components/Header";
import Footer from "./components/Footer";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import HomeGueast from "./components/HomeGueast";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080"

function App() {

    const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexappToken")));
    const [flashMessage, setFlashMessage] = useState([])

    function addFlashMessage(msg) {
        setFlashMessage(prevent => prevent.concat(msg))
    }

    return (
      <Router>
          <FlashMessages message={flashMessage}/>
            <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
                <Switch>
                    <Route path="/" exact>
                        {loggedIn ? <Home/> : <HomeGueast/>}
                    </Route>
                    <Route path="/create-post">
                        <CreatePost addFlashMessage={addFlashMessage}/>
                    </Route>
                    <Route path="/about">
                        <About/>
                    </Route>
                    <Route path="/terms">
                        <Terms/>
                    </Route>
                    <Route path="/post/:id">
                        <ViewSinglePost/>
                    </Route>
                </Switch>
            <Footer/>
      </Router>
  );
}
export default App;
