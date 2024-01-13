import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AccessForms from './components/AccessForms';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Landing from './components/Landing';

export default function App() {
  return (
    <Router>
      <div className="w-screen flex justify-center align-center items-center bg-[#f7f1fe]">
      <Header/>
        <Routes>
            <Route exact path="/" element = {<Landing />}/>
            <Route exact path="/AdminPanel" element = {<AdminPanel />}/>
            <Route exact path="/Authenticate" element = {<AccessForms />}/>
        </Routes>
      </div>
    </Router>
  );
}