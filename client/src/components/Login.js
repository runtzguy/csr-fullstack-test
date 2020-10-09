import React from 'react';
import { Link, useHistory } from "react-router-dom";

import'../css/Login.css';

function Login ({handleUserAuthChange}){
    const history = useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const [email, password] = formData.values();
    
        fetch('/login', {
            method: 'POST',
            headers : {'Content-Type' : 'application/json'},
            body: JSON.stringify({email, password})
        }).then(result =>{ //result is a ReadableStream object
            return result.json();  //result.json() parses the data into useable format (json)
        }).then(data => {
             //Log message is request isn't sucessful
            if(!data.success){
                console.log(data.msg);
            }
            if(data.isAuthenticated){
                handleUserAuthChange(true, ()=>{
                    history.push('/vehicles');
                });
            }
        }).catch(err => console.log(err));
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input id="email" type="email" name="email"/>
                <label>Password:</label>
                <input id="password" type="password" name="password"/>
                <input type="submit" value="Submit"/>
            </form>
            <Link to="/signup">Not a member? Sign up here</Link>
        </div>

    )
}

export default Login;