import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Nav";

function App() {
    return (
        <Router>
            <div className="bg-black min-h-screen">
                <Nav />
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
