import React, { useState } from 'react';
import axios from 'axios';

function Register({ history }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/users/register', formData);
            localStorage.setItem('token', res.data.token);
            history.push('/users/login');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>Username</label>
                <input type="text" name="username" value={username} onChange={onChange} required />
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password" value={password} onChange={onChange} required />
            </div>
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
