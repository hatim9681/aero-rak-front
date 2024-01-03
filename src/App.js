// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sidebar" element={<Sidebar />} />
        </Routes>
    </Router>
  );
}

export default App;
