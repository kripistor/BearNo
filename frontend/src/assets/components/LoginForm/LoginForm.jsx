import React, { useState } from 'react';
import './LoginForm.scss';
import close from "../../img/close_small.svg";
import UserService from "../../api/UserService";

const LoginForm = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false); // Добавьте это состояние

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await UserService.login(email, password);
            onClose();
        } catch (error) {
            console.error("Error during login:", error);
            setError(true); // Установите состояние ошибки в true, если произошла ошибка
        }
    };

    return (
        <div className="login-form">
            <button onClick={onClose} className="close-button">
                <img src={close} alt="Close"/>
            </button>
            <h2>Авторизация</h2>
            {error && <p>Проверьте данные</p>} {/* Добавьте это сообщение об ошибке */}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Почта" required onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Пароль" required onChange={e => setPassword(e.target.value)} />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginForm;