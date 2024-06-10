import React, { useState } from "react";
import "./styles.css";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { setLoginStatus, setToken, setUid } from '../redux/actions/auth';
import { LoginApi } from "../api/auth.api";

const Login = () => {
    const [errorMessages, setErrorMessages] = useState({});
    const [username, setUsername] = useState("");
    const [passwd, setPasswd] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
   

    const handleSubmit = async(event) => {
        // Prevent page reload
        event.preventDefault();
        setLoading(true);
        try {
            const data = await LoginApi(username,passwd)
            if(data){
                setLoading(false);
                if (data.data.code === 200) {
                  //  localStorage.setItem("isSignin", true)
                    localStorage.setItem("refreshToken",data.data.refreshToken )
                    dispatch(setLoginStatus(true));
                    dispatch(setToken(data.data.token));
                    dispatch(setUid(data.data.uid));
                    navigate('/home');
                } else if (data.data.code === 500) {
                    alert("Thông tin đăng nhập không đúng!");
                }
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
        
      
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
