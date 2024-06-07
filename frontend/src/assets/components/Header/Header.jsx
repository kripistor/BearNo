import React, {useState, useEffect} from 'react';
import logo from "../../img/Logo.svg";
import "./Header.scss";
import vector from "../../img/Vector.svg";
import LoginForm from "../LoginForm/LoginForm.jsx";
import Modal from 'react-modal';
import Cookies from 'js-cookie';
import {Link} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {useNavigate} from 'react-router-dom';
import UserService from "../../api/UserService.js";

Modal.setAppElement('#root'); // This line is needed for accessibility reasons

export default function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = Cookies.get('access_token');
        setIsLoggedIn(!!token);
    }, []);
    const handleProfileClick = () => {
        const token = Cookies.get('access_token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.is_admin) {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
        } else {
            // Если пользователь не авторизован, перенаправьте его на страницу входа или покажите сообщение об ошибке
            navigate('/');
        }
    };

    const handleLoginClick = () => {
        setIsLoginOpen(true);
    };
    const handleLogout = () => {
        UserService.logout();
        navigate('/'); // перенаправляем пользователя на страницу входа после выхода
        window.location.reload()
    };
    const handleCloseModal = (e) => {
        setIsLoginOpen(false);
        const token = Cookies.get('access_token');
        setIsLoggedIn(!!token);
    };

    const customStyles = {
        overlay: {
            backgroundColor: 'transparent',
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            background: 'white',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '10px',
            outline: 'none',
            boxSizing: 'border-box',
            margin: '0',
            padding: '0'
        }
    };

    return (
        <div className="header-container">

            <Link to="/">
                <img
                    src={logo}
                    alt=""
                    className="logo-container"
                />
            </Link>
            <div className="search-container">
                <input type="text" placeholder="Введите текст для поиска..."/>
                <img src={vector} alt="Search"/>
            </div>

            {isLoggedIn ? (
                <div className="auth-form">
                    <button onClick={handleProfileClick} className="login-button-container">Личный кабинет</button>
                    <button onClick={handleLogout} className="logout-button-container">Выйти</button>
                </div>

            ) : (
                <button className="login-button-container" onClick={handleLoginClick}>Войти</button>

            )
            }

            <Modal
                isOpen={isLoginOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Login Form"
                style={customStyles}
            >
                <LoginForm onClose={handleCloseModal}/>
            </Modal>

        </div>
    );
}