import React, {useState} from "react";
import "./Campaigning.scss";
import logo from "../../img/Logo.svg";
import Modal from 'react-modal';
import RegisterForm from "../../components/RegisterForm/RegisterForm.jsx";

Modal.setAppElement('#root'); // This line is needed for accessibility reasons

export default function Campaigning() {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const handleRegisterClick = () => {
        setIsRegisterOpen(true);
    };

    const handleCloseModal = () => {
        setIsRegisterOpen(false);
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
            borderRadius: '10px', // Add this line to make the edges rounded
            outline: 'none',
            boxSizing: 'border-box',
            margin: '0',
            padding: '0'
        }
    };

    return (
        <section className="registration-section">
            <div className="content-wrapper">
                <h2 className="title">Не нашли свой любимое пиво?</h2>
                <p className="description">
                    Зарегистрируйтесь, что бы получить возможность оценивать и добавлять пиво
                </p>
                <button className="registration-button" onClick={handleRegisterClick}>Регистрация</button>
            </div>
            <img src={logo} className="logo"/>

            <Modal
                isOpen={isRegisterOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Register Form"
                style={customStyles}    
            >
                <RegisterForm onClose={handleCloseModal}/>
            </Modal>
        </section>
    );
}