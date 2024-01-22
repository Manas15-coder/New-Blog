import React, { useState } from 'react';
import '../Navbar/Navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store';

const Navbar = () => {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleProfile = () => {
        setIsDropDownOpen(!isDropDownOpen);
    };

    const closeProfile = () => {
        setIsDropDownOpen(false);
    };

    return (
        <div>
            <section id="navbar">
                <div className="nav">
                    <div className="left">
                        <i className="fa-brands fa-facebook" style={{ color: "#000000" }} />
                        <i className="fa-brands fa-instagram" style={{ color: "#000000" }} />
                        <i className="fa-brands fa-square-twitter" />
                    </div>
                    <div className="mid">
                        <Link to='/'><button className='mid-btn'><i className="fa-solid fa-house"></i>Home</button></Link>
                        <Link to='/create-blog'><button className='mid-btn'>Write<i className="fa-regular fa-pen-to-square"></i></button></Link>
                    </div>
                    <div className="right">
                        <i className="fa-regular fa-user profile" onClick={toggleProfile} />
                        {isDropDownOpen && (
                            <div className='dropdown-content' onMouseLeave={closeProfile}>
                                {!isLoggedIn && (<Link to='/login'><button className="dropdown-btn">Sign In</button></Link>)}
                                {isLoggedIn && (<p>Hello, {localStorage.getItem("userName")}</p>)}
                                <Link to='/myBlogs'><button className='dropdown-btn'>My Blogs<i className="fa-regular fa-pen-to-square"></i></button></Link>
                                {isLoggedIn && (<Link to='/'><button onClick={() => dispatch(authActions.logout())} className="dropdown-btn">Log Out</button></Link>)}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Navbar;
