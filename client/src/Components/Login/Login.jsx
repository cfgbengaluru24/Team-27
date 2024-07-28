import React, { useEffect, useState } from 'react';
import './Login.css';
import '../../App.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import video from '../../Assets/video.mp4';
import logo from '../../Assets/logo.png';
import { FaUserShield } from 'react-icons/fa';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';

const Login = () => {
    const [loginUserName, setLoginUserName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [statusHolder, setStatusHolder] = useState('message');
    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const navigateTo = useNavigate();

    const loginUser = (e) => {
        e.preventDefault();
        // Reset error states
        setUserNameError(false);
        setPasswordError(false);

        if (loginUserName === '' || loginPassword === '') {
            // Set error states for empty fields
            if (loginUserName === '') setUserNameError(true);
            if (loginPassword === '') setPasswordError(true);

            setLoginStatus(`Please fill in all fields!`);
            return; // Stop further execution
        }

        Axios.post('http://localhost:3002/login', {
            LoginUserName: loginUserName,
            LoginPassword: loginPassword
        }).then((response) => {
            if (response.data.message) {
                setLoginStatus(`Credentials Don't Exist!`);
            } else {
                navigateTo('/dashboard');
            }
        }).catch((error) => {
            console.error('Login error:', error);
            setLoginStatus('An error occurred. Please try again.');
        });
    }

    useEffect(() => {
        if (loginStatus !== '') {
            setStatusHolder('showMessage');
            setTimeout(() => {
                setStatusHolder('message');
            }, 2000);
        }
    }, [loginStatus]);

    const onSubmit = () => {
        setLoginUserName('');
        setLoginPassword('');
    }

    return (
        <div className="loginPage flex">
            <div className="container flex">

                <div className="videoDiv">
                    <video src={video} autoPlay muted loop></video>

                    <div className="textDiv">
                        <h2 className="title">Shola Trust</h2>
                        <p>Are people part of nature? We believe they are.</p>
                    </div>

                    <div className="footerDiv flex">
                        <span className="text">Don't have an account?</span>
                        <Link to={'/register'}>
                            <button className="btn">Sign Up</button>
                        </Link>
                    </div>
                </div>

                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo Image" />
                        <h3>Welcome Back!</h3>
                    </div>

                    <form action="" className="form grid" onSubmit={onSubmit}>
                        <span className={statusHolder}>{loginStatus}</span>

                        <div className="inputDiv">
                            <label htmlFor="username">Username</label>
                            <div className={`input flex ${userNameError ? 'inputError' : ''}`}>
                                <FaUserShield className="icon" />
                                <input 
                                    type="text" 
                                    id='username' 
                                    placeholder='Enter Username'
                                    className={userNameError ? 'errorInput' : ''}
                                    onChange={(event) => setLoginUserName(event.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="password">Password</label>
                            <div className={`input flex ${passwordError ? 'inputError' : ''}`}>
                                <BsFillShieldLockFill className="icon" />
                                <input 
                                    type="password" 
                                    id='password' 
                                    placeholder='Enter Password'
                                    className={passwordError ? 'errorInput' : ''}
                                    onChange={(event) => setLoginPassword(event.target.value)} 
                                />
                            </div>
                        </div>

                        <button type='submit' className='btn flex' onClick={loginUser}>
                            <NavLink to='/dashboard'> <span>Login</span></NavLink>
                            <AiOutlineSwapRight className="icon" />
                        </button>

                        <span className="forgotPassword">
                            Forgot your password? <a href="">Click Here</a>
                        </span>

                    </form>
                </div>

            </div>
        </div>
    )
}

export default Login;
