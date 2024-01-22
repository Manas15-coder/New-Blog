import React, { useState } from 'react'
import '../Login/Login.css'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { authActions } from '../../store'
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false)

    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: ""
    })
    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
    const sendRequest = async (type = "login") => {
        try {
            const { data } = await axios.post(`https://new-blog-server.onrender.com/api/user/${type}`, {
                username: inputs.name,
                email: inputs.email,
                password: inputs.password,
            })
            if (data?.success) {
                localStorage.setItem("userId", data?.user._id);
                localStorage.setItem("userName",data?.user.username);
                toast.success('Successfully Logged In')
            }
            return data;
        }
        catch (error) {
            console.log(error);
            toast.error('Error while Log In')
        }
    }
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignUp) {
                // Handle user registration
                const registrationData = await sendRequest("register");
                
                if (registrationData?.success) {
                    // Registration was successful, proceed with login
                    const loginData = await sendRequest();
                    if (loginData?.success) {
                        dispatch(authActions.login());
                        navigate('/');
                        toast.success(loginData.message);
                    } else {
                        console.error('Login failed:', loginData.message);
                        toast.error(loginData.message);
                    }
                } else {
                    console.error('Registration failed:', registrationData.message);
                    toast.error(registrationData.message);
                }
            } else {
                // Handle user login
                const loginData = await sendRequest();
                if (loginData?.success) {
                    dispatch(authActions.login());
                    navigate('/');
                    toast.success(loginData.message);
                } else {
                    console.error('Login failed:', loginData.message);
                    toast.error(loginData.message);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error while processing the request');
        }
    };
    
    return (
        <div>
            <section id="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="login-wrapper">
                                <h2>{isSignUp ? "Sign Up " : "Welcome Back"}</h2>
                                <h3>{isSignUp ? "Sign Up to Access Read and Write Blogs" : "Login to Read the Blogs"}</h3>
                                <form className="form" onSubmit={handleSubmit}>{isSignUp && (<><label htmlFor="name">Name</label> <input type="text" name="name" onChange={handleChange} value={inputs.name} placeholder="Enter Name" className='input' required /></>)}
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" onChange={handleChange} value={inputs.email} placeholder="Enter Email" className='input' required />
                                    <label htmlFor="password">Password</label>
                                    <input type="password" name="password" onChange={handleChange} value={inputs.password} placeholder="Enter Password" className='input' required />
                                    <br />
                                    <br />
                                    <button type="submit" className="login-btn">
                                        {isSignUp ? "Sign Up" : "Login In"}
                                    </button>
                                    <br />
                                    <button className="register" onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? " Already Registered ? Sign In":"Not Registered ? Sign Up "}</button>
                                </form>
                                <Toaster
                                    position="top-center"
                                    reverseOrder={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Login
