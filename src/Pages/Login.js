import React, { useState } from "react";
import "./styles.css";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import { setLoginStatus, setToken, setUid } from '../redux/actions/auth';

const Login = () => {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [username, setUsername] = useState("");
    const [passwd, setPasswd] = useState("");
    const [loading, setLoading] = useState(false);
    const isLogin = useSelector(state => state.auth.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        // Prevent page reload
        event.preventDefault();
        setLoading(true);
        const dataBarcode = {
            username: username,
            passwd: passwd
        };
        axios.post("https://barcodeserver-latest-b6nu.onrender.com/auth/login", dataBarcode)
            .then((data) => {
                console.log(data);
                setLoading(false);
                if (data.data.code === 200) {
                    dispatch(setLoginStatus(true));
                    dispatch(setToken(data.data.token));
                    dispatch(setUid(data.data.uid));
                    navigate('/home');
                } else if (data.data.code === 500) {
                    alert("Thông tin đăng nhập không đúng!");
                }
            })
            .catch((err) => {
                setLoading(false);
                console.error(err);
            });
    };

    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );

    // JSX code for login form
    const renderForm = (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label>Username </label>
                    <input type="text" name="uname" required onChange={(e) => setUsername(e.target.value)} />
                    {renderErrorMessage("uname")}
                </div>
                <div className="input-container">
                    <label>Password </label>
                    <input type="password" name="pass" required onChange={(e) => setPasswd(e.target.value)} />
                    {renderErrorMessage("pass")}
                </div>
                <div className="button-container">
                    <input type="submit" disabled={loading} />
                </div>
            </form>
        </div>
    );

    return (
        <div className="app">
            <div className={`login-form ${loading ? 'loading' : ''}`}>
                <div className="title">Sign In</div>
                {renderForm}
                {loading && 
                    <div className="loading-overlay">
                        <ClipLoader color="#000" loading={loading} size={50} />
                    </div>
                }
            </div>
        </div>
    );
};

export default Login;
