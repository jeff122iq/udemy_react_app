import React, {useState} from 'react';
import Axios from "axios";

const HeaderLoggedOut = (props) => {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await Axios.post("/login", {username, password});
            if (response.data) {
                localStorage.setItem("complexappToken", response.data.token);
                localStorage.setItem("complexappUsername", response.data.username);
                localStorage.setItem("complexappAvatar", response.data.avatar);
                console.log(response.data)
                props.setLoggedIn(true);
            } else {
                console.log("Incorrect data's!");
            }
        } catch(error) {
            console.log("Didn't log-in!")
        }

    }

    return (
        <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
            <div className="row align-items-center">
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input onChange={event => setUsername(event.target.value)} name="username" className="form-control form-control-sm input-dark" type="text"
                           placeholder="Username" autoComplete="off"/>
                </div>
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input onChange={event => setPassword(event.target.value)} name="password" className="form-control form-control-sm input-dark" type="password"
                           placeholder="Password"/>
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-success btn-sm">Sign In</button>
                </div>
            </div>
        </form>
    );
};

export default HeaderLoggedOut;