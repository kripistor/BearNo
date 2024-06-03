import React, { useState } from 'react';
import UserService from '../../api/UserService';
import close from "../../img/close_small.svg";

const RegisterForm = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await UserService.register(email, username, password);
            onClose();
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    return (
        <div className="login-form">
            <button onClick={onClose} className="close-button">
                <img src={close} alt="Close"/>
            </button>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Логин" required onChange={e => setUsername(e.target.value)} />
                <input type="email" placeholder="Почта" required onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Пароль" required onChange={e => setPassword(e.target.value)} />
                <button type="submit">Зарегестрироваться</button>
            </form>
        </div>
    );
}
export default RegisterForm;