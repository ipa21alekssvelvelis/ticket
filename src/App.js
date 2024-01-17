import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AccessForms from './components/AccessForms';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Landing from './components/Landing';
import EventsPage from './components/EventsPage';
import PaymentForm from './components/PaymentForm';

const stripePromise = loadStripe('pk_test_51OZJj9CRXpjVDtSaA8I4Q1qJHqiGgSw9L85M4CV0bG3ZJCE6e20cMzrYgEhqXn60tKh1BYjeHiHOGzB212mOuR2U00IxFyX068');

export default function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <div className="w-screen overflow-y-scroll flex justify-center align-center items-center bg-[rgb(18,18,18,0.95)]">
        <Header/>
        <Routes>
            <Route exact path="/" element = {<Landing />}/>
            <Route exact path="/AdminPanel" element = {<AdminPanel />}/>
            <Route exact path="/Authenticate" element = {<AccessForms />}/>
            <Route exact path="/Events" element = {<EventsPage />}/>
            <Route exact path="/PaymentForm" element = {<PaymentForm />}/>
        </Routes>
        </div>
      </Router>
    </Elements>
  );
}