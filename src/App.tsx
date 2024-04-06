import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Nav";
import MainPage from "./components/MainPage";

function App() {
    return (
        <Router>
            <div className="min-h-screen">
                <Nav />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/searched" element={<MainPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
