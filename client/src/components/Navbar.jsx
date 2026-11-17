import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/AARCEE_MEDICALS.png";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import "../styles/Navbar.css";

const Navbar = () => {
    const { user, isAuthenticated, isStoreOwner, logout, isCustomer } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div id='navbarMain'>
            <div id="navbarLogo">
                <Link to={isStoreOwner() ? "/admin/dashboard" : "/"}>
                    <img id='navbarLogoImage' src={logo} alt="Image" />
                </Link>
            </div>
            <button className="hamburger-menu" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <div id="navbarContent" className={mobileMenuOpen ? 'mobile-menu-open' : ''}>
                <ul id='navbarList'>
                    {isAuthenticated() ? (
                        <>
                            {isStoreOwner() ? (
                                <li>
                                    <Link to="/admin/dashboard">
                                        <div className='navbarListItem'>
                                            <DashboardIcon className='navbarListItemIcon' />
                                            <p>Dashboard</p>
                                        </div>
                                    </Link>
                                </li>
                            ) : (
                                <>
                                <li>
                                    <Link to="/search" onClick={closeMobileMenu}>
                                        <div className='navbarListItem'>
                                            <p>Browse Stores</p>
                                        </div>
                                    </Link>
                                </li>
                                    <li>
                                        <Link to="/cart">
                                            <div className='navbarListItem'>
                                                <ShoppingCartOutlinedIcon className='navbarListItemIcon' />
                                                <p>Cart</p>
                                            </div>
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <div className='navbarListItem' onClick={handleLogout} style={{cursor: 'pointer'}}>
                                    <LogoutIcon className='navbarListItemIcon' />
                                    <p>Logout ({user?.name})</p>
                                </div>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" onClick={closeMobileMenu}>
                                    <div className='navbarListItem'>
                                        <PersonOutlinedIcon className='navbarListItemIcon' />
                                        <p>Login</p>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" onClick={closeMobileMenu}>
                                    <div className='navbarListItem'>
                                        <p>Register</p>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" onClick={closeMobileMenu}>
                                    <div className='navbarListItem'>
                                        <ShoppingCartOutlinedIcon className='navbarListItemIcon' />
                                        <p>Cart</p>
                                    </div>
                                </Link>
                            </li>
                        </>
                    )}
                    <li>
                        <Link to={"/offers"} onClick={closeMobileMenu}>
                            <div className='navbarListItem'>
                                <DiscountOutlinedIcon className='navbarListItemIcon' />
                                <p>Offers</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/need-help"} onClick={closeMobileMenu}>
                            <div className='navbarListItem' id='navbarListItemHelp'>
                                Need Help?
                            </div>
                        </Link>
                    </li>
                    {isAuthenticated() && isCustomer() && (
                        <li>
                            <Link to={"/prescription-upload"} onClick={closeMobileMenu}>
                                <div className='navbarListItem'>
                                    <p>Upload Prescription</p>
                                </div>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Navbar;