import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import AllVehicles from './AllVehicles';
import Login from './Login';
import Signup from './Signup';

import '../css/App.css'



function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleUserAuthChange = (boolValue, cb) => {
        setIsAuthenticated(boolValue);
        cb();
    }

    const PrivateRoute = ({isAuthenticated, component : Component, ...rest}) => {
        return ( 
            <Route
                {...rest}
                component={
                    props => isAuthenticated 
                    ? <Component {...props}/>
                    : (<Redirect to={{ pathname: '/'}}/>)
                }
            />
        )
    }

    return (
        <div className="app-background">
            <Router> 
                <Switch>    
                    <Route path='/login' 
                            render={() => <Login handleUserAuthChange={handleUserAuthChange}/>}>
                    </Route>
                    <Route path='/signup' 
                            render={() => <Signup/>}>
                    </Route>
                    <PrivateRoute path='/vehicles' isAuthenticated={isAuthenticated} component={AllVehicles}>
                    </PrivateRoute>
                    <Route path='/' 
                            render={() => <Login handleUserAuthChange={handleUserAuthChange}/>}>
                    </Route>
                </Switch>
            </Router>
     
        </div>
    )
}



export default App;