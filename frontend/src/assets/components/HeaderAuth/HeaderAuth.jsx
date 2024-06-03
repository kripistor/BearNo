import "./HeaderAuth.scss";
import React from "react";
import logo from "../../img/Logo.svg";
export default function HeaderAuth() {
    return (
        <header className="header-auth">
            <img className="logo-container" src={logo}/>
            <button className="login-button-container">Назад</button>
        </header>
    );
};

