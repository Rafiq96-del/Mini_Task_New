import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Products from './components/Products';

function App() {
    return (
        <Router>
            <Route path="/users/register" component={Register} />
            <Route path="/users/login" component={Login} />
            <PrivateRoute path="/products" component={Products} />
        </Router>
    );
}

// Private route for protected pages
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            localStorage.getItem('token') ? (
                <Component {...props} />
            ) : (
                <Redirect to="/users/register" />
            )
        }
    />
);

export default App;
