import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Main from "./assets/pages/main/main.jsx";
import ProductPage from "./assets/pages/ProductPage/ProductPage.jsx"
import UserProfile from "./assets/pages/UserProfile/UserProfile.jsx";
import AdminProfile from "./assets/pages/AdminProfile/AdminProfile.jsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/profile" element={<UserProfile/>}/>
                <Route path="/admin" element={<AdminProfile/>}/>
                <Route path="/product/:id" element={<ProductPage/>}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App