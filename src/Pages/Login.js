import React, {useState, useEffect} from "react";
import "./styles.css";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import { setLoginStatus, setToken, setUid } from '../redux/actions/auth';
const Login = () => {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [username, setUsername] = useState("")
    const [passwd, setPasswd] = useState("")
    const isLogin = useSelector(state => state.auth.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //console.log(isLogin)
    useEffect(()=>{
        console.log(isLogin)
    },[isLogin])
    // User Login info
    const database = [
        {
            username: "user1",
            password: "pass1"
        },
        {
            username: "user2",
            password: "pass2"
        }
    ];

    const errors = {
        uname: "invalid username",
        pass: "invalid password"
    };

    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();
        const dataBarcode = {
            username: username,
            passwd: passwd
        }
        axios.post("http://tractorserver.myddns.me:3000/auth/login", dataBarcode)
        .then((data)=>{
            console.log(data)
            if(data.data.code===200){
                dispatch(setLoginStatus(true));
                //dispatch(setToken(data.data.token));
                //dispatch(setUid(data.data.uid))
                localStorage.setItem("token",data.data.token)
                localStorage.setItem("uid",data.data.uid)
                navigate('/barcode' );
            }
            else if(data.data.code===500){
                alert("Thông tin đăng nhập không đúng!")
            }
            
        })
        .catch((err)=>{
            console.error(err)
        })
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
                    <input type="text" name="uname" required onChange={(e)=>setUsername(e.target.value)} />
                    {renderErrorMessage("uname")}
                </div>
                <div className="input-container">
                    <label>Password </label>
                    <input type="password" name="pass" required onChange={(e)=>setPasswd(e.target.value)} />
                    {renderErrorMessage("pass")}
                </div>
                <div className="button-container">
                    <input type="submit" />
                </div>
            </form>
        </div>
    );

    return (
        <div className="app">
            <div className="login-form">
                <div className="title">Sign In</div>
                {renderForm}
            </div>
        </div>
    );
}
export default Login