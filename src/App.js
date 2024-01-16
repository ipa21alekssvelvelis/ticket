import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AccessForms from './components/AccessForms';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Landing from './components/Landing';
import EventsPage from './components/EventsPage';

export default function App() {
  return (
    <Router>
      <div className="w-screen overflow-y-scroll flex justify-center align-center items-center bg-[rgb(18,18,18,0.95)]">
      <Header/>
      <Routes>
          <Route exact path="/" element = {<Landing />}/>
          <Route exact path="/AdminPanel" element = {<AdminPanel />}/>
          <Route exact path="/Authenticate" element = {<AccessForms />}/>
          <Route exact path="/Events" element = {<EventsPage />}/>
      </Routes>
      </div>
    </Router>
  );
}