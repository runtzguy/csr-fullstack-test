import React from 'react';
import { Link } from "react-router-dom";

import '../css/Signup.css'

const handleSubmit = (e) => {
    const formData = new FormData(e.target);
    const [email, password] = formData.values();
    e.preventDefault();
    fetch('/signup', {
        method: 'POST',
        headers : {'Content-Type' : 'application/json'},
        body: JSON.stringify({email, password})
    }).then(result=> {
        return result.json();
    }).then( data =>{
        //Log message is request isn't sucessful
        if(!data.success){
            console.log(data.msg);
        }
    }).catch(err=>{
        console.error(err);
    })
}

const Signup = () => {
    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}> 
                <label>Email:</label>
                <input type="email" name="email"/>
                <label>Password:</label>
                <input type="password" name="password1"/>
                <label>Repeat Password:</label>
                <input type="password" name="password2"/>
                <input type="submit" value="Submit"/>
            </form>
            <Link to="/login">Already a member? Login here</Link>
        </div>
       
    )
}

export default Signup;