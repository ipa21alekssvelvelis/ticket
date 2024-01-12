import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AccessForms from './components/AccessForms';
import Header from './components/Header';
import MainPage from './components/MainPage';

export default function App() {
  return (
    <Router>
      <div className="h-screen w-screen flex justify-center align-center items-center bg-[#f7f1fe]">
        <Header/>
        <Routes>
            <Route exact path="/Home" element = {<MainPage />}/>
            <Route exact path="/Authenticate" element = {<AccessForms />}/>
        </Routes>
      </div>
    </Router>
  );
}